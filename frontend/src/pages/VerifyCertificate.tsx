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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
          <Award className="h-8 w-8 text-emerald-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Verification</h1>
        <p className="text-gray-500">Verify the authenticity of Amaanitvam Foundation certificates.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="pl-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter Certificate ID (e.g. A1B2C3D4E5)"
            className="w-full py-4 px-4 outline-none text-gray-700 bg-transparent"
          />
          <button
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Verify
          </button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Verifying record...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-red-800 mb-1">Verification Failed</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {verificationResult && verificationResult.valid && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 text-emerald-100 opacity-50 pointer-events-none">
            <Award className="h-48 w-48" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <h2 className="text-2xl font-bold text-emerald-800">Authentic Certificate</h2>
            </div>
            
            <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-emerald-100/50">
              <div>
                <p className="text-sm text-emerald-600/80 font-medium uppercase tracking-wider mb-1">Recipient</p>
                <p className="text-xl font-bold text-gray-900">{verificationResult.certificate.recipientName}</p>
              </div>
              <div>
                <p className="text-sm text-emerald-600/80 font-medium uppercase tracking-wider mb-1">Event / Course</p>
                <p className="text-lg text-gray-800">{verificationResult.certificate.courseOrEventName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-emerald-600/80 font-medium uppercase tracking-wider mb-1">Issue Date</p>
                  <p className="text-gray-800 font-medium">
                    {format(new Date(verificationResult.certificate.issueDate), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-emerald-600/80 font-medium uppercase tracking-wider mb-1">Certificate ID</p>
                  <p className="text-gray-800 font-mono font-medium">{verificationResult.certificate.certificateId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {verificationResult && !verificationResult.valid && verificationResult.error === 'Certificate has been revoked' && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
          <XCircle className="h-12 w-12 text-orange-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-orange-800 mb-1">Certificate Revoked</h3>
          <p className="text-orange-600">This certificate was issued but has since been revoked by the administration.</p>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;