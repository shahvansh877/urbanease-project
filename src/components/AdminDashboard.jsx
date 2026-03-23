import { Navigation } from './Navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi, providersApi } from '../lib/api';

function mapStatus(status) {
  if (status === 'approved') return 'accepted';
  return status;
}

function mapService(service) {
  if (service === 'General Repair' || service === 'Other') return 'General';
  return service;
}

export function AdminDashboard() {
  const { token, user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workingId, setWorkingId] = useState('');

  const loadProviders = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const response = await providersApi.listForAdmin(token);
      setProviders(response.providers || []);
    } catch (err) {
      setError(err.message || 'Unable to load providers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, [token]);

  const handleAction = async (providerId, action) => {
    setWorkingId(providerId);
    setError('');
    try {
      await adminApi.verifyProvider(token, providerId, action, action === 'reject' ? 'Rejected by admin' : '');
      await loadProviders();
    } catch (err) {
      setError(err.message || 'Action failed.');
    } finally {
      setWorkingId('');
    }
  };

  const pending = useMemo(() => providers.filter((p) => p.verificationStatus === 'pending').length, [providers]);
  const accepted = useMemo(() => providers.filter((p) => p.verificationStatus === 'approved').length, [providers]);
  const rejected = useMemo(() => providers.filter((p) => p.verificationStatus === 'rejected').length, [providers]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-4 md:p-8 text-red-600">Access denied. Admin only.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Accept or reject service provider registrations.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow">Pending: {pending}</div>
          <div className="bg-white rounded-xl p-5 shadow">Accepted: {accepted}</div>
          <div className="bg-white rounded-xl p-5 shadow">Rejected: {rejected}</div>
        </div>

        {loading && <p className="text-gray-600">Loading providers...</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider._id} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6">
                <div>
                  <h2 className="text-2xl text-gray-900">{provider.name}</h2>
                  <p className="text-gray-600">Company: {provider.companyName || 'Not provided'}</p>
                  <p className="text-gray-600">{provider.email}</p>
                  <p className="text-gray-600">{provider.phone}</p>
                  <p className="text-gray-600">Service: {mapService(provider.serviceCategory)}</p>
                  <p className="text-gray-600">Address: {provider.address}, {provider.city}</p>
                  <p className="text-gray-600">Status: {mapStatus(provider.verificationStatus)}</p>
                </div>

                {provider.verificationStatus === 'pending' ? (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleAction(provider._id, 'approve')}
                      disabled={workingId === provider._id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(provider._id, 'reject')}
                      disabled={workingId === provider._id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 capitalize">
                    {mapStatus(provider.verificationStatus)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
