import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminOverview from '../../components/admin/AdminOverview';
import UserManagement from '../../components/admin/UserManagement';
import BookingManagement from '../../components/admin/BookingManagement';
import ComplaintManagement from '../../components/admin/ComplaintManagement';
import BottleExchangeManagement from '../../components/admin/BottleExchangeManagement';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/bookings" element={<BookingManagement />} />
            <Route path="/complaints" element={<ComplaintManagement />} />
            <Route path="/bottle-exchange" element={<BottleExchangeManagement />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}