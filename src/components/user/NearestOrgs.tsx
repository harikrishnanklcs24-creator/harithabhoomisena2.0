import React, { useState } from 'react';
import { MapPin, Phone, Clock, Star, Navigation, ExternalLink } from 'lucide-react';

const organizations = [
  {
    id: 1,
    name: 'Green Earth Recycling Center',
    type: 'Recycling Center',
    address: 'MG Road, Bangalore',
    distance: '0.5 km',
    phone: '+91 9876543210',
    timings: '9:00 AM - 6:00 PM',
    rating: 4.8,
    reviews: 124,
    services: ['Plastic', 'Metal', 'Glass', 'Paper'],
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: 2,
    name: 'Eco Waste Management',
    type: 'Waste Collection',
    address: 'Brigade Road, Bangalore',
    distance: '0.8 km',
    phone: '+91 9876543211',
    timings: '8:00 AM - 7:00 PM',
    rating: 4.6,
    reviews: 89,
    services: ['Organic', 'Plastic', 'Metal'],
    coordinates: { lat: 12.9726, lng: 77.5956 }
  },
  {
    id: 3,
    name: 'Clean City Initiative',
    type: 'NGO',
    address: 'Koramangala, Bangalore',
    distance: '1.2 km',
    phone: '+91 9876543212',
    timings: '10:00 AM - 5:00 PM',
    rating: 4.7,
    reviews: 156,
    services: ['Glass', 'Paper', 'Electronics'],
    coordinates: { lat: 12.9352, lng: 77.6245 }
  },
  {
    id: 4,
    name: 'Recycle Hub',
    type: 'Scrap Dealer',
    address: 'Jayanagar, Bangalore',
    distance: '1.5 km',
    phone: '+91 9876543213',
    timings: '9:00 AM - 8:00 PM',
    rating: 4.5,
    reviews: 67,
    services: ['Metal', 'Electronics', 'Appliances'],
    coordinates: { lat: 12.9279, lng: 77.5619 }
  },
  {
    id: 5,
    name: 'Green Solutions Co-op',
    type: 'Cooperative',
    address: 'Indiranagar, Bangalore',
    distance: '2.0 km',
    phone: '+91 9876543214',
    timings: '8:30 AM - 6:30 PM',
    rating: 4.9,
    reviews: 203,
    services: ['All Types', 'Hazardous Waste'],
    coordinates: { lat: 12.9784, lng: 77.6408 }
  }
];

export default function NearestOrgs() {
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');

  const filteredOrgs = filterType === 'all' 
    ? organizations 
    : organizations.filter(org => org.type.toLowerCase().includes(filterType.toLowerCase()));

  const getDirections = (org: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${org.coordinates.lat},${org.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const callOrganization = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nearest Organizations</h1>
          <p className="text-gray-600">Find waste collection and recycling centers near you</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          {['all', 'recycling', 'collection', 'ngo', 'scrap', 'cooperative'].map(filter => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === filter
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' ? 'All Types' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organizations List */}
        <div className="space-y-4">
          {filteredOrgs.map(org => (
            <div key={org.id} className="bg-white rounded-xl shadow-lg p-6 hover-lift cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{org.name}</h3>
                  <p className="text-green-600 font-medium">{org.type}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{org.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({org.reviews})</span>
                  </div>
                  <p className="text-sm text-gray-600">{org.distance}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{org.address}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{org.timings}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{org.phone}</span>
                </div>
              </div>

              {/* Services */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {org.services.map((service, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => getDirections(org)}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Directions
                </button>
                
                <button
                  onClick={() => callOrganization(org.phone)}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => setSelectedOrg(org)}
                  className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Map View */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="font-semibold text-gray-800">Map View</h2>
          </div>
          
          <div className="map-container bg-gray-100 h-96 flex items-center justify-center relative">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p className="font-medium">Interactive Map</p>
              <p className="text-sm">Organizations near your location</p>
              
              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                <p className="text-xs font-medium text-gray-800 mb-2">Legend</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Your Location</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Recycling Centers</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Collection Points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Details Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedOrg.name}</h2>
                  <p className="text-green-600 font-medium">{selectedOrg.type}</p>
                </div>
                <button
                  onClick={() => setSelectedOrg(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-semibold">{selectedOrg.rating}</span>
                  <span className="text-gray-500 ml-1">({selectedOrg.reviews} reviews)</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Address</p>
                      <p className="text-gray-600">{selectedOrg.address}</p>
                      <p className="text-sm text-green-600">{selectedOrg.distance} away</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Timings</p>
                      <p className="text-gray-600">{selectedOrg.timings}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Contact</p>
                      <p className="text-gray-600">{selectedOrg.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mb-2">Services Offered</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrg.services.map((service: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => getDirections(selectedOrg)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </button>
                  
                  <button
                    onClick={() => callOrganization(selectedOrg.phone)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}