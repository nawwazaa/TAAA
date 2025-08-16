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
import InfluencerDashboard from './components/Dashboard/InfluencerDashboard';
import { DrawWinnersSystem } from './features/DrawWinners';
import { WalletManagementSystem } from './features/WalletManagement';
import { VoiceAssistantSystem } from './features/VoiceAssistant';
import { QrCode, Video, Wallet, Plus, Minus, Gift } from 'lucide-react';
import './i18n';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'web' | 'ios'>('web');

  // Helper function to check if user is admin
  const isAdminUser = (user: any) => {
    if (!user) return false;
    
    // Super admin
    if (user.email === 'admin@flixmarket.com') return true;
    
    // Sub-admins (all emails ending with @flixmarket.com except regular users)
    if (user.email?.endsWith('@flixmarket.com') && user.email !== 'admin@flixmarket.com') {
      return true;
    }
    
    return false;
  };
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
        <AuthForm />
      </div>
    );
  }

  const renderMainContent = () => {

    switch (activeTab) {
      case 'dashboard':
        if (user?.userType === 'seller') {
          return <SellerDashboard />;
        }
        if (user?.userType === 'influencer') {
          return <InfluencerDashboard />;
        }
        if (user?.userType === 'user') {
          return <UserDashboard />;
        }
        // Only admins get admin panel
        if (isAdminUser(user)) {
          return <AdminPanel />;
        }
        return <UserDashboard />; // Default fallback
      case 'admin':
        // Only allow admin access to actual admins
        if (isAdminUser(user)) {
          return <AdminPanel />;
        }
        // Redirect non-admins to their appropriate dashboard
        return <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">🚫 Access Denied</h2>
          <p className="text-red-600">You don't have permission to access the admin panel.</p>
        </div>;
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
      case 'draw-winners':
        return (
          <DrawWinnersSystem />
        );
      case 'wallet':
        return (
          <WalletManagementSystem />
        );
      case 'voice-assistant':
        return (
          <VoiceAssistantSystem />
        );
      case 'video-contest':
        return <VideoContest />;
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
    <div className={`min-h-screen bg-gray-50 ${i18n.language === 'ar' ? 'rtl' : 'ltr'} relative`}>
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-2 md:p-4 min-w-0 overflow-hidden">
          {/* View Mode Toggle - Moved inside main content */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setViewMode('ios')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-blue-600 transition-colors"
            >
              📱 View iOS App
            </button>
          </div>
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