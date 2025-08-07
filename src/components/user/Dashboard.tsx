import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Trash2, MessageSquare, Trophy, 
  Coins, Leaf, TrendingUp, MapPin, Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const wasteData = [
  { month: 'Jan', waste: 12 },
  { month: 'Feb', waste: 19 },
  { month: 'Mar', waste: 15 },
  { month: 'Apr', waste: 22 },
  { month: 'May', waste: 18 },
  { month: 'Jun', waste: 25 },
];

const leaderboard = [
  { name: 'Priya Sharma', credits: 450, rank: 1 },
  { name: 'Raj Kumar', credits: 430, rank: 2 },
  { name: 'Anita Singh', credits: 420, rank: 3 },
  { name: 'You', credits: 380, rank: 4 },
  { name: 'Vikash Yadav', credits: 360, rank: 5 },
];

const scrapShops = [
  { name: 'Green Recyclers', location: 'MG Road', rating: 4.8, distance: '0.5 km' },
  { name: 'Eco Waste Solutions', location: 'Brigade Road', rating: 4.6, distance: '0.8 km' },
  { name: 'Clean Earth', location: 'Koramangala', rating: 4.7, distance: '1.2 km' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Load user data from localStorage
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${user?.id}`) || '[]');
    const userComplaints = JSON.parse(localStorage.getItem(`complaints_${user?.id}`) || '[]');
    setBookings(userBookings);
    setComplaints(userComplaints);
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-green-100">Let's make our environment cleaner together</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Trash2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Waste Collected</p>
              <p className="text-2xl font-bold text-gray-900">125 kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Coins className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Credits</p>
              <p className="text-2xl font-bold text-gray-900">{user?.credits || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Collection Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Waste Collection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={wasteData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="waste" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking: any, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Trash2 className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">{booking.wasteType}</p>
                    <p className="text-sm text-gray-600">{booking.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-gray-500 text-center py-8">No bookings yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard and Rewards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <Trophy className="h-6 w-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Leaderboard</h3>
          </div>
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                user.name === 'You' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1 ? 'bg-yellow-500 text-white' :
                    user.rank === 2 ? 'bg-gray-400 text-white' :
                    user.rank === 3 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {user.rank}
                  </div>
                  <span className="ml-3 font-medium text-gray-800">{user.name}</span>
                </div>
                <span className="font-semibold text-green-600">{user.credits} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reward Meter */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Reward Progress</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Seed Level</span>
                <span>75/100 kg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Leaf className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Next Reward: Plant Sapling</p>
                  <p className="text-sm text-green-600">25 kg more to unlock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collaborating Scrap Shops */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-4">
          <MapPin className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Collaborating Scrap Shops</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scrapShops.map((shop, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">{shop.name}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {shop.location} • {shop.distance}
                </p>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{shop.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}