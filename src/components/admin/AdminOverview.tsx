import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, MessageSquare, Trash2, 
  TrendingUp, MapPin, CheckCircle, Clock 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jan', bookings: 45, collections: 42 },
  { month: 'Feb', bookings: 52, collections: 48 },
  { month: 'Mar', bookings: 38, collections: 36 },
  { month: 'Apr', bookings: 61, collections: 58 },
  { month: 'May', bookings: 55, collections: 52 },
  { month: 'Jun', bookings: 67, collections: 63 },
];

const wasteTypeData = [
  { name: 'Plastic', value: 35, color: '#3B82F6' },
  { name: 'Metal', value: 25, color: '#6B7280' },
  { name: 'Glass', value: 20, color: '#10B981' },
  { name: 'Paper', value: 15, color: '#F59E0B' },
  { name: 'Others', value: 5, color: '#8B5CF6' },
];

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingComplaints: 0,
    activeCollectors: 8
  });

  useEffect(() => {
    // Load stats from localStorage
    const users = JSON.parse(localStorage.getItem('haritha_users') || '[]');
    let totalBookings = 0;
    let pendingComplaints = 0;

    users.forEach((user: any) => {
      const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`) || '[]');
      const userComplaints = JSON.parse(localStorage.getItem(`complaints_${user.id}`) || '[]');
      
      totalBookings += userBookings.length;
      pendingComplaints += userComplaints.filter((c: any) => c.status === 'pending').length;
    });

    setStats({
      totalUsers: users.length,
      totalBookings,
      pendingComplaints,
      activeCollectors: 8
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-green-100">Monitor and manage HarithaKarmabhoomi operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingComplaints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Trash2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Collectors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCollectors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Bookings vs Collections</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#22c55e" name="Bookings" />
              <Bar dataKey="collections" fill="#16a34a" name="Collections" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Waste Type Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Waste Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {wasteTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">User {i + 1} - Plastic Collection</p>
                    <p className="text-sm text-gray-600">Today, 2:30 PM</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">Collection Service</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Online
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">SMS Gateway</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Online
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="text-gray-700">Payment Processing</span>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Maintenance
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">Notification Service</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Collections Map</h3>
        <div className="map-container bg-gray-100 h-96 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-2" />
            <p className="font-medium">Interactive Map View</p>
            <p className="text-sm">Real-time collection locations and routes</p>
            <div className="mt-4 flex justify-center gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Active Collections</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Urgent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}