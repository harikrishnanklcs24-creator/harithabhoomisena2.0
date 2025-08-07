import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, X, Search, Filter } from 'lucide-react';

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    // Load all bookings from all users
    const users = JSON.parse(localStorage.getItem('haritha_users') || '[]');
    const allBookings: any[] = [];

    users.forEach((user: any) => {
      const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`) || '[]');
      userBookings.forEach((booking: any) => {
        allBookings.push({
          ...booking,
          userName: user.name,
          userPhone: user.phone,
          userAddress: user.houseNo
        });
      });
    });

    // Sort by creation date (newest first)
    allBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setBookings(allBookings);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.userPhone.includes(searchTerm) ||
                         booking.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    // Find the booking and update it in localStorage
    const users = JSON.parse(localStorage.getItem('haritha_users') || '[]');
    
    users.forEach((user: any) => {
      const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`) || '[]');
      const updatedBookings = userBookings.map((booking: any) => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      
      if (JSON.stringify(userBookings) !== JSON.stringify(updatedBookings)) {
        localStorage.setItem(`bookings_${user.id}`, JSON.stringify(updatedBookings));
      }
    });

    // Update local state
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusCounts = () => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      in_progress: bookings.filter(b => b.status === 'in_progress').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Booking Management</h1>
          </div>
          <div className="text-sm text-gray-600">
            Total Bookings: {bookings.length}
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-800">{counts.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-800">{counts.pending}</p>
            <p className="text-sm text-yellow-600">Pending</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-800">{counts.in_progress}</p>
            <p className="text-sm text-blue-600">In Progress</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-800">{counts.completed}</p>
            <p className="text-sm text-green-600">Completed</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-800">{counts.cancelled}</p>
            <p className="text-sm text-red-600">Cancelled</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user name, phone, or waste type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Bookings ({filteredBookings.length})</h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredBookings.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedBooking?.id === booking.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{booking.userName}</h3>
                        <p className="text-sm text-gray-600">{booking.userPhone}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        <span>{booking.wasteType} • {booking.weight}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        <span>{booking.date} • {booking.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2" />
                        <span className="truncate">{booking.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
          </div>
          
          {selectedBooking ? (
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">User Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedBooking.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedBooking.userPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{selectedBooking.userAddress}</span>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Booking Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waste Type:</span>
                    <span className="font-medium capitalize">{selectedBooking.wasteType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{selectedBooking.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{selectedBooking.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedBooking.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Location</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="text-gray-700">{selectedBooking.address}</p>
                  {selectedBooking.location && (
                    <p className="text-gray-500 mt-1">Coordinates: {selectedBooking.location}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Notes</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'in_progress')}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Collection
                    </button>
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
                
                {selectedBooking.status === 'in_progress' && (
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 inline" />
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a booking to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Bookings Map</h2>
        <div className="map-container bg-gray-100 h-96 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-2" />
            <p className="font-medium">Interactive Bookings Map</p>
            <p className="text-sm">Showing all booking locations and routes</p>
            <div className="mt-4 flex justify-center gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}