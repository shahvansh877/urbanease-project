import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Navigation } from './Navigation';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext'; // Ex No: 3b
import { authApi } from '../lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // get login action from context
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      login(response.user, response.token);

      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'provider' || response.user.role === 'serviceProvider') {
        navigate('/provider-dashboard');
      } else {
        navigate('/services');
      }
    } catch (err) {
      setError(err.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-blue-600 text-4xl">U</span>
              </div>
              <h1 className="text-3xl text-white mb-2">Welcome Back</h1>
              <p className="text-blue-100">Log in to access your account</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
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
              
              {/* Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Forgot Password?
                </a>
              </div>
              
              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Logging in...</>
                ) : (
                  'Log In'
                )}
              </button>
              
              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">Or continue with</span>
                </div>
              </div>
              
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm text-gray-700">Google</span>
                </button>
                
                <button className="py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm text-gray-700">Facebook</span>
                </button>
              </div>
              
              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <a href="/signup" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                    Sign up
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