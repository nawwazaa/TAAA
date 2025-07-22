import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import AuthForm from './components/Auth/AuthForm';
import UserDashboard from './components/Dashboard/UserDashboard';
import SellerDashboard from './components/Dashboard/SellerDashboard';
import GamePredictions from './components/Games/GamePredictions';
import QRCodeDisplay from './components/QR/QRCodeDisplay';
import QRScanner from './components/QR/QRScanner';
import QRRedemptionSystem from './components/QR/QRRedemptionSystem';
import AdminPanel from './components/Admin/AdminPanel';
import VideoContest from './components/VideoContest/VideoContest';
import ReferralSystem from './components/Referrals/ReferralSystem';
import EventsManager from './components/Events/EventsManager';
import OfferManager from './components/Offers/OfferManager';
import WishlistManager from './components/Wishlist/WishlistManager';
import iOSApp from './components/Mobile/iOS/iOSApp';
import { QrCode, Video, Wallet, Plus, Minus, Gift, Menu, X } from 'lucide-react';
import './i18n';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'web' | 'ios'>('web');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Listen for navigation events from dashboard icons
    const handleNavigateToTab = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setActiveTab(hash);
      }
    };
    
    window.addEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('navigate-to-tab', handleNavigateToTab as EventListener);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [i18n.language]);

  // iOS App View
  if (viewMode === 'ios') {
    return (
      <div className="relative">
        {/* View Mode Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setViewMode('web')}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg"
          >
            Switch to Web
          </button>
        </div>
        <iOSApp />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative">
        {/* View Mode Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setViewMode('ios')}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg"
          >
            View iOS App
          </button>
        </div>
        <AuthForm />
      </div>
    );
  }

  const renderMainContent = () => {
    // Admin panel access
    if (activeTab === 'admin' && user?.email === 'admin@flixmarket.com') {
      return <AdminPanel />;
    }

    switch (activeTab) {
      case 'dashboard':
        if (user?.userType === 'seller') {
          return <SellerDashboard />;
        }
        return <AdminPanel />;
      case 'tournaments':
        return <GamePredictions />;
      case 'qr-code':
        return <QRCodeDisplay />;
      case 'qr-scanner':
        return <QRScanner />;
      case 'qr-redemption':
        return <QRRedemptionSystem />;
      case 'video-contest':
        return <VideoContest />;
      case 'referrals':
        return (
          <ReferralSystem />
        );
      case 'events':
        return (
          <EventsManager />
        );
      case 'wishlist':
        return (
          <WishlistManager />
        );
      case 'wallet-management':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6">
              <h1 className="text-2xl font-bold mb-2">Wallet Management</h1>
              <p className="text-orange-100">Manage your Flixbits and transactions</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.flixbits.toLocaleString()} Flixbits</h2>
                <p className="text-gray-600">≈ ${((user?.flixbits || 0) * 0.1).toFixed(2)} USD</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-colors">
                  <div className="text-center">
                    <Plus className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-bold">Buy Flixbits</div>
                    <div className="text-sm opacity-90">$0.10 per Flixbit</div>
                  </div>
                </button>
                
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
                  <div className="text-center">
                    <Minus className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-bold">Sell Flixbits</div>
                    <div className="text-sm opacity-90">$0.08 per Flixbit</div>
                  </div>
                </button>
                
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors">
                  <div className="text-center">
                    <Gift className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-bold">Redeem Rewards</div>
                    <div className="text-sm opacity-90">Exchange for prizes</div>
                  </div>
                </button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Game Prediction Reward</p>
                      <p className="text-sm text-gray-600">January 14, 2024</p>
                    </div>
                    <span className="text-green-600 font-bold">+150 Flixbits</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Video Rating Bonus</p>
                      <p className="text-sm text-gray-600">January 13, 2024</p>
                    </div>
                    <span className="text-green-600 font-bold">+25 Flixbits</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Welcome Bonus</p>
                      <p className="text-sm text-gray-600">January 12, 2024</p>
                    </div>
                    <span className="text-green-600 font-bold">+100 Flixbits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">{user?.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User Type</label>
                <p className="text-gray-900 capitalize">{user?.userType}</p>
              </div>
              {user?.interests && user.interests.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Interests</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.interests.map((interest) => (
                      <span
                        key={interest}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'offers':
        return <OfferManager />;
      case 'rewards':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rewards</h2>
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6 mb-4">
                <h3 className="text-2xl font-bold mb-2">Your Flixbits</h3>
                <p className="text-4xl font-bold">{user?.flixbits.toLocaleString()}</p>
              </div>
              <p className="text-gray-600">
                Earn more Flixbits by participating in tournaments, watching video ads, and referring friends!
              </p>
            </div>
          </div>
        );
      case 'referrals':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Referrals</h2>
            <p className="text-gray-600">Invite friends and earn Flixbits for each successful referral.</p>
          </div>
        );
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${i18n.language === 'ar' ? 'rtl' : 'ltr'} relative overflow-x-hidden`}>
      {/* View Mode Toggle */}
      <div className="fixed top-4 right-4 z-50 hidden md:block">
        <button
          onClick={() => setViewMode('ios')}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg"
        >
          View iOS App
        </button>
      </div>
      
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`flex-1 p-3 md:p-6 w-full transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="md:hidden fixed top-20 left-4 z-40 bg-white shadow-lg rounded-full p-2 border border-gray-200"
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
          
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;