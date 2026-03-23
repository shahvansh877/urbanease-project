import { Navigation } from './Navigation';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { bookingsApi, providersApi } from '../lib/api';
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  User,
  Check,
  Sparkles,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

const SERVICE_DESCRIPTIONS = {
  Cleaning: 'Professional deep cleaning service for your home or office.',
  Plumbing: 'Expert plumbers for repairs, installations, and maintenance.',
  Electrical: 'Licensed electricians for safe and reliable electrical work.',
  Carpentry: 'Skilled carpenters for custom woodwork and furniture repairs.',
  Painting: 'Professional painters for interior and exterior projects.',
  General: 'Handyman services for all your home maintenance needs.',
};

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM',
];

const PRICE_MAP = {
  Cleaning: 120,
  Plumbing: 160,
  Electrical: 180,
  Carpentry: 170,
  Painting: 150,
  General: 140,
  'General Repair': 140,
  Other: 140,
};

const HOURLY_RATE_MAP = {
  Cleaning: 60,
  Plumbing: 80,
  Electrical: 90,
  Carpentry: 85,
  Painting: 75,
  General: 70,
  'General Repair': 70,
  Other: 70,
};

// Convert "9:00 AM" → "09:00" for the API
function toTime24(slot) {
  if (!slot) return '';
  const [time, meridiem] = slot.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (meridiem === 'PM' && h !== 12) h += 12;
  if (meridiem === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useAuth();

  const providerId = searchParams.get('providerId') || '';
  const service = searchParams.get('service') || 'General';
  const providerNameFromQuery = searchParams.get('providerName') || '';
  const companyNameFromQuery = searchParams.get('companyName') || '';
  const serviceDescriptionFromQuery = searchParams.get('serviceDescription') || '';

  const servicePrice = useMemo(() => PRICE_MAP[service] || 140, [service]);
  const tax = +(servicePrice * 0.08).toFixed(2);
  const total = +(servicePrice + tax).toFixed(2);

  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [providerDetails, setProviderDetails] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      if (!providerId) {
        setProviderDetails(null);
        return;
      }

      try {
        const response = await providersApi.getById(providerId);
        setProviderDetails(response.provider || null);
      } catch {
        setProviderDetails(null);
      }
    };

    loadProvider();
  }, [providerId]);

  const handleSubmit = async () => {
    setError('');

    if (!isAuthenticated || user?.role !== 'user') {
      setError('Please login as a user to book services.');
      return;
    }
    if (!providerId) {
      setError('Provider is missing. Please select a provider first.');
      return;
    }
    if (!scheduledDate || !selectedTime || !address) {
      setError('Please fill in date, time, and address.');
      return;
    }

    setLoading(true);
    try {
      const response = await bookingsApi.create(token, {
        providerId,
        serviceName: service,
        address,
        scheduledDate,
        scheduledTime: toTime24(selectedTime),
        notes,
        amount: servicePrice,
        paymentMethod,
      });
      if (response.booking?._id) {
        navigate(`/booking-confirmation?bookingId=${response.booking._id}`);
      } else {
        navigate('/payments');
      }
    } catch (err) {
      setError(err.message || 'Unable to create booking.');
    } finally {
      setLoading(false);
    }
  };

  const serviceDesc =
    serviceDescriptionFromQuery ||
    providerDetails?.serviceDescription ||
    SERVICE_DESCRIPTIONS[service] ||
    'Professional home service tailored to your needs.';
  const hourlyRate = HOURLY_RATE_MAP[service] || 70;
  const providerName = providerNameFromQuery || providerDetails?.name || 'Provider not specified';
  const companyName = companyNameFromQuery || providerDetails?.companyName || 'Provider not specified';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-4xl text-gray-900 mb-2">Book a Service</h1>
          <p className="text-gray-600">Schedule your service and complete your booking</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* ── Left / Centre: Booking Form (col-span-2) ── */}
          <div className="col-span-2 space-y-6">

            {/* Service Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-4">Service Details</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Service</p>
                  <h3 className="text-lg text-gray-900">{service}</h3>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Service Provider</p>
                  <p className="text-gray-900">{providerName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-gray-900">{companyName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">What They Provide</p>
                  <p className="text-gray-600 text-sm">{serviceDesc}</p>
                </div>

                <div className="flex items-center space-x-4 pt-1">
                  <span className="text-blue-600 font-medium">₹{hourlyRate}/hour</span>
                  <span className="text-gray-400 text-sm">• Est. 2-4 hours</span>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-5 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Select Date & Time</span>
              </h2>

              <div className="mb-6">
                <label className="text-sm text-gray-700 mb-2 block">Choose Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-3 block">Choose Time Slot</label>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedTime === slot
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-5 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Contact Information</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-700">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-sm text-gray-700">Service Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter the address where service is needed"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-sm text-gray-700">Additional Notes <span className="text-gray-400">(Optional)</span></label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions or requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-5 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3">
                {[
                  { value: 'card', label: 'Credit / Debit Card', emoji: null, icon: CreditCard },
                  { value: 'cash', label: 'Cash on Service', emoji: '💵', icon: null },
                  { value: 'wallet', label: 'Digital Wallet (PayPal, Venmo)', emoji: '👛', icon: null },
                ].map(({ value, label, emoji, icon: Icon }) => (
                  <label
                    key={value}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    {Icon ? (
                      <Icon className={`w-5 h-5 ${paymentMethod === value ? 'text-blue-600' : 'text-gray-400'}`} />
                    ) : (
                      <span className="text-xl">{emoji}</span>
                    )}
                    <span className={`flex-1 text-sm font-medium ${paymentMethod === value ? 'text-blue-600' : 'text-gray-700'}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Card detail fields */}
              {paymentMethod === 'card' && (
                <div className="mt-5 p-4 bg-gray-50 rounded-xl space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder={user?.name || 'Your name'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Sticky Booking Summary ── */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl text-gray-900 mb-6">Booking Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Service</p>
                    <p className="text-sm font-medium text-gray-900">{service}</p>
                  </div>
                </div>

                {scheduledDate && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(scheduledDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {selectedTime && (
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-medium text-gray-900">{selectedTime}</p>
                    </div>
                  </div>
                )}

                {address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900 leading-snug">{address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-4 mb-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Service Fee</span>
                  <span>₹{servicePrice}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (8%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-blue-600 text-xl">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-base font-medium flex items-center justify-center space-x-2 shadow-lg"
              >
                {loading ? (
                  <span>Creating booking...</span>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                By confirming, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}