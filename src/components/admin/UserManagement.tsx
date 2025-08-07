import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, MapPin, Phone, Calendar, Trash2 } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    // Load users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('haritha_users') || '[]');
    setUsers(allUsers);
  }, []);

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.aadhar.includes(searchTerm);
    const matchesFilter = filterType === 'all' || user.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getUserBookings = (userId: string) => {
    return JSON.parse(localStorage.getItem(`bookings_${userId}`) || '[]');
  };

  const getUserComplaints = (userId: string) => {
    return JSON.parse(localStorage.getItem(`complaints_${userId}`) || '[]');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          </div>
          <div className="text-sm text-gray-600">
            Total Users: {users.length}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, or Aadhar..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="home">Home</option>
              <option value="organization">Organization</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Users ({filteredUsers.length})</h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredUsers.map((user: any) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.phone}</p>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.type === 'organization' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {user.type}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {user.credits || 0} credits
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">User Details</h2>
          </div>
          
          {selectedUser ? (
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 w-20">Name:</span>
                    <span className="font-medium">{selectedUser.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 w-20">Phone:</span>
                    <span className="font-medium">{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 w-20">Address:</span>
                    <span className="font-medium">{selectedUser.houseNo}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2"></span>
                    <span className="text-sm text-gray-600 w-20">Aadhar:</span>
                    <span className="font-medium">****-****-{selectedUser.aadhar?.slice(-4)}</span>
                  </div>
                </div>
              </div>

              {/* Activity Stats */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Activity Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm text-blue-600">Bookings</p>
                    <p className="font-bold text-blue-800">{getUserBookings(selectedUser.id).length}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <Trash2 className="h-6 w-6 text-red-600 mx-auto mb-1" />
                    <p className="text-sm text-red-600">Complaints</p>
                    <p className="font-bold text-red-800">{getUserComplaints(selectedUser.id).length}</p>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Recent Bookings</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {getUserBookings(selectedUser.id).slice(0, 3).map((booking: any) => (
                    <div key={booking.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{booking.wasteType}</p>
                        <p className="text-xs text-gray-600">{booking.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                  {getUserBookings(selectedUser.id).length === 0 && (
                    <p className="text-gray-500 text-sm">No bookings yet</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Full Profile
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a user to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">User Locations Map</h2>
        <div className="map-container bg-gray-100 h-96 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-2" />
            <p className="font-medium">Interactive User Locations Map</p>
            <p className="text-sm">Showing all registered user locations</p>
            <div className="mt-4 flex justify-center gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Home Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span>Organizations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}