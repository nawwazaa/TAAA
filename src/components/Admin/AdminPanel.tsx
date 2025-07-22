import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  Search,
  Trophy,
  UserCheck,
  DollarSign,
  MapPin,
  FileText,
  Truck,
  Key,
  Globe,
  MessageCircle,
  Star,
  Crown,
  Package,
  Brain,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationSystem from './NotificationSystem';
import UserSearch from './UserSearch';
import TapPaymentGateway from './TapPaymentGateway';
import TransactionManager from './TransactionManager';
import RoleManagement from './RoleManagement';
import NotificationAlgorithm from './NotificationAlgorithm';
import ReferralManager from './ReferralManager';

const AdminPanel: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const adminSections = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'user-search', label: 'User Search', icon: Search },
    { id: 'transactions', label: 'Transaction Manager', icon: DollarSign },
    { id: 'role-management', label: 'Sub-Admin Authority', icon: Crown },
    { id: 'referral-management', label: 'Referral System', icon: Users },
    { id: 'tournaments', label: 'Tournament Manager', icon: Trophy },
    { id: 'push-notifications', label: 'Push Notifications', icon: Bell },
    { id: 'notification-algorithm', label: 'Smart Notification AI', icon: Brain },
    { id: 'tap-payments', label: 'Tap Payment Gateway', icon: CreditCard },
    { id: 'delivery-management', label: 'Delivery Management', icon: Truck },
    { id: 'content-moderation', label: 'Content Moderation', icon: FileText },
    { id: 'system-settings', label: 'System Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'user-search':
        return <UserSearch />;
      case 'transactions':
        return <TransactionManager />;
      case 'role-management':
        return <RoleManagement />;
      case 'push-notifications':
        return <NotificationSystem />;
      case 'notification-algorithm':
        return <NotificationAlgorithm />;
      case 'referral-management':
        return <ReferralManager />;
      case 'tap-payments':
        return <TapPaymentGateway />;
      case 'tournaments':
        return <TournamentManager />;
      case 'delivery-management':
        return <DeliveryManager />;
      case 'content-moderation':
        return <ContentModerator />;
      case 'system-settings':
        return <SystemSettings />;
      default:
        return <AdminOverview setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Admin Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isRTL ? 'right-0 left-auto' : ''}`}>
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg lg:text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600 text-xs lg:text-sm mt-1">Complete System Control</p>
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            {adminSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg text-left rtl:text-right transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsMobileSidebarOpen(false);
                  }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium text-xs lg:text-sm">{section.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
          </div>
        </div>
        
        <div className="p-4 lg:p-6">
        {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Tournament Manager Component
const TournamentManager: React.FC = () => {
  const [tournaments, setTournaments] = useState([
    {
      id: 'tournament_1',
      name: 'Premier League Predictions',
      startDate: '2024-02-01',
      endDate: '2024-05-30',
      prize: '25,000 Flixbits',
      participants: 1250,
      games: 15
    }
  ]);

  const [newTournament, setNewTournament] = useState({
    name: '',
    startDate: '',
    endDate: '',
    prize: '',
    description: ''
  });

  const [newGame, setNewGame] = useState({
    homeTeam: '',
    awayTeam: '',
    gameDate: '',
    gameTime: '',
    location: '',
    league: '',
    pointsReward: 150
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🏆 Tournament Manager</h1>
        <p className="text-purple-100">Create tournaments, add games, and manage rewards</p>
      </div>

      {/* Create Tournament */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Tournament</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tournament Name"
            value={newTournament.name}
            onChange={(e) => setNewTournament(prev => ({ ...prev, name: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Prize (e.g., 25,000 Flixbits)"
            value={newTournament.prize}
            onChange={(e) => setNewTournament(prev => ({ ...prev, prize: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={newTournament.startDate}
            onChange={(e) => setNewTournament(prev => ({ ...prev, startDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            placeholder="End Date"
            value={newTournament.endDate}
            onChange={(e) => setNewTournament(prev => ({ ...prev, endDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Create Tournament
        </button>
      </div>

      {/* Add Game */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Game</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Home Team"
            value={newGame.homeTeam}
            onChange={(e) => setNewGame(prev => ({ ...prev, homeTeam: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Away Team"
            value={newGame.awayTeam}
            onChange={(e) => setNewGame(prev => ({ ...prev, awayTeam: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="League (e.g., Premier League)"
            value={newGame.league}
            onChange={(e) => setNewGame(prev => ({ ...prev, league: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            placeholder="Game Date"
            value={newGame.gameDate}
            onChange={(e) => setNewGame(prev => ({ ...prev, gameDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            placeholder="Game Time"
            value={newGame.gameTime}
            onChange={(e) => setNewGame(prev => ({ ...prev, gameTime: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={newGame.location}
            onChange={(e) => setNewGame(prev => ({ ...prev, location: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Flixbits Reward"
            value={newGame.pointsReward}
            onChange={(e) => setNewGame(prev => ({ ...prev, pointsReward: parseInt(e.target.value) }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Add Game
        </button>
      </div>
    </div>
  );
};

// Delivery Manager Component
const DeliveryManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🚚 Delivery Management</h1>
        <p className="text-green-100">Track deliveries and verify customer locations</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Deliveries</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Order #12345</h3>
                <p className="text-gray-600">Ahmed Hassan - Dubai Marina</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">In Transit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Content Moderator Component
const ContentModerator: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">📋 Content Moderation</h1>
        <p className="text-orange-100">Review and moderate user-generated content</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Reviews</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">New Offer: Pizza Special</h3>
                <p className="text-gray-600">Mario's Restaurant - 30% discount</p>
              </div>
              <div className="space-x-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// System Settings Component
const SystemSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">⚙️ System Settings</h1>
        <p className="text-gray-100">Configure global system parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Flixbits Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">USD Exchange Rate</label>
              <input type="number" defaultValue="0.10" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signup Bonus</label>
              <input type="number" defaultValue="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referral Bonus</label>
              <input type="number" defaultValue="50" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">App Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Maintenance Mode</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex justify-between items-center">
              <span>New User Registration</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex justify-between items-center">
              <span>Push Notifications</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Overview Component
const AdminOverview: React.FC<{ setActiveSection: (section: string) => void }> = ({ setActiveSection }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">📊 Admin Dashboard</h1>
        <p className="text-blue-100">Complete system overview and statistics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">12,450</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">$45,230</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Tournaments</p>
              <p className="text-3xl font-bold text-gray-900">8</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sub-Admins</p>
              <p className="text-3xl font-bold text-gray-900">15</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveSection('user-search')}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-center transition-colors"
          >
            <Search className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Search Users</span>
          </button>
          <button 
            onClick={() => setActiveSection('role-management')}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-4 rounded-lg text-center transition-colors"
          >
            <Crown className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Manage Roles</span>
          </button>
          <button 
            onClick={() => setActiveSection('tournaments')}
            className="bg-green-100 hover:bg-green-200 text-green-800 p-4 rounded-lg text-center transition-colors"
          >
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Tournaments</span>
          </button>
          <button 
            onClick={() => setActiveSection('transactions')}
            className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-4 rounded-lg text-center transition-colors"
          >
            <DollarSign className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Transactions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;