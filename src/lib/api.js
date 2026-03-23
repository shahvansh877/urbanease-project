const API_BASE_URL = https://urbanease-project.onrender.com || '';

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  signup: (accountType, payload) => {
    if (accountType === 'provider') {
      const selectedCategory = payload.servicesOffered?.[0] || '';
      const serviceCategory = selectedCategory;

      const providerPayload = {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
        companyName: payload.companyName,
        address: payload.address,
        city: payload.city,
        serviceCategory,
        serviceDescription: payload.serviceDescription || '',
        experience: Number(payload.experience) || 0,
      };

      return apiRequest('/api/auth/signup/provider', { method: 'POST', body: providerPayload });
    }

    if (accountType === 'admin') {
      const adminPayload = {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        adminKey: payload.adminKey,
      };

      return apiRequest('/api/auth/signup/admin', { method: 'POST', body: adminPayload });
    }

    const userPayload = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      address: payload.address,
    };

    return apiRequest('/api/auth/signup/user', { method: 'POST', body: userPayload });
  },
  login: (payload) => apiRequest('/api/auth/login', { method: 'POST', body: payload }),
  me: (token) => apiRequest('/api/auth/me', { token }),
};

export const providersApi = {
  listApproved: (service) => apiRequest(`/api/providers${service ? `?service=${encodeURIComponent(service)}` : ''}`),
  getById: (providerId) => apiRequest(`/api/providers/${providerId}`),
  listForAdmin: (token, status) =>
    apiRequest(`/api/providers/admin/all${status ? `?status=${encodeURIComponent(status)}` : ''}`, { token }),
};

export const adminApi = {
  verifyProvider: (token, providerId, action, rejectionReason = '') =>
    apiRequest(`/api/auth/admin/verify-provider/${providerId}`, {
      method: 'PUT',
      token,
      body: { action, rejectionReason },
    }),
};

export const bookingsApi = {
  create: (token, payload) => apiRequest('/api/bookings', { method: 'POST', token, body: payload }),
  listMy: (token) => apiRequest('/api/bookings/my', { token }),
  listForProvider: (token) => apiRequest('/api/bookings/provider', { token }),
  updateProviderStatus: (token, bookingId, status) =>
    apiRequest(`/api/bookings/${bookingId}/provider-status`, { method: 'PUT', token, body: { status } }),
  pay: (token, bookingId, paymentMethod) =>
    apiRequest(`/api/bookings/${bookingId}/pay`, { method: 'POST', token, body: { paymentMethod } }),
};
