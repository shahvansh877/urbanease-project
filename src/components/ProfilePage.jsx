import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Package,
  LogOut,
  Edit2,
  CheckCircle,
  XCircle,
  Save,
} from 'lucide-react';
import { Navigation } from './Navigation';
import { useAuth } from '../context/AuthContext';
import { adminApi, bookingsApi, providersApi } from '../lib/api';

function prettyStatus(status) {
  if (status === 'pending') return 'Upcoming';
  if (status === 'accepted') return 'Upcoming';
  if (status === 'rejected') return 'Cancelled';
  if (status === 'approved') return 'Accepted';
  if (status === 'completed') return 'Completed';
  return status;
}

function statusClasses(status) {
  if (status === 'completed' || status === 'approved') return 'bg-green-100 text-green-700';
  if (status === 'pending' || status === 'accepted') return 'bg-blue-100 text-blue-700';
  if (status === 'rejected') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
}

function normalizeService(service) {
  if (service === 'General Repair' || service === 'Other') return 'General';
  return service;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, login, logout } = useAuth();
  const role = user?.role;

  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [workingId, setWorkingId] = useState('');

  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        setError('Please login to view profile details.');
        return;
      }

      setLoading(true);
      setError('');
      setSuccess('');

      try {
        if (role === 'user') {
          const response = await bookingsApi.listMy(token);
          setBookings(response.bookings || []);
        } else if (role === 'serviceProvider' || role === 'provider') {
          const response = await bookingsApi.listForProvider(token);
          setBookings(response.bookings || []);
        } else if (role === 'admin') {
          const response = await providersApi.listForAdmin(token);
          setProviders(response.providers || []);
        }
      } catch (err) {
        setError(err.message || 'Unable to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, role, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUserProfileSave = () => {
    if (!profileForm.name.trim()) {
      setError('Name is required.');
      return;
    }

    const updatedUser = {
      ...user,
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      address: profileForm.address.trim(),
    };

    login(updatedUser, token);
    setEditing(false);
    setError('');
    setSuccess('Profile updated successfully.');
  };

  const handleAdminAction = async (providerId, action) => {
    setWorkingId(providerId);
    setError('');
    setSuccess('');

    try {
      await adminApi.verifyProvider(token, providerId, action, action === 'reject' ? 'Rejected from profile panel' : '');
      const response = await providersApi.listForAdmin(token);
      setProviders(response.providers || []);
      setSuccess(`Provider ${action === 'approve' ? 'accepted' : 'rejected'} successfully.`);
    } catch (err) {
      setError(err.message || 'Unable to process request.');
    } finally {
      setWorkingId('');
    }
  };

  const userBookings = useMemo(() => {
    if (role !== 'user') return [];
    if (activeTab === 'all') return bookings;
    if (activeTab === 'upcoming') return bookings.filter((b) => ['pending', 'accepted'].includes(b.bookingStatus));
    if (activeTab === 'completed') return bookings.filter((b) => b.bookingStatus === 'completed');
    return bookings.filter((b) => b.bookingStatus === 'rejected');
  }, [activeTab, bookings, role]);

  const userStats = useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter((b) => ['pending', 'accepted'].includes(b.bookingStatus)).length;
    const completed = bookings.filter((b) => b.bookingStatus === 'completed').length;
    const cancelled = bookings.filter((b) => b.bookingStatus === 'rejected').length;
    return { total, upcoming, completed, cancelled };
  }, [bookings]);

  const providerStats = useMemo(() => {
    const total = bookings.length;
    const completed = bookings.filter((b) => b.bookingStatus === 'completed').length;
    const upcoming = bookings.filter((b) => ['pending', 'accepted'].includes(b.bookingStatus)).length;
    return { total, completed, upcoming };
  }, [bookings]);

  const adminStats = useMemo(() => {
    const pending = providers.filter((p) => p.verificationStatus === 'pending').length;
    const approved = providers.filter((p) => p.verificationStatus === 'approved').length;
    const rejected = providers.filter((p) => p.verificationStatus === 'rejected').length;
    return { pending, approved, rejected };
  }, [providers]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            {role === 'admin'
              ? 'View your admin profile and manage provider verification history.'
              : role === 'serviceProvider' || role === 'provider'
              ? 'View your profile, booking performance, and customer requests.'
              : 'Manage your profile and booking history.'}
          </p>
        </div>

        {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-green-700">{success}</div>}

        {loading && <div className="rounded-xl bg-white p-6 shadow text-gray-600">Loading profile details...</div>}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* ── Left Column: Profile Card + Stats ── */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl text-gray-900 mb-1">{user?.name || 'User'}</h2>
                  <p className="text-gray-500 text-sm capitalize">
                    {role === 'serviceProvider' ? 'Service Provider Account' : role === 'admin' ? 'Admin Account' : 'Customer Account'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900 truncate">{user?.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{user?.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm text-gray-900">{user?.address || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-sm text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {role === 'user' && (
                    <button
                      onClick={() => setEditing((prev) => !prev)}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>{editing ? 'Close Edit' : 'Edit Profile'}</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

            </div>

            {/* ── Right Column: Stats Banner + Edit Form + Booking/Provider History ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Stats Banner */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <Package className="w-6 h-6" />
                  <h3 className="text-lg font-medium">
                    {role === 'admin' ? 'Request Stats' : 'Booking Stats'}
                  </h3>
                </div>

                {role === 'admin' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="md:pr-8 md:border-r border-blue-400">
                      <div className="text-4xl font-bold">{adminStats.pending + adminStats.approved + adminStats.rejected}</div>
                      <p className="text-blue-100 text-sm mt-1">Total Provider Requests</p>
                    </div>
                    <div className="flex flex-wrap gap-8 md:gap-12">
                      <div className="text-center"><p className="text-2xl font-semibold">{adminStats.pending}</p><p className="text-blue-100 text-sm mt-1">Pending</p></div>
                      <div className="text-center"><p className="text-2xl font-semibold">{adminStats.approved}</p><p className="text-blue-100 text-sm mt-1">Accepted</p></div>
                      <div className="text-center"><p className="text-2xl font-semibold">{adminStats.rejected}</p><p className="text-blue-100 text-sm mt-1">Rejected</p></div>
                    </div>
                  </div>
                ) : role === 'serviceProvider' || role === 'provider' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="md:pr-8 md:border-r border-blue-400">
                      <div className="text-4xl font-bold">{providerStats.total}</div>
                      <p className="text-blue-100 text-sm mt-1">Total Bookings Received</p>
                    </div>
                    <div className="flex flex-wrap gap-8 md:gap-12">
                      <div className="text-center"><p className="text-2xl font-semibold">{providerStats.upcoming}</p><p className="text-blue-100 text-sm mt-1">Upcoming</p></div>
                      <div className="text-center"><p className="text-2xl font-semibold">{providerStats.completed}</p><p className="text-blue-100 text-sm mt-1">Completed</p></div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="md:pr-8 md:border-r border-blue-400">
                      <div className="text-4xl font-bold">{userStats.total}</div>
                      <p className="text-blue-100 text-sm mt-1">Services Booked</p>
                    </div>
                    <div className="flex flex-wrap gap-8 md:gap-12">
                      <div className="text-center"><p className="text-2xl font-semibold">{userStats.upcoming}</p><p className="text-blue-100 text-sm mt-1">Upcoming</p></div>
                      <div className="text-center"><p className="text-2xl font-semibold">{userStats.completed}</p><p className="text-blue-100 text-sm mt-1">Completed</p></div>
                      <div className="text-center"><p className="text-2xl font-semibold">{userStats.cancelled}</p><p className="text-blue-100 text-sm mt-1">Cancelled</p></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Profile Form (user only) */}
              {role === 'user' && editing && (
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
                  <h3 className="text-xl text-gray-900">Edit Profile</h3>
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <input
                      value={profileForm.address}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleUserProfileSave}
                    className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}

              {/* User — Booking History */}
              {role === 'user' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <h2 className="text-2xl text-gray-900">My Bookings</h2>
                    <button
                      onClick={() => navigate('/services')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book New Service
                    </button>
                  </div>

                  <div className="flex overflow-x-auto gap-4 mb-6 border-b border-gray-200 pb-1">
                    {[
                      { key: 'all', label: 'All Bookings' },
                      { key: 'upcoming', label: 'Upcoming' },
                      { key: 'completed', label: 'Completed' },
                      { key: 'cancelled', label: 'Cancelled' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 whitespace-nowrap ${
                          activeTab === tab.key
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {userBookings.length === 0 && (
                      <div className="rounded-xl border border-gray-200 p-4 text-gray-600">No booking records found.</div>
                    )}

                    {userBookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl text-gray-900 mb-1">{normalizeService(booking.serviceName)}</h3>
                            <p className="text-gray-600">Provider: {booking.provider?.name || 'N/A'}</p>
                          </div>
                          <div className={`px-4 py-1 rounded-full text-sm ${statusClasses(booking.bookingStatus)}`}>
                            {prettyStatus(booking.bookingStatus)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{booking.scheduledDate}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{booking.scheduledTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">Amount:</span>
                            <span className="text-sm font-medium text-gray-900">₹{booking.amount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Provider — Bookings received */}
              {(role === 'serviceProvider' || role === 'provider') && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl text-gray-900 mb-6">People Who Booked Your Services</h2>

                  {bookings.length === 0 && (
                    <div className="rounded-xl border border-gray-200 p-4 text-gray-600">
                      No bookings yet. Once users book your service, records will appear here.
                    </div>
                  )}

                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-xl p-5">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-lg text-gray-900">{booking.user?.name || 'Customer'}</p>
                            <p className="text-sm text-gray-600">{booking.user?.email || 'N/A'}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${statusClasses(booking.bookingStatus)}`}>
                            {prettyStatus(booking.bookingStatus)}
                          </span>
                        </div>
                        <p className="text-gray-700">Service Opted: {normalizeService(booking.serviceName)}</p>
                        <p className="text-gray-700">Date Booked: {new Date(booking.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-700">Scheduled: {booking.scheduledDate} at {booking.scheduledTime}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin — Provider Requests */}
              {role === 'admin' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl text-gray-900 mb-6">Provider Requests And History</h2>

                  {providers.length === 0 && (
                    <div className="rounded-xl border border-gray-200 p-4 text-gray-600">No provider requests found.</div>
                  )}

                  <div className="space-y-4">
                    {providers.map((provider) => (
                      <div key={provider._id} className="border border-gray-200 rounded-xl p-5">
                        <div className="flex flex-col md:flex-row items-start justify-between mb-3 gap-4">
                          <div>
                            <p className="text-lg text-gray-900">{provider.name}</p>
                            <p className="text-sm text-gray-600">{provider.email}</p>
                            <p className="text-sm text-gray-600">{provider.phone}</p>
                            <p className="text-sm text-gray-700 mt-1">Service: {normalizeService(provider.serviceCategory)}</p>
                          </div>

                          {provider.verificationStatus === 'pending' ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => handleAdminAction(provider._id, 'approve')}
                                disabled={workingId === provider._id}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleAdminAction(provider._id, 'reject')}
                                disabled={workingId === provider._id}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`px-3 py-1 text-sm rounded-full ${statusClasses(provider.verificationStatus)}`}>
                              {prettyStatus(provider.verificationStatus)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Requested On: {new Date(provider.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}