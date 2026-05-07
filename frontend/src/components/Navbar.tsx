import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Award, CheckCircle, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const handleLogoutClick = () => {
    onLogout();
    toast.success('Logged out successfully');
    navigate('/login');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                <Award className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">
                Amaanitvam<span className="text-emerald-700 dark:text-emerald-400">Cert</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  location.pathname.includes('/dashboard')
                    ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-700 dark:border-emerald-400 py-5'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-5'
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/verify/check"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                location.pathname.includes('/verify')
                  ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-700 dark:border-emerald-400 py-5'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-5'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Verify Certificate
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && (
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-4"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-3 shadow-inner">
          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                location.pathname.includes('/dashboard')
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/verify/check"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
              location.pathname.includes('/verify')
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Verify Certificate
          </Link>
          
          {isAuthenticated && (
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;