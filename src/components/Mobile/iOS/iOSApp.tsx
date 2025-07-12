import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from '../../../context/AuthContext';
import iOSQRRedemptionSystem from './iOSQRRedemptionSystem';
import { 
  Home, 
  Search, 
  ShoppingBag, 
  User, 
  QrCode,
  Bell,
  Settings,
  Heart,
  Star,
  Calendar,
  Gift,
  Wallet,
  Camera,
  Plus
} from 'lucide-react';
import '../../../i18n';

const iOSAppContent: React.FC = () => {
  const { user, isAuthenticated, login } = useAuth();
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  // Auto-login for demo purposes
  useEffect(() => {
    if (!isAuthenticated) {
      const demoUser = {
        id: 'ios_user_001',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+971501234567',
        userType: 'user' as const,
        location: {
          country: 'UAE',
          city: 'Dubai',
          district: 'Downtown'
        },
        interests: ['Shopping', 'Food', 'Technology'],
        qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
        flixbits: 1250,
        createdAt: new Date()
      };
      login(demoUser);
    }
  }, [isAuthenticated, login]);

  const triggerHapticFeedback = () => {
    // iOS haptic feedback simulation
    // In real iOS app: Haptics.impact({ style: 'light' });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* iOS-style Hero Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl p-6 mx-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                  <p className="text-blue-100">Ready to earn more Flixbits?</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-2xl p-3">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-2xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-100 text-sm">Your Balance</p>
                    <p className="text-2xl font-bold">{user?.flixbits.toLocaleString()} FB</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">USD Value</p>
                    <p className="text-lg font-semibold">${((user?.flixbits || 0) * 0.1).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setActiveTab('qr');
                    triggerHapticFeedback();
                  }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 active:scale-95 transition-transform"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <QrCode className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Scan QR</h3>
                    <p className="text-sm text-gray-600">Earn Flixbits</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('shop');
                    triggerHapticFeedback();
                  }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 active:scale-95 transition-transform"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Shop</h3>
                    <p className="text-sm text-gray-600">Browse offers</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('events');
                    triggerHapticFeedback();
                  }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 active:scale-95 transition-transform"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Events</h3>
                    <p className="text-sm text-gray-600">Join activities</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('rewards');
                    triggerHapticFeedback();
                  }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 active:scale-95 transition-transform"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Gift className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Rewards</h3>
                    <p className="text-sm text-gray-600">Redeem prizes</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="px-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                <div className="p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">QR Code Redeemed</p>
                    <p className="text-sm text-gray-600">Mario's Pizza - 30% Off</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+150 FB</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>

                <div className="p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Daily Login Bonus</p>
                    <p className="text-sm text-gray-600">Welcome back reward</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">+10 FB</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>

                <div className="p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Referral Bonus</p>
                    <p className="text-sm text-gray-600">Friend joined FlixMarket</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">+50 FB</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'qr':
        return <iOSQRRedemptionSystem />;

      case 'shop':
        return (
          <div className="px-4 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketplace</h1>
              <p className="text-gray-600">Discover amazing offers and deals</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">Marketplace features will be available in the next update</p>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="px-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-900">Phone</span>
                  <span className="text-gray-600">{user?.phone}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-900">Location</span>
                  <span className="text-gray-600">{user?.location?.city}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-900">Member Since</span>
                  <span className="text-gray-600">{user?.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="px-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">This feature will be available in the next update</p>
            </div>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FlixMarket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* iOS-style Status Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">9:41 AM</div>
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <div className="w-6 h-3 border border-black rounded-sm">
              <div className="w-4 h-1 bg-green-500 rounded-sm m-0.5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FlixMarket</h1>
          <div className="flex items-center space-x-3">
            <button 
              onClick={triggerHapticFeedback}
              className="relative p-2 rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {showNotificationBadge && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </button>
            <button 
              onClick={triggerHapticFeedback}
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20">
        {renderTabContent()}
      </div>

      {/* iOS-style Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => {
              setActiveTab('home');
              triggerHapticFeedback();
            }}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('search');
              triggerHapticFeedback();
            }}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === 'search' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Search className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Search</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('qr');
              triggerHapticFeedback();
            }}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === 'qr' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              activeTab === 'qr' ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
              <QrCode className={`w-6 h-6 ${activeTab === 'qr' ? 'text-white' : 'text-gray-600'}`} />
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('shop');
              triggerHapticFeedback();
            }}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === 'shop' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <ShoppingBag className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Shop</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('profile');
              triggerHapticFeedback();
            }}
            className={`flex flex-col items-center py-2 px-4 ${
              activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const iOSApp: React.FC = () => {
  return (
    <AuthProvider>
      <iOSAppContent />
    </AuthProvider>
  );
};

export default iOSApp;