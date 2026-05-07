import React, { useState } from 'react';
import GenerateSingleForm from '../components/GenerateSingleForm';
import CertificateList from '../components/CertificateList';
import { Users } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [refreshList, setRefreshList] = useState(0);
  const [bulkData, setBulkData] = useState('');
  const [bulkEvent, setBulkEvent] = useState('');
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const handleSuccess = () => {
    setRefreshList(prev => prev + 1);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkData || !bulkEvent) {
      toast.error('Please provide event name and JSON data');
      return;
    }

    try {
      const parsedData = JSON.parse(bulkData);
      if (!Array.isArray(parsedData)) {
        throw new Error('Data must be a JSON array');
      }

      setIsBulkLoading(true);
      await api.post('/certificates/bulk-generate', {
        certificates: parsedData,
        courseOrEventName: bulkEvent
      });
      
      toast.success('Bulk certificates generated successfully!');
      setBulkData('');
      setBulkEvent('');
      handleSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Invalid JSON format or server error');
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <GenerateSingleForm onSuccess={handleSuccess} />
        </div>
        
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Bulk Generation</h2>
          </div>
          <form onSubmit={handleBulkSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Common Event / Course Name</label>
              <input
                type="text"
                value={bulkEvent}
                onChange={(e) => setBulkEvent(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="Summer Internship Program 2026"
              />
            </div>
            <div className="mb-4">
              <label className="flex flex-col sm:flex-row sm:justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 gap-1">
                <span>Participant Data (JSON Array)</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono sm:self-center">[{'{"recipientName": "Priya", "email": "p@example.com"}'}]</span>
              </label>
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors font-mono text-sm"
                rows={4}
                placeholder="[\n  { &quot;recipientName&quot;: &quot;Priya Patil&quot;, &quot;email&quot;: &quot;priyapatil04@gmail.com&quot; },\n  { &quot;recipientName&quot;: &quot;Rohan Deshmukh&quot;, &quot;email&quot;: &quot;rohan.deshmukh@outlook.com&quot; }\n]"
              />
            </div>
            <button
              type="submit"
              disabled={isBulkLoading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-70"
            >
              {isBulkLoading ? 'Processing...' : 'Generate Bulk Certificates'}
            </button>
          </form>
        </div>
      </div>

      <CertificateList refreshTrigger={refreshList} />
    </div>
  );
};

export default Dashboard;