import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Send, CheckCircle, Star, MessageCircle } from 'lucide-react';

const reportTypes = [
  { id: 'feedback', name: 'General Feedback', icon: '💬' },
  { id: 'service_quality', name: 'Service Quality', icon: '⭐' },
  { id: 'suggestion', name: 'Suggestion', icon: '💡' },
  { id: 'technical_issue', name: 'Technical Issue', icon: '🔧' },
  { id: 'billing', name: 'Billing Query', icon: '💰' },
  { id: 'other', name: 'Other', icon: '📝' }
];

export default function Report() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'feedback',
    subject: '',
    message: '',
    rating: 5,
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate email sending
    const report = {
      id: Date.now().toString(),
      userId: user?.id,
      userEmail: `${user?.name?.toLowerCase().replace(' ', '.')}@example.com`,
      userName: user?.name,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'sent'
    };

    // Save to localStorage (in real app, send email)
    const existingReports = JSON.parse(localStorage.getItem(`reports_${user?.id}`) || '[]');
    existingReports.push(report);
    localStorage.setItem(`reports_${user?.id}`, JSON.stringify(existingReports));

    setLoading(false);
    setSuccess(true);

    // Reset form
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        type: 'feedback',
        subject: '',
        message: '',
        rating: 5,
        priority: 'medium'
      });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Sent Successfully!</h2>
          <p className="text-gray-600 mb-6">Your feedback has been sent to the admin team. We value your input and will respond if needed.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">Report ID: RP-{Date.now().toString().slice(-6)}</p>
            <p className="text-green-700 text-sm mt-1">A copy has been sent to your email</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Send Feedback Report</h1>
          <p className="text-gray-600">Share your feedback, suggestions, or report issues with our team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Report Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {reportTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    formData.type === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Subject and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief subject for your report"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Rating (for service quality reports) */}
          {formData.type === 'service_quality' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating }))}
                    className={`p-1 ${rating <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-gray-600">({formData.rating}/5)</span>
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide detailed information about your feedback, suggestion, or issue..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Characters: {formData.message.length} / 1000
            </p>
          </div>

          {/* Contact Information Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{user?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2 font-medium">{user?.phone}</span>
              </div>
              <div>
                <span className="text-gray-600">User ID:</span>
                <span className="ml-2 font-medium">{user?.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Account Type:</span>
                <span className="ml-2 font-medium capitalize">{user?.type}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Report...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Report to Admin
              </>
            )}
          </button>
        </form>

        {/* Information Panel */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start">
            <MessageCircle className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">How We Handle Your Reports</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• All reports are sent directly to our admin team via email</li>
                <li>• You'll receive an automatic confirmation with a reference number</li>
                <li>• We typically respond within 24-48 hours for non-urgent matters</li>
                <li>• Urgent issues are prioritized and handled immediately</li>
                <li>• Your feedback helps us improve our services continuously</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}