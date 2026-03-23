import { Navigation } from './Navigation';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { providersApi } from '../lib/api';

const normalizeServiceName = (serviceName) => {
  if (serviceName === 'Other' || serviceName === 'General Repair') {
    return 'General';
  }
  return serviceName;
};

export function ProvidersListPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedService = searchParams.get('service') || 'All';

  useEffect(() => {
    setServiceFilter(selectedService);
  }, [selectedService]);

  useEffect(() => {
    const loadProviders = async () => {
      setLoading(true);
      setError('');
      try {
        const service = serviceFilter === 'All' ? '' : serviceFilter;
        const response = await providersApi.listApproved(service);
        setProviders(response.providers || []);
      } catch (err) {
        setError(err.message || 'Unable to load providers.');
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [serviceFilter]);

  const handleServiceFilter = (e) => {
    const nextService = e.target.value;
    setServiceFilter(nextService);

    if (nextService === 'All') {
      setSearchParams({});
      return;
    }

    setSearchParams({ service: nextService });
  };

  const serviceOptions = ['All', 'Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'General'];

  const filtered = providers.filter((provider) => {
    const text = searchTerm.toLowerCase();
    const providerService = normalizeServiceName(provider.serviceCategory);

    return (
      provider.name.toLowerCase().includes(text) ||
      provider.email.toLowerCase().includes(text) ||
      providerService.toLowerCase().includes(text)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
        <h1 className="text-3xl md:text-4xl text-gray-900 mb-2">Choose a Service Provider</h1>
        <p className="text-gray-600 mb-8">Only admin-approved providers are listed here.</p>

        <div className="bg-white rounded-2xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search provider by name or email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600"
          />
          <select
            value={serviceFilter}
            onChange={handleServiceFilter}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 bg-white"
          >
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-gray-600">Loading providers...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-gray-600">No approved providers found.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {filtered.map((provider) => {
            const providerService = normalizeServiceName(provider.serviceCategory);

            return (
              <div key={provider._id} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                <h2 className="text-2xl text-gray-900">{provider.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Company: {provider.companyName || 'Not provided'}</p>
                <p className="text-gray-600 mt-1">{provider.email}</p>
                <p className="text-gray-600">{provider.phone}</p>
                <p className="text-gray-700 mt-3">Service: {providerService}</p>
                <p className="text-gray-700">City: {provider.city}</p>
                <p className="text-gray-700">Experience: {provider.experience} years</p>

                <button
                  onClick={() =>
                    navigate(
                      `/booking?providerId=${provider._id}&service=${encodeURIComponent(providerService)}&providerName=${encodeURIComponent(provider.name || '')}&companyName=${encodeURIComponent(provider.companyName || '')}&serviceDescription=${encodeURIComponent(provider.serviceDescription || '')}`
                    )
                  }
                  className="mt-5 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Book This Provider
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
