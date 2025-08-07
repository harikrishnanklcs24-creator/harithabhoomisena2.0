import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MapPin, Trash2, Weight, Clock, CheckCircle } from 'lucide-react';

const wasteTypes = [
  { id: 'plastic', name: 'Plastic', color: 'bg-blue-500' },
  { id: 'metal', name: 'Metal', color: 'bg-gray-500' },
  { id: 'glass', name: 'Glass', color: 'bg-green-500' },
  { id: 'paper', name: 'Paper', color: 'bg-yellow-500' },
  { id: 'organic', name: 'Organic', color: 'bg-orange-500' },
  { id: 'others', name: 'Others', color: 'bg-purple-500' }
];

export default function BookWaste() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    wasteType: '',
    weight: '',
    date: '',
    time: '',
    location: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const booking = {
      id: Date.now().toString(),
      userId: user?.id,
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage (in real app, this would be an API call)
    const existingBookings = JSON.parse(localStorage.getItem(`bookings_${user?.id}`) || '[]');
    existingBookings.push(booking);
    localStorage.setItem(`bookings_${user?.id}`, JSON.stringify(existingBookings));

    setLoading(false);
    setSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        wasteType: '',
        weight: '',
        date: '',
        time: '',
        location: '',
        address: '',
        notes: ''
      });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your waste collection appointment has been scheduled. We'll contact you soon with pickup details.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">Booking ID: WC-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Waste Collection</h1>
          <p className="text-gray-600">Schedule a pickup for your recyclable waste</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Waste Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Trash2 className="inline h-4 w-4 mr-2" />
              Select Waste Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {wasteTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, wasteType: type.id }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.wasteType === type.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 ${type.color} rounded mb-2 mx-auto`}></div>
                  <span className="text-sm font-medium">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weight and Date/Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Weight className="inline h-4 w-4 mr-2" />
                Estimated Weight *
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter weight"
                  required
                />
                <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm">
                  kg
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-2" />
                Pickup Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-2" />
                Preferred Time *
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select time</option>
                <option value="08:00-10:00">8:00 AM - 10:00 AM</option>
                <option value="10:00-12:00">10:00 AM - 12:00 PM</option>
                <option value="12:00-14:00">12:00 PM - 2:00 PM</option>
                <option value="14:00-16:00">2:00 PM - 4:00 PM</option>
                <option value="16:00-18:00">4:00 PM - 6:00 PM</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-2" />
              Pickup Location *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter coordinates or use current location"
                required
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Use Current
              </button>
            </div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Full address with landmark details"
              required
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Any special instructions or additional information..."
            />
          </div>

          {/* Map Placeholder */}
          <div className="map-container bg-gray-100 h-64 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p>Interactive Map</p>
              <p className="text-sm">Location: {formData.location || 'Not selected'}</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 green-gradient text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Schedule Pickup'}
            </button>
            
            <button
              type="button"
              onClick={() => setFormData({
                wasteType: '', weight: '', date: '', time: '',
                location: '', address: '', notes: ''
              })}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Info Panel */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-2">Booking Information</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• Our team will contact you 1 hour before pickup</li>
            <li>• Please ensure someone is available at the pickup location</li>
            <li>• Separate different types of waste for efficient collection</li>
            <li>• You'll earn reward points based on the waste type and quantity</li>
          </ul>
        </div>
      </div>
    </div>
  );
}