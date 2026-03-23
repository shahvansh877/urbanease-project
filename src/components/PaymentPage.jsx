import { Navigation } from './Navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsApi } from '../lib/api';

export function PaymentPage() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState('');

  const loadBookings = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const response = await bookingsApi.listMy(token);
      setBookings(response.bookings || []);
    } catch (err) {
      setError(err.message || 'Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [token]);

  const totalPaid = useMemo(
    () => bookings.filter((b) => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0),
    [bookings]
  );

  const handlePay = async (bookingId, paymentMethod) => {
    setPayingId(bookingId);
    setError('');
    try {
      await bookingsApi.pay(token, bookingId, paymentMethod || 'card');
      await loadBookings();
    } catch (err) {
      setError(err.message || 'Payment failed.');
    } finally {
      setPayingId('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />

      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-4xl text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600 mb-6">Pay for your bookings and track payment status.</p>

        <div className="bg-blue-600 text-white rounded-2xl p-6 mb-6">
          <p className="text-blue-100">Total Paid</p>
          <p className="text-4xl">₹{totalPaid.toFixed(2)}</p>
          <p className="text-blue-100 mt-1">{user?.name || 'User'}</p>
        </div>

        {loading && <p className="text-gray-600">Loading bookings...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!loading && bookings.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-gray-600">No bookings found yet.</div>
        )}

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl shadow p-5 border border-gray-100">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl text-gray-900">{booking.serviceName}</h2>
                  <p className="text-gray-600 text-sm">Provider: {booking.provider?.name || 'N/A'}</p>
                  <p className="text-gray-600 text-sm">Date: {booking.scheduledDate} at {booking.scheduledTime}</p>
                  <p className="text-gray-600 text-sm">Booking Status: {booking.bookingStatus}</p>
                  <p className="text-gray-600 text-sm">Payment Status: {booking.paymentStatus}</p>
                  {booking.transactionId && <p className="text-gray-500 text-xs">Transaction: {booking.transactionId}</p>}
                </div>

                <div className="text-right">
                  <p className="text-2xl text-blue-600 mb-2">₹{booking.amount}</p>
                  {booking.paymentStatus !== 'paid' ? (
                    <button
                      onClick={() => handlePay(booking._id, booking.paymentMethod)}
                      disabled={payingId === booking._id}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {payingId === booking._id ? 'Processing...' : 'Pay Now'}
                    </button>
                  ) : (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">Paid</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
