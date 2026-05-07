import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import VerifyCertificate from './pages/VerifyCertificate';
import Login from './pages/Login';

// Protected Route Wrapper
const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col transition-colors duration-200">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 pt-24 pb-6 sm:pt-28 sm:pb-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700',
            duration: 3000,
          }}
        />
      </div>
    </Router>
  );
}

export default App;