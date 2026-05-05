import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Award, CheckCircle, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <Award className="h-6 w-6 text-emerald-700" />
              </div>
              <span className="font-bold text-xl text-gray-800 tracking-tight">
                Amaanitvam<span className="text-emerald-700">Cert</span>
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  location.pathname.includes('/dashboard')
                    ? 'text-emerald-700 border-b-2 border-emerald-700 py-5'
                    : 'text-gray-500 hover:text-gray-900 py-5'
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/verify/check"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                location.pathname.includes('/verify')
                  ? 'text-emerald-700 border-b-2 border-emerald-700 py-5'
                  : 'text-gray-500 hover:text-gray-900 py-5'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Verify Certificate
            </Link>
            
            {isAuthenticated && (
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors ml-4"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;