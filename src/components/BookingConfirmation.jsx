import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import jsPDF from 'jspdf';
import { Navigation } from './Navigation';
import { useAuth } from '../context/AuthContext';
import { bookingsApi } from '../lib/api';
import {
  Check,
  Calendar,
  Clock,
  MapPin,
  User,
  Building2,
  Wrench,
  DollarSign,
  Download,
  ArrowLeft,
} from 'lucide-react';

export function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const confirmationRef = useRef(null);

  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId || !token) {
        setError('Booking not found. Please try again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await bookingsApi.listMy(token);
        const found = response.bookings?.find((b) => b._id === bookingId);
        if (found) {
          setBooking(found);
        } else {
          setError('Booking not found.');
        }
      } catch (err) {
        setError(err.message || 'Unable to load booking details.');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, token]);

  const handleDownloadPDF = async () => {
    if (!booking) return;

    setDownloading(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

      // Helper function to add text with wrapping
      const addWrappedText = (text, x, y, maxWidth, fontSize = 10, bold = false) => {
        pdf.setFontSize(fontSize);
        if (bold) pdf.setFont(undefined, 'bold');
        else pdf.setFont(undefined, 'normal');

        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + lines.length * (fontSize / 2.5) + 2;
      };

      // Header
      yPosition = addWrappedText('BOOKING CONFIRMATION', margin, yPosition, contentWidth, 16, true);
      yPosition += 5;

      // Confirmation Details
      yPosition = addWrappedText(`Confirmation ID: ${booking._id}`, margin, yPosition, contentWidth, 9);
      yPosition = addWrappedText(
        `Booked on: ${new Date(booking.createdAt).toLocaleString()}`,
        margin,
        yPosition,
        contentWidth,
        9
      );
      yPosition += 8;

      // Service Details Section
      yPosition = addWrappedText('SERVICE DETAILS', margin, yPosition, contentWidth, 12, true);
      yPosition += 3;

      const details = [
        ['Service Type:', booking.serviceName],
        ['Service Provider:', booking.provider?.name || 'N/A'],
        ['Company:', booking.provider?.companyName || 'N/A'],
      ];

      details.forEach(([label, value]) => {
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        pdf.text(label, margin, yPosition);
        pdf.setFont(undefined, 'normal');
        const lines = pdf.splitTextToSize(String(value), contentWidth - 60);
        pdf.text(lines, margin + 55, yPosition);
        yPosition += Math.max(lines.length * 5, 7);
      });

      yPosition += 5;

      // Schedule Section
      yPosition = addWrappedText('SCHEDULE', margin, yPosition, contentWidth, 12, true);
      yPosition += 3;

      const scheduleData = [
        ['Date:', booking.scheduledDate],
        ['Time:', booking.scheduledTime],
      ];

      scheduleData.forEach(([label, value]) => {
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        pdf.text(label, margin, yPosition);
        pdf.setFont(undefined, 'normal');
        pdf.text(String(value), margin + 55, yPosition);
        yPosition += 7;
      });

      yPosition += 5;

      // Location Section
      yPosition = addWrappedText('SERVICE LOCATION', margin, yPosition, contentWidth, 12, true);
      yPosition += 3;
      yPosition = addWrappedText(booking.address, margin, yPosition, contentWidth, 10);

      if (booking.notes) {
        yPosition += 5;
        yPosition = addWrappedText('ADDITIONAL NOTES', margin, yPosition, contentWidth, 12, true);
        yPosition += 3;
        yPosition = addWrappedText(booking.notes, margin, yPosition, contentWidth, 10);
      }

      yPosition += 8;

      // Payment Section
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition, contentWidth, 35, 'F');

      yPosition += 3;
      yPosition = addWrappedText('PAYMENT INFORMATION', margin + 3, yPosition, contentWidth - 6, 11, true);
      yPosition += 3;

      const paymentData = [
        ['Amount:', `₹${booking.amount?.toFixed(2) || '0.00'}`],
        ['Payment Method:', (booking.paymentMethod || 'Card').charAt(0).toUpperCase() + (booking.paymentMethod || 'card').slice(1)],
        ['Status:', booking.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'],
      ];

      paymentData.forEach(([label, value]) => {
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        pdf.text(label, margin + 3, yPosition);
        pdf.setFont(undefined, 'normal');
        pdf.text(String(value), margin + 50, yPosition);
        yPosition += 6;
      });

      // Booking Status
      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.text('Booking Status:', margin, yPosition);
      pdf.setFont(undefined, 'normal');
      pdf.text(booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1), margin + 55, yPosition);

      // Footer
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'normal');
      pdf.text('Thank you for booking with UrbanEase!', pageWidth / 2, pageHeight - 10, { align: 'center' });

      pdf.save(`booking-confirmation-${booking._id}.pdf`);
    } catch (err) {
      console.error('PDF Download Error:', err);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-8 py-12">
          <p className="text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-8 py-12">
          <p className="text-red-600">{error || 'Booking not found.'}</p>
          <button
            onClick={() => navigate('/services')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const confirmationDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your service has been successfully booked. Details below.</p>
        </div>

        {/* Confirmation Content */}
        <div
          ref={confirmationRef}
          className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-8"
          id="booking-confirmation"
        >
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl text-gray-900 mb-2">Booking Receipt</h2>
                <p className="text-gray-600 text-sm">Confirmation ID: {booking._id}</p>
                <p className="text-gray-600 text-sm">Booked on: {confirmationDate}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-3xl text-green-600 font-bold">₹{booking.amount?.toFixed(2) || '0.00'}</p>
                <p className="text-gray-600 text-sm mt-1">Total Amount</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="mb-6">
            <h3 className="text-lg text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              Service Details
            </h3>
            <div className="space-y-3 pl-0 md:pl-7">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-gray-600">Service Type</span>
                <span className="text-gray-900 font-medium">{booking.serviceName}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-gray-600">Service Provider</span>
                <span className="text-gray-900 font-medium">{booking.provider?.name || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-gray-600">Company</span>
                <span className="text-gray-900 font-medium">{booking.provider?.companyName || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Schedule Details */}
          <div className="mb-6">
            <h3 className="text-lg text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Schedule
            </h3>
            <div className="space-y-3 pl-0 md:pl-7">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-900 font-medium">{booking.scheduledDate}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-gray-600">Time</span>
                <span className="text-gray-900 font-medium">{booking.scheduledTime}</span>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="mb-6">
            <h3 className="text-lg text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Service Location
            </h3>
            <p className="text-gray-900 pl-0 md:pl-7">{booking.address}</p>
          </div>

          {/* Additional Notes */}
          {booking.notes && (
            <div className="mb-6">
              <h3 className="text-lg text-gray-900 font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Additional Notes
              </h3>
              <p className="text-gray-600 pl-0 md:pl-7">{booking.notes}</p>
            </div>
          )}

          {/* Payment Details */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Payment Information
            </h3>
            <div className="space-y-2 pl-0 md:pl-7">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-gray-600">Amount</span>
                <span className="text-gray-900">₹{booking.amount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900 capitalize">{booking.paymentMethod || 'Card'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Status */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-4 border-t border-gray-200">
            <div>
              <p className="text-gray-600 text-sm">Booking Status</p>
              <p className="text-lg text-gray-900 font-semibold capitalize">{booking.bookingStatus}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                booking.bookingStatus === 'pending'
                  ? 'bg-blue-100 text-blue-700'
                  : booking.bookingStatus === 'accepted'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex-1 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-base font-medium flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Downloading...' : 'Download as PDF'}
          </button>
          <button
            onClick={() => navigate('/payments')}
            className="flex-1 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-base font-medium"
          >
            Proceed to Payment
          </button>
        </div>

        {/* Help and Return */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </button>
        </div>
      </div>
    </div>
  );
}
