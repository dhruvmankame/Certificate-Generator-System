import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FilePlus } from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

const GenerateSingleForm: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    recipientName: '',
    email: '',
    courseOrEventName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/certificates/generate', formData);
      toast.success('Certificate generated successfully!');
      setFormData({ recipientName: '', email: '', courseOrEventName: '' });
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <FilePlus className="h-5 w-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-gray-800">Generate New Certificate</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event / Course Name</label>
          <input
            type="text"
            name="courseOrEventName"
            value={formData.courseOrEventName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Web Development Bootcamp 2026"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70 flex justify-center items-center"
        >
          {loading ? 'Generating...' : 'Generate Certificate'}
        </button>
      </form>
    </div>
  );
};

export default GenerateSingleForm;