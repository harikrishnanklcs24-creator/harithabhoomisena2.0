import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    // Load all complaints from all users
    const users = JSON.parse(localStorage.getItem('haritha_users') || '[]');
    const allComplaints: any[] = [];

    users.forEach((user: any) => {
      const userComplaints = JSON.parse(localStorage.getItem(`complaints_${user.id}`) || '[]');
      userComplaints.forEach((complaint: any) => {
        allComplaints.push({
          ...complaint,
          userName: user.name,
          userPhone: user.phone,
          userEmail: `${user.name.toLowerCase().replace(' ', '.')}@example.com`
        });
      });
    });

    // Sort by creation date (newest first)
    allComplaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setComplaints(allComplaints);
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateComplaintStatus = (complaintId: string, newStatus: string, response?: string) => {
    // Find the complaint and update it in localStorage
    const users = JSON.parse(localStorage.getItem('haritha_users') || '[]');
    
    users.forEach((user: any) => {
      const userComplaints = JSON.parse(localStorage.getItem(`complaints_${user.id}`) || '[]');
      const updatedComplaints = userComplaints.map((complaint: any) => {
        if (complaint.id === complaintId) {
          const updatedComplaint = { 
            ...complaint, 
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
          
          if (response) {
            updatedComplaint.responses = [
              ...(complaint.responses || []),
              {
                id: Date.now().toString(),
                message: response,
                respondedBy: 'Admin',
                respondedAt: new Date().toISOString()
              }
            ];
          }
          
          return updatedComplaint;
        }
        return complaint;
      });
      
      if (JSON.stringify(userComplaints) !== JSON.stringify(updatedComplaints)) {
        localStorage.setItem(`complaints_${user.id}`, JSON.stringify(updatedComplaints));
      }
    });

    // Update local state
    setComplaints(prev => prev.map(complaint => {
      if (complaint.id === complaintId) {
        const updated = { 
          ...complaint, 
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        
        if (response) {
          updated.responses = [
            ...(complaint.responses || []),
            {
              id: Date.now().toString(),
              message: response,
              respondedBy: 'Admin',
              respondedAt: new Date().toISOString()
            }
          ];
        }
        
        return updated;
      }
      return complaint;
    }));
  };

  const handleResponse = () => {
    if (!selectedComplaint || !responseText.trim()) return;
    
    updateComplaintStatus(selectedComplaint.id, 'resolved', responseText);
    setResponseText('');
    
    // Update selected complaint
    setSelectedComplaint(prev => ({
      ...prev,
      status: 'resolved',
      responses: [
        ...(prev.responses || []),
        {
          id: Date.now().toString(),
          message: responseText,
          respondedBy: 'Admin',
          respondedAt: new Date().toISOString()
        }
      ]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getCategoryCounts = () => {
    const categories = complaints.reduce((acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1;
      return acc;
    }, {});
    return categories;
  };

  const getStatusCounts = () => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'pending').length,
      in_progress: complaints.filter(c => c.status === 'in_progress').length,
      resolved: complaints.filter(c => c.status === 'resolved').length
    };
  };

  const counts = getStatusCounts();
  const categoryCounts = getCategoryCounts();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Complaint Management</h1>
          </div>
          <div className="text-sm text-gray-600">
            Total Complaints: {complaints.length}
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
            <p className="text-2xl font-bold text-green-800">{counts.resolved}</p>
            <p className="text-sm text-green-600">Resolved</p>
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
              placeholder="Search by user name, title, or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Complaints ({filteredComplaints.length})</h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No complaints found</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredComplaints.map((complaint: any) => (
                  <div
                    key={complaint.id}
                    onClick={() => setSelectedComplaint(complaint)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedComplaint?.id === complaint.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{complaint.title}</h3>
                        <p className="text-sm text-gray-600">{complaint.userName}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          <span className="ml-1">{complaint.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="text-gray-700 line-clamp-2">{complaint.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {complaint.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Complaint Details */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Complaint Details</h2>
          </div>
          
          {selectedComplaint ? (
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">User Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedComplaint.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedComplaint.userPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedComplaint.userEmail}</span>
                  </div>
                </div>
              </div>

              {/* Complaint Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Complaint Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="font-medium">{selectedComplaint.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {selectedComplaint.category.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                      {selectedComplaint.description}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{selectedComplaint.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex items-center w-fit ${getStatusColor(selectedComplaint.status)}`}>
                      {getStatusIcon(selectedComplaint.status)}
                      <span className="ml-1">{selectedComplaint.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Photo Evidence */}
              {selectedComplaint.imageUrl && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Photo Evidence</h3>
                  <img
                    src={selectedComplaint.imageUrl}
                    alt="Complaint evidence"
                    className="w-full max-w-xs rounded-lg border"
                  />
                </div>
              )}

              {/* Responses */}
              {selectedComplaint.responses && selectedComplaint.responses.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Admin Responses</h3>
                  <div className="space-y-3">
                    {selectedComplaint.responses.map((response: any) => (
                      <div key={response.id} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-800">{response.message}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          By {response.respondedBy} on {new Date(response.respondedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response Form */}
              {selectedComplaint.status !== 'resolved' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Admin Response</h3>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your response to the user..."
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleResponse}
                      disabled={!responseText.trim()}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Send Response & Resolve
                    </button>
                    <button
                      onClick={() => updateComplaintStatus(selectedComplaint.id, 'in_progress')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark In Progress
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a complaint to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Complaint Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-sm text-gray-600 capitalize">{category.replace('_', ' ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}