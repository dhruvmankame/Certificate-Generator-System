import { useState, useEffect } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';
import { Download, Ban, ExternalLink, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Certificate {
  _id: string;
  recipientName: string;
  email: string;
  courseOrEventName: string;
  issueDate: string;
  certificateId: string;
  status: string;
}

const CertificateList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/certificates?search=${search}&limit=50`);
      setCertificates(data.certificates);
    } catch (error) {
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [search, refreshTrigger]);

  const handleRevoke = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
    try {
      await api.patch(`/certificates/${id}/revoke`);
      toast.success('Certificate revoked');
      fetchCertificates();
    } catch (error) {
      toast.error('Failed to revoke certificate');
    }
  };

  const handleDownload = async (certificateId: string, name: string) => {
    try {
      const response = await api.get(`/certificates/download/${certificateId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Certificates</h2>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
            placeholder="Search by name, email or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No certificates found matching your criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event/Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issue Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {certificates.map((cert) => (
                <tr key={cert._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{cert.recipientName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{cert.email}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">ID: {cert.certificateId}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {cert.courseOrEventName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(cert.issueDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cert.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                    }`}>
                      {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleDownload(cert.certificateId, cert.recipientName)}
                        className="text-gray-400 hover:text-emerald-600 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <a
                        href={`/verify/${cert.certificateId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
                        title="Verify Link"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                      {cert.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(cert._id)}
                          className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                          title="Revoke Certificate"
                        >
                          <Ban className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CertificateList;