import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Phone, MessageSquare, Clock, Calendar, Trash2, CheckCircle } from 'lucide-react';

export default function CallSMSBooking() {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<'call' | 'sms' | null>(null);
  const [bookingData, setBookingData] = useState({
    wasteType: 'plastic',
    urgency: 'normal',
    preferredTime: 'morning'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCallBooking = () => {
    setLoading(true);
    
    // Generate booking reference
    const bookingRef = `CB-${Date.now().toString().slice(-6)}`;
    
    // Save booking record
    const booking = {
      id: Date.now().toString(),
      userId: user?.id,
      type: 'call',
      ...bookingData,
      status: 'pending_call',
      bookingRef,
      createdAt: new Date().toISOString()
    };

    const existingBookings = JSON.parse(localStorage.getItem(`bookings_${user?.id}`) || '[]');
    existingBookings.push(booking);
    localStorage.setItem(`bookings_${user?.id}`, JSON.stringify(existingBookings));

    // Simulate call initiation
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // In a real app, this would actually initiate a call
      window.open(`tel:+919876543210`, '_self');
    }, 2000);
  };

  const handleSMSBooking = () => {
    setLoading(true);
    
    const bookingRef = `SB-${Date.now().toString().slice(-6)}`;
    
    // Generate SMS content
    const smsContent = `HarithaKarmabhoomi Booking Request
Ref: ${bookingRef}
Name: ${user?.name}
Phone: ${user?.phone}
Waste Type: ${bookingData.wasteType}
Urgency: ${bookingData.urgency}
Preferred Time: ${bookingData.preferredTime}
Address: ${user?.houseNo}

Please confirm pickup details.`;

    // Save booking record
    const booking = {
      id: Date.now().toString(),
      userId: user?.id,
      type: 'sms',
      ...bookingData,
      status: 'pending_sms_response',
      bookingRef,
      smsContent,
      createdAt: new Date().toISOString()
    };

    const existingBookings = JSON.parse(localStorage.getItem(`bookings_${user?.id}`) || '[]');
    existingBookings.push(booking);
    localStorage.setItem(`bookings_${user?.id}`, JSON.stringify(existingBookings));

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // In a real app, this would send an SMS via API
      const smsUrl = `sms:+919876543210?body=${encodeURIComponent(smsContent)}`;
      window.open(smsUrl, '_self');
    }, 2000);
  };

  const resetBooking = () => {
    setSuccess(false);
    setSelectedOption(null);
    setBookingData({
      wasteType: 'plastic',
      urgency: 'normal',
      preferredTime: 'morning'
    });
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Request Initiated!</h2>
          <p className="text-gray-600 mb-6">
            {selectedOption === 'call' 
              ? 'Your call booking request has been processed. You should receive a call from our team soon.'
              : 'Your SMS booking request has been sent. You should receive a confirmation SMS shortly.'
            }
          </p>
          <button
            onClick={resetBooking}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Make Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-blue-600 mr-3" />
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Call or SMS Booking</h1>
          <p className="text-gray-600">Quick booking options via phone call or text message</p>
        </div>

        {!selectedOption && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Call Option */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer"
                 onClick={() => setSelectedOption('call')}>
              <div className="text-center">
                <Phone className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Call Booking</h3>
                <p className="text-gray-600 mb-4">Talk directly with our booking team</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>✓ Instant confirmation</p>
                  <p>✓ Personalized service</p>
                  <p>✓ Answer questions live</p>
                  <p>✓ Available 24/7</p>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-800">+91 98765 43210</p>
                  <p className="text-xs text-blue-600">Toll-free booking line</p>
                </div>
              </div>
            </div>

            {/* SMS Option */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 transition-colors cursor-pointer"
                 onClick={() => setSelectedOption('sms')}>
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">SMS Booking</h3>
                <p className="text-gray-600 mb-4">Send booking request via text message</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>✓ Quick and convenient</p>
                  <p>✓ No waiting on hold</p>
                  <p>✓ Written confirmation</p>
                  <p>✓ Works on any phone</p>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-800">+91 98765 43210</p>
                  <p className="text-xs text-green-600">SMS booking number</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedOption && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setSelectedOption(null)}
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              ← Back to options
            </button>

            {/* Booking Form */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {selectedOption === 'call' ? 'Call' : 'SMS'} Booking Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waste Type
                  </label>
                  <select
                    value={bookingData.wasteType}
                    onChange={(e) => setBookingData(prev => ({ ...prev, wasteType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="plastic">Plastic</option>
                    <option value="metal">Metal</option>
                    <option value="glass">Glass</option>
                    <option value="paper">Paper</option>
                    <option value="organic">Organic</option>
                    <option value="mixed">Mixed Waste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    value={bookingData.urgency}
                    onChange={(e) => setBookingData(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="asap">ASAP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    value={bookingData.preferredTime}
                    onChange={(e) => setBookingData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="morning">Morning (8AM-12PM)</option>
                    <option value="afternoon">Afternoon (12PM-5PM)</option>
                    <option value="evening">Evening (5PM-8PM)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>

              {/* User Information Preview */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Your Information</h4>
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
                    <span className="text-gray-600">Address:</span>
                    <span className="ml-2 font-medium">{user?.houseNo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">User ID:</span>
                    <span className="ml-2 font-medium">{user?.id}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={selectedOption === 'call' ? handleCallBooking : handleSMSBooking}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedOption === 'call'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    {selectedOption === 'call' ? (
                      <>
                        <Phone className="inline h-4 w-4 mr-2" />
                        Initiate Call Booking
                      </>
                    ) : (
                      <>
                        <MessageSquare className="inline h-4 w-4 mr-2" />
                        Send SMS Booking
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Call Process */}
          <div>
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Call Booking Process
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                <span>Click the call booking button</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                <span>Your phone will dial our booking line</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                <span>Speak with our booking agent</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">4</span>
                <span>Receive instant booking confirmation</span>
              </div>
            </div>
          </div>

          {/* SMS Process */}
          <div>
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              SMS Booking Process
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                <span>Fill in your booking preferences</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                <span>SMS app opens with pre-filled message</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                <span>Send the message to our booking number</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">4</span>
                <span>Receive confirmation SMS with details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Booking Hotline:</p>
              <p className="font-semibold text-gray-800">+91 98765 43210</p>
            </div>
            <div>
              <p className="text-gray-600">SMS Booking:</p>
              <p className="font-semibold text-gray-800">+91 98765 43210</p>
            </div>
            <div>
              <p className="text-gray-600">Operating Hours:</p>
              <p className="font-semibold text-gray-800">24/7 Available</p>
            </div>
            <div>
              <p className="text-gray-600">Response Time:</p>
              <p className="font-semibold text-gray-800">Within 30 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}