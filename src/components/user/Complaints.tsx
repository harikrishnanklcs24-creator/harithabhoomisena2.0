import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Camera, MapPin, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Complaints() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'illegal_dumping'
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [complaints, setComplaints] = useState(() => {
    return JSON.parse(localStorage.getItem(`complaints_${user?.id}`) || '[]');
  });

  const categories = [
    { id: 'illegal_dumping', name: 'Illegal Dumping' },
    { id: 'overflowing_bins', name: 'Overflowing Bins' },
    { id: 'missed_collection', name: 'Missed Collection' },
    { id: 'poor_service', name: 'Poor Service' },
    { id: 'contamination', name: 'Waste Contamination' },
    { id: 'other', name: 'Other' }
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ 
            ...prev, 
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
          }));
        },
        (error) => {
          alert('Unable to retrieve your location. Please enter manually.');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate image upload
    let imageUrl = '';
    if (selectedImage) {
      imageUrl = imagePreview; // In real app, upload to server
    }

    const complaint = {
      id: Date.now().toString(),
      userId: user?.id,
      ...formData,
      imageUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
      responses: []
    };

    const newComplaints = [...complaints, complaint];
    setComplaints(newComplaints);
    localStorage.setItem(`complaints_${user?.id}`, JSON.stringify(newComplaints));

    setLoading(false);
    setSuccess(true);

    // Reset form
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        category: 'illegal_dumping'
      });
      setSelectedImage(null);
      setImagePreview('');
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Complaint Submitted!</h2>
          <p className="text-gray-600 mb-6">Your complaint has been sent to the admin team. We'll investigate and respond soon.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">Complaint ID: CP-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <MessageSquare className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">File a Complaint</h1>
          <p className="text-gray-600">Report illegal dumping or waste management issues</p>
        </div>

        {/* Complaint Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complaint Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Brief title for your complaint"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Describe the issue in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter location or coordinates"
                required
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Current
              </button>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo Evidence
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs max-h-48 mx-auto rounded-lg mb-4"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview('');
                    }}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Add photos to support your complaint</p>
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              'Submitting...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Complaint
              </>
            )}
          </button>
        </form>
      </div>

      {/* Complaint History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Complaints</h2>
        
        {complaints.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No complaints filed yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint: any) => (
              <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{complaint.title}</h3>
                    <p className="text-sm text-gray-600">
                      {categories.find(c => c.id === complaint.category)?.name}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      <span className="ml-1">{complaint.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{complaint.description}</p>
                
                {complaint.imageUrl && (
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint evidence"
                    className="w-32 h-32 object-cover rounded-lg mb-3"
                  />
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>📍 {complaint.location}</span>
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  <span>CP-{complaint.id.slice(-6)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}