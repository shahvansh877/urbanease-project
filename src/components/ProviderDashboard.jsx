import { Navigation } from './Navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsApi } from '../lib/api';

export function ProviderDashboard() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workingId, setWorkingId] = useState('');

  const loadBookings = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const response = await bookingsApi.listForProvider(token);
      setBookings(response.bookings || []);
    } catch (err) {
      setError(err.message || 'Unable to load provider bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [token]);

  const updateStatus = async (bookingId, status) => {
    setWorkingId(bookingId);
    setError('');
    try {
      await bookingsApi.updateProviderStatus(token, bookingId, status);
      await loadBookings();
    } catch (err) {
      setError(err.message || 'Unable to update booking status.');
    } finally {
      setWorkingId('');
    }
  };

  const pendingCount = useMemo(() => bookings.filter((b) => b.bookingStatus === 'pending').length, [bookings]);

  if (user?.role !== 'serviceProvider' && user?.role !== 'provider') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-red-600">Access denied. Provider only.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-4xl text-gray-900 mb-2">Provider Dashboard</h1>
        <p className="text-gray-600 mb-2">See bookings from users and manage requests.</p>
        <p className="text-sm text-gray-500 mb-6">You can access bookings only after admin approval.</p>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Verification Status</p>
          <p className={`text-base ${user?.verificationStatus === 'approved' ? 'text-green-700' : user?.verificationStatus === 'rejected' ? 'text-red-700' : 'text-amber-700'}`}>
            {(user?.verificationStatus || 'pending').toUpperCase()}
          </p>
          {user?.verificationStatus === 'rejected' && user?.rejectionReason && (
            <p className="mt-1 text-sm text-red-600">Reason: {user.rejectionReason}</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-5 mb-6">Pending Requests: {pendingCount}</div>

        {loading && <p className="text-gray-600">Loading bookings...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-xl text-gray-900">{booking.serviceName}</h2>
                  <p className="text-gray-600">Customer: {booking.user?.name || 'N/A'}</p>
                  <p className="text-gray-600">Email: {booking.user?.email || 'N/A'}</p>
                  <p className="text-gray-600">Phone: {booking.user?.phone || 'N/A'}</p>
                  <p className="text-gray-600">Address: {booking.address}</p>
                  <p className="text-gray-600">Schedule: {booking.scheduledDate} at {booking.scheduledTime}</p>
                  <p className="text-gray-600">Booking Status: {booking.bookingStatus}</p>
                  <p className="text-gray-600">Payment Status: {booking.paymentStatus}</p>
                </div>

                {booking.bookingStatus === 'pending' ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(booking._id, 'accepted')}
                      disabled={workingId === booking._id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(booking._id, 'rejected')}
                      disabled={workingId === booking._id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => updateStatus(booking._id, 'completed')}
                    disabled={workingId === booking._id || booking.bookingStatus === 'completed'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
