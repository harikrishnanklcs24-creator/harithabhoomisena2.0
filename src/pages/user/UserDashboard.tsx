import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/user/Sidebar';
import Dashboard from '../../components/user/Dashboard';
import Profile from '../../components/user/Profile';
import BookWaste from '../../components/user/BookWaste';
import ExchangeBottles from '../../components/user/ExchangeBottles';
import NearestOrgs from '../../components/user/NearestOrgs';
import Complaints from '../../components/user/Complaints';
import Report from '../../components/user/Report';
import VoiceBooking from '../../components/user/VoiceBooking';
import CallSMSBooking from '../../components/user/CallSMSBooking';
import QRCode from '../../components/user/QRCode';

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/book-waste" element={<BookWaste />} />
            <Route path="/exchange-bottles" element={<ExchangeBottles />} />
            <Route path="/nearest-orgs" element={<NearestOrgs />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/report" element={<Report />} />
            <Route path="/voice-booking" element={<VoiceBooking />} />
            <Route path="/call-sms" element={<CallSMSBooking />} />
            <Route path="/qr-code" element={<QRCode />} />
            <Route path="*" element={<Navigate to="/user" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}