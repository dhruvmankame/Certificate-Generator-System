import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, XCircle, Search, Award } from 'lucide-react';
import { format } from 'date-fns';

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  
  const [searchInput, setSearchInput] = useState(certificateId === 'check' ? '' : certificateId || '');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = async (id: string) => {
    if (!id || id === 'check') return;
    setLoading(true);
    setError('');
    setVerificationResult(null);
    try {
      const { data } = await api.get(`/certificates/verify/${id}`);
      setVerificationResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify certificate');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId && certificateId !== 'check') {
      verify(certificateId);
    }
  }, [certificateId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/verify/${searchInput.trim()}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-4 transition-colors">
          <Award className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Certificate Verification</h1>
        <p className="text-gray-500 dark:text-gray-400 transition-colors">Verify the authenticity of Amaanitvam Foundation certificates.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 mb-8 transition-colors duration-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center flex-1 px-2">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 ml-2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter ID (e.g. A1B2...)"
              className="w-full py-3 px-3 outline-none text-gray-700 dark:text-white bg-transparent min-w-0"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors w-full sm:w-auto text-center"
          >
            Verify
          </button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 dark:border-emerald-400 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Verifying record...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-6 text-center transition-colors">
          <XCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1">Verification Failed</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {verificationResult && verificationResult.valid && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-8 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 text-emerald-100 dark:text-emerald-900/30 opacity-50 pointer-events-none">
            <Award className="h-48 w-48" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">Authentic Certificate</h2>
            </div>
            
            <div className="space-y-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-emerald-100/50 dark:border-emerald-800/30 transition-colors">
              <div>
                <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 font-medium uppercase tracking-wider mb-1">Recipient</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{verificationResult.certificate.recipientName}</p>
              </div>
              <div>
                <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 font-medium uppercase tracking-wider mb-1">Event / Course</p>
                <p className="text-lg text-gray-800 dark:text-gray-200 transition-colors">{verificationResult.certificate.courseOrEventName}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-100/50 dark:border-emerald-800/30">
                <div>
                  <p className="text-xs sm:text-sm text-emerald-600/80 dark:text-emerald-400/80 font-medium uppercase tracking-wider mb-1">Issue Date</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium transition-colors">
                    {format(new Date(verificationResult.certificate.issueDate), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-emerald-600/80 dark:text-emerald-400/80 font-medium uppercase tracking-wider mb-1">Certificate ID</p>
                  <p className="text-gray-800 dark:text-gray-200 font-mono font-medium break-all transition-colors">{verificationResult.certificate.certificateId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {verificationResult && !verificationResult.valid && verificationResult.error === 'Certificate has been revoked' && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-xl p-6 text-center transition-colors">
          <XCircle className="h-12 w-12 text-orange-500 dark:text-orange-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-orange-800 dark:text-orange-300 mb-1">Certificate Revoked</h3>
          <p className="text-orange-600 dark:text-orange-400">This certificate was issued but has since been revoked by the administration.</p>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
