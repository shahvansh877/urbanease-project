import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Building2, Briefcase, Key, Loader2 } from 'lucide-react';
import { Navigation } from './Navigation';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext'; // Ex No: 3b
import { authApi } from '../lib/api';

export function SignupPage() {
  const providerCategories = ['Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'General'];
  const navigate = useNavigate();
  const { login } = useAuth(); // get login action from context
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    address: '', city: '', companyName: '', servicesOffered: [], serviceDescription: '', experience: '', adminKey: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(service) ? [] : [service]
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = { ...formData };

    if (userType !== 'provider') {
      payload.servicesOffered = [];
      payload.companyName = '';
      payload.city = '';
      payload.serviceDescription = '';
      payload.experience = '';
    }

    if (userType !== 'admin') {
      payload.adminKey = '';
    }

    if (userType === 'provider') {
      if (!payload.companyName || !payload.address || !payload.city) {
        setLoading(false);
        setError('Company name, company address and city are required for providers.');
        return;
      }

      if (payload.servicesOffered.length !== 1) {
        setLoading(false);
        setError('Please select one service category from the 6 options.');
        return;
      }
    }

    try {
      const response = await authApi.signup(userType, payload);
      login(response.user, response.token);

      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'provider' || response.user.role === 'serviceProvider') {
        navigate('/provider-dashboard');
      } else {
        navigate('/services');
      }
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-blue-600 text-4xl">U</span>
              </div>
              <h1 className="text-3xl text-white mb-2">Create Account</h1>
              <p className="text-blue-100">Join UrbanEase today</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSignup} className="p-8 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* User Type Selection */}
              <div className="space-y-3">
                <label className="text-sm text-gray-700">I want to sign up as</label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('customer')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      userType === 'customer'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <User className={`w-8 h-8 mx-auto mb-2 ${
                      userType === 'customer' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className={`text-sm ${
                      userType === 'customer' ? 'text-blue-600 font-medium' : 'text-gray-600'
                    }`}>
                      Customer
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setUserType('provider')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      userType === 'provider'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <Briefcase className={`w-8 h-8 mx-auto mb-2 ${
                      userType === 'provider' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className={`text-sm ${
                      userType === 'provider' ? 'text-blue-600 font-medium' : 'text-gray-600'
                    }`}>
                      Service Provider
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setUserType('admin')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      userType === 'admin'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <Key className={`w-8 h-8 mx-auto mb-2 ${
                      userType === 'admin' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className={`text-sm ${
                      userType === 'admin' ? 'text-blue-600 font-medium' : 'text-gray-600'
                    }`}>
                      Admin
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
                
                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
              </div>
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
              
              {/* Address - for Customer and Provider */}
              {(userType === 'customer' || userType === 'provider') && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">{userType === 'provider' ? 'Company Address' : 'Address'}</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={userType === 'provider' ? 'Enter company location/address' : 'Enter your address'}
                      required={userType === 'provider'}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
              )}
              
              {/* Service Provider Specific Fields */}
              {userType === 'provider' && (
                <>
                  <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
                    <h3 className="text-sm text-blue-800 mb-1">Provider Profile Setup</h3>
                    <p className="text-xs text-blue-700">Add professional details to help admin verify your request faster and improve trust with users.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Company Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700">Company City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-700">Experience (Years)</label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        min={0}
                        max={50}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Service Category (choose one)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {providerCategories.map((service) => (
                        <label
                          key={service}
                          className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.servicesOffered.includes(service)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.servicesOffered.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Service Description</label>
                    <textarea
                      rows={3}
                      name="serviceDescription"
                      value={formData.serviceDescription}
                      onChange={handleChange}
                      placeholder="Describe your service speciality, tools, and area coverage"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </>
              )}
              
              {/* Admin Key Field */}
              {userType === 'admin' && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">Admin Key</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Key className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="adminKey"
                      value={formData.adminKey}
                      onChange={handleChange}
                      placeholder="Enter admin access key"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Contact your administrator for the access key</p>
                </div>
              )}
              
              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1" />
                <label className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
              
              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating Account...</>
                ) : (
                  'Create Account'
                )}
              </button>
              
              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <a href="/login" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                    Log in
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}