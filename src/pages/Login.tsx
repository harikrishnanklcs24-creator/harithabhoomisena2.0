import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, User, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [aadhar, setAadhar] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhar || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await login(aadhar, password);
      if (success) {
        // Determine role and redirect
        const user = JSON.parse(localStorage.getItem('haritha_user') || '{}');
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        setError('Invalid Aadhar number or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">HarithaKarmabhoomi</h1>
          </div>
          <p className="text-gray-600">Waste Collection Management System</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhar Number
            </label>
            <div className="relative">
              <User className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Enter your Aadhar number"
                maxLength={12}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full green-gradient text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-600 font-semibold hover:text-green-700">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700 font-medium">Demo Credentials:</p>
          <p className="text-xs text-green-600 mt-1">Admin: 123456789012 / admin123</p>
          <p className="text-xs text-green-600">User: Sign up to create account</p>
        </div>
      </div>
    </div>
  );
}