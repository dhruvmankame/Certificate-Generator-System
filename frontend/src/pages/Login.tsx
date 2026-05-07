import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check for demonstration (defaulting to 'admin123' if not set)
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      onLogin();
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } else {
      toast.error('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full max-w-md transition-colors duration-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-4">
            <Lock className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Enter the admin password to access the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-400 dark:focus:border-emerald-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              placeholder="Enter password"
              required
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;