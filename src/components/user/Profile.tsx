import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Phone, MapPin, Home, CreditCard, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    houseNo: user?.houseNo || '',
    type: user?.type || 'home'
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      houseNo: user?.houseNo || '',
      type: user?.type || 'home'
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-10 w-10" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-green-100">Member since {new Date().getFullYear()}</p>
                <div className="flex items-center mt-2">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="font-semibold">{user?.credits || 0} Credits</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user?.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Home className="inline h-4 w-4 mr-2" />
                    House/Office Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.houseNo}
                      onChange={(e) => setFormData({...formData, houseNo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{user?.houseNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'home' | 'organization'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="home">Home</option>
                      <option value="organization">Organization</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 font-medium capitalize">{user?.type}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Account Summary */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Account Summary</h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Account Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">User ID:</span>
                    <span className="font-medium">{user?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aadhar:</span>
                    <span className="font-medium">****-****-{user?.aadhar?.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium capitalize">{user?.role}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">Reward Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Total Credits:</span>
                    <span className="font-bold text-green-800">{user?.credits || 0}</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((user?.credits || 0) / 500 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-green-600">
                    {500 - (user?.credits || 0)} credits to next reward level
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">Activity Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Bookings:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Waste Collected:</span>
                    <span className="font-medium">0 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Bottles Exchanged:</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}