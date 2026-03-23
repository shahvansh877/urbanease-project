import { Link, useNavigate } from 'react-router';
import { User, Bell, LogOut, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Ex No: 3b — useContext

// Navigation reads global auth state via useAuth() (useContext under the hood).
// No need to pass isAuthenticated / userType as props from every parent.
export function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const userType = user?.role || 'customer';
  const displayName = user?.name?.trim() || 'Profile';
  const firstName = displayName.includes(' ') ? displayName.split(' ')[0] : displayName;

  const handleLogout = () => {
    logout(); // dispatches LOGOUT action to the reducer
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">U</span>
          </div>
          <span className="text-2xl text-gray-900">UrbanEase</span>
        </Link>
        
        {isAuthenticated ? (
          // Authenticated Navigation
          <div className="flex items-center space-x-6">
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Services
            </Link>
            {userType === 'user' && (
              <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
                Book Now
              </Link>
            )}
            {userType === 'user' && (
              <Link to="/payments" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <CreditCard className="w-4 h-4" />
                <span>Payments</span>
              </Link>
            )}
            {(userType === 'serviceProvider' || userType === 'provider') && (
              <Link to="/provider-dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Provider Dashboard
              </Link>
            )}
            {userType === 'admin' && (
              <Link to="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-300">
              <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>{`Hi, ${firstName}!`}</span>
              </Link>
              
              <button className="p-2 text-gray-700 hover:text-red-600 transition-colors" title="Logout" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          // Default Navigation (Not Authenticated)
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-5 py-2 text-gray-700 hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}