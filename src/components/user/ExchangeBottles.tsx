import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RotateCcw, Package, Coins, CheckCircle, Clock } from 'lucide-react';

const bottleTypes = [
  { id: 'plastic', name: 'Plastic Bottles', rate: 2, unit: 'per bottle' },
  { id: 'glass', name: 'Glass Bottles', rate: 5, unit: 'per bottle' }
];

export default function ExchangeBottles() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [exchanges, setExchanges] = useState(() => {
    return JSON.parse(localStorage.getItem(`exchanges_${user?.id}`) || '[]');
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !quantity) return;

    setLoading(true);

    const exchange = {
      id: Date.now().toString(),
      userId: user?.id,
      bottleType: selectedType,
      quantity: parseInt(quantity),
      rate: bottleTypes.find(t => t.id === selectedType)?.rate || 0,
      totalCredits: parseInt(quantity) * (bottleTypes.find(t => t.id === selectedType)?.rate || 0),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const newExchanges = [...exchanges, exchange];
    setExchanges(newExchanges);
    localStorage.setItem(`exchanges_${user?.id}`, JSON.stringify(newExchanges));

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setSelectedType('');
      setQuantity('');
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const totalPendingCredits = exchanges
    .filter((ex: any) => ex.status === 'pending')
    .reduce((sum: number, ex: any) => sum + ex.totalCredits, 0);

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Exchange Request Submitted!</h2>
          <p className="text-gray-600 mb-6">Your bottle exchange request has been sent to admin for approval.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">Request ID: EX-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <RotateCcw className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Exchange Bottles</h1>
          <p className="text-gray-600">Convert your bottles into credits</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Coins className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-600">Current Credits</p>
            <p className="text-2xl font-bold text-blue-800">{user?.credits || 0}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-600">Pending Credits</p>
            <p className="text-2xl font-bold text-yellow-800">{totalPendingCredits}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-600">Total Exchanges</p>
            <p className="text-2xl font-bold text-green-800">{exchanges.length}</p>
          </div>
        </div>

        {/* Exchange Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Bottle Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bottleTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedType === type.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.rate} credits {type.unit}</p>
                    </div>
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter number of bottles"
              min="1"
              required
            />
          </div>

          {/* Credit Calculation */}
          {selectedType && quantity && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Credit Calculation</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Bottle Type:</span>
                  <span>{bottleTypes.find(t => t.id === selectedType)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{quantity} bottles</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>{bottleTypes.find(t => t.id === selectedType)?.rate} credits per bottle</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total Credits:</span>
                  <span>{parseInt(quantity) * (bottleTypes.find(t => t.id === selectedType)?.rate || 0)}</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedType || !quantity}
            className="w-full green-gradient text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting Request...' : 'Submit Exchange Request'}
          </button>
        </form>
      </div>

      {/* Exchange History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Exchange History</h2>
        
        {exchanges.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No exchanges yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exchanges.map((exchange: any) => (
              <div key={exchange.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {exchange.quantity} {bottleTypes.find(t => t.id === exchange.bottleType)?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(exchange.createdAt).toLocaleDateString()} • {exchange.totalCredits} credits
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exchange.status)}`}>
                    {exchange.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">EX-{exchange.id.slice(-6)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}