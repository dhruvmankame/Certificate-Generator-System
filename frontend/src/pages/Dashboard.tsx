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
        
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Bulk Generation</h2>
          </div>
          <form onSubmit={handleBulkSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Common Event / Course Name</label>
              <input
                type="text"
                value={bulkEvent}
                onChange={(e) => setBulkEvent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Summer Internship Program 2026"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>Participant Data (JSON Array)</span>
                <span className="text-xs text-gray-400 font-mono">[{'{"recipientName": "A", "email": "a@b.com"}'}]</span>
              </label>
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
                rows={4}
                placeholder="[\n  { &quot;recipientName&quot;: &quot;Alice&quot;, &quot;email&quot;: &quot;alice@example.com&quot; }\n]"
              />
            </div>
            <button
              type="submit"
              disabled={isBulkLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-70"
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