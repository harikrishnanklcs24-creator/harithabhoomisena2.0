import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import QRCodeLib from 'qrcode';
import { Download, Share2, QrCode as QrCodeIcon, User, Phone, MapPin, Calendar } from 'lucide-react';

export default function QRCode() {
  const { user } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateQRCode();
    }
  }, [user]);

  const generateQRCode = async () => {
    try {
      const userData = {
        id: user?.id,
        name: user?.name,
        aadhar: user?.aadhar,
        phone: user?.phone,
        houseNo: user?.houseNo,
        type: user?.type,
        credits: user?.credits,
        memberSince: new Date().getFullYear()
      };

      const qrData = JSON.stringify(userData);
      const qrCode = await QRCodeLib.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#22c55e',
          light: '#ffffff'
        }
      });

      setQrCodeUrl(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `haritha-qr-${user?.name?.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `haritha-qr-${user?.name}.png`, { type: 'image/png' });

        await navigator.share({
          title: 'My HarithaKarmabhoomi QR Code',
          text: 'Here is my waste collection profile QR code',
          files: [file]
        });
      } catch (error) {
        // Fallback to copying text
        const userData = `HarithaKarmabhoomi Profile\nName: ${user?.name}\nID: ${user?.id}\nCredits: ${user?.credits}`;
        navigator.clipboard.writeText(userData);
        alert('Profile information copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const userData = `HarithaKarmabhoomi Profile\nName: ${user?.name}\nID: ${user?.id}\nCredits: ${user?.credits}`;
      navigator.clipboard.writeText(userData);
      alert('Profile information copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your QR code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <QrCodeIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your QR Code</h1>
          <p className="text-gray-600">Share your profile or use for quick verification</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* QR Code */}
          <div className="flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-100">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="User QR Code"
                  className="w-64 h-64 mx-auto"
                />
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={downloadQRCode}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button
                onClick={shareQRCode}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* User Information */}
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <User className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Phone className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold text-gray-800">{user?.phone}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-800">{user?.houseNo}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-600 rounded mr-3 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Credits Earned</p>
                  <p className="font-semibold text-gray-800">{user?.credits || 0} points</p>
                </div>
              </div>
            </div>

            {/* Account Type Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {user?.type === 'home' ? '🏠 Home Account' : '🏢 Organization Account'}
            </div>

            {/* Member Since */}
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">Member since {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">How to Use</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
              <span>Show this QR code to collection agents for quick verification</span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
              <span>Use it at partner organizations for instant credit updates</span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
              <span>Share with others to refer them to HarithaKarmabhoomi</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">QR Code Benefits</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <span>Instant profile verification</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <span>Quick booking confirmations</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <span>Seamless credit tracking</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <span>Enhanced security features</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}