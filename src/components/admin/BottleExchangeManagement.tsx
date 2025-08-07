import React, { useState, useEffect } from 'react';
import { RotateCcw, Search, Filter, CheckCircle, X, Settings } from 'lucide-react';

const bottleRates = {
  plastic: 2,
  glass: 5
};

export default function BottleExchangeManagement() {
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedExchange, setSelectedExchange] = useState<any>(null);
  const [rates, setRates] = useState(bottleRates);
  const [showRateSettings, setShowRateSettings] = useState(false);

  useEffect(() => {
    // Load all exchanges from all users
    const users = JSON.parse(localStorage.getItem('haritha_users') || '[]');
    const allExchanges: any[] = [];

    users.forEach((user: any) => {
      const userExchanges = JSON.parse(localStorage.getItem(`exchanges_${user.id}`) || '[]');
      userExchanges.forEach((exchange: any) => {
        allExchanges.push({
          ...exchange,
          userName: user.name,
          userPhone: user.phone
        });
      });
    });

    // Sort by creation date (newest first)
    allExchanges.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setExchanges(allExchanges);
  }, []);

  const filteredExchanges = exchanges.filter(exchange => {
    const matchesSearch = exchange.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exchange.userPhone.includes(searchTerm) ||
                         exchange.bottleType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exchange.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateExchangeStatus = (exchangeId: string, newStatus: string, creditsToAdd?: number) => {
    // Find the exchange and update it in localStorage
    const users = JSON.parse(localStorage.getItem('haritha_users') || '[]');
    
    users.forEach((user: any) => {
      const userExchanges = JSON.parse(localStorage.getItem(`exchanges_${user.id}`) || '[]');
      const updatedExchanges = userExchanges.map((exchange: any) => 
        exchange.id === exchangeId ? { ...exchange, status: newStatus, processedAt: new Date().toISOString() } : exchange
      );
      
      if (JSON.stringify(userExchanges) !== JSON.stringify(updatedExchanges)) {
        localStorage.setItem(`exchanges_${user.id}`, JSON.stringify(updatedExchanges));
        
        // If approved, add credits to user
        if (newStatus === 'approved' && creditsToAdd) {
          const updatedUser = { ...user, credits: (user.credits || 0) + creditsToAdd };
          const allUsers = JSON.parse(localStorage.getItem('haritha_users') || '[]');
          const userIndex = allUsers.findIndex((u: any) => u.id === user.id);
          if (userIndex !== -1) {
            allUsers[userIndex] = updatedUser;
            localStorage.setItem('haritha_users', JSON.stringify(allUsers));
          }
        }
      }
    });

    // Update local state
    setExchanges(prev => prev.map(exchange => 
      exchange.id === exchangeId ? { ...exchange, status: newStatus, processedAt: new Date().toISOString() } : exchange
    ));
  };

  const updateRates = () => {
    // In a real app, this would update the database
    // For now, we'll just update the local state
    localStorage.setItem('bottle_rates', JSON.stringify(rates));
    setShowRateSettings(false);
    alert('Bottle rates updated successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusCounts = () => {
    return {
      total: exchanges.length,
      pending: exchanges.filter(e => e.status === 'pending').length,
      approved: exchanges.filter(e => e.status === 'approved').length,
      rejected: exchanges.filter(e => e.status === 'rejected').length
    };
  };

  const getTotalCreditsAwarded = () => {
    return exchanges
      .filter(e => e.status === 'approved')
      .reduce((sum, e) => sum + e.totalCredits, 0);
  };

  const counts = getStatusCounts();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <RotateCcw className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Bottle Exchange Management</h1>
          </div>
          <button
            onClick={() => setShowRateSettings(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Rates
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-800">{counts.total}</p>
            <p className="text-sm text-gray-600">Total Requests</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-800">{counts.pending}</p>
            <p className="text-sm text-yellow-600">Pending</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-800">{counts.approved}</p>
            <p className="text-sm text-green-600">Approved</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-800">{counts.rejected}</p>
            <p className="text-sm text-red-600">Rejected</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-800">{getTotalCreditsAwarded()}</p>
            <p className="text-sm text-blue-600">Credits Awarded</p>
          </div>
        </div>

        {/* Current Rates */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Current Bottle Rates</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Plastic Bottles:</span>
              <span className="font-semibold text-blue-800">{rates.plastic} credits per bottle</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Glass Bottles:</span>
              <span className="font-semibold text-blue-800">{rates.glass} credits per bottle</span>
            </div>
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
              placeholder="Search by user name, phone, or bottle type..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exchanges List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Exchange Requests ({filteredExchanges.length})</h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredExchanges.length === 0 ? (
              <div className="p-8 text-center">
                <RotateCcw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No exchange requests found</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredExchanges.map((exchange: any) => (
                  <div
                    key={exchange.id}
                    onClick={() => setSelectedExchange(exchange)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedExchange?.id === exchange.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{exchange.userName}</h3>
                        <p className="text-sm text-gray-600">{exchange.userPhone}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exchange.status)}`}>
                        {exchange.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium capitalize">{exchange.bottleType} bottles</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium">{exchange.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credits:</span>
                        <span className="font-medium text-green-600">{exchange.totalCredits}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(exchange.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Exchange Details */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Exchange Details</h2>
          </div>
          
          {selectedExchange ? (
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">User Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedExchange.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedExchange.userPhone}</span>
                  </div>
                </div>
              </div>

              {/* Exchange Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Exchange Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bottle Type:</span>
                    <span className="font-medium capitalize">{selectedExchange.bottleType} bottles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{selectedExchange.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium">{selectedExchange.rate} credits per bottle</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Credits:</span>
                    <span className="font-medium text-green-600">{selectedExchange.totalCredits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedExchange.status)}`}>
                      {selectedExchange.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{new Date(selectedExchange.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedExchange.processedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processed:</span>
                      <span className="font-medium">{new Date(selectedExchange.processedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Calculation Breakdown</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>{selectedExchange.quantity} × {selectedExchange.rate} credits</span>
                    <span className="font-medium">{selectedExchange.totalCredits} credits</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedExchange.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateExchangeStatus(selectedExchange.id, 'approved', selectedExchange.totalCredits)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Add Credits
                  </button>
                  <button
                    onClick={() => updateExchangeStatus(selectedExchange.id, 'rejected')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <RotateCcw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select an exchange request to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Rate Settings Modal */}
      {showRateSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Update Bottle Rates</h2>
                <button
                  onClick={() => setShowRateSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plastic Bottles (credits per bottle)
                  </label>
                  <input
                    type="number"
                    value={rates.plastic}
                    onChange={(e) => setRates(prev => ({ ...prev, plastic: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Glass Bottles (credits per bottle)
                  </label>
                  <input
                    type="number"
                    value={rates.glass}
                    onChange={(e) => setRates(prev => ({ ...prev, glass: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={updateRates}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Rates
                </button>
                <button
                  onClick={() => setShowRateSettings(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}