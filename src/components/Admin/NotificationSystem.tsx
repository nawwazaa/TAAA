import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bell, 
  Users, 
  Send, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  Target, 
  DollarSign,
  Package,
  Crown,
  Star,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NotificationPackage {
  id: string;
  name: string;
  description: string;
  price: number; // in Flixbits
  usdPrice: number; // in USD
  features: {
    monthlyNotifications: number;
    targetingOptions: string[];
    analytics: boolean;
    scheduling: boolean;
    templates: number;
    priority: 'low' | 'medium' | 'high';
    deliveryGuarantee: number; // percentage
  };
  isActive: boolean;
  createdAt: Date;
}

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  packageName: string;
  startDate: Date;
  endDate: Date;
  notificationsUsed: number;
  notificationsLimit: number;
  status: 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
  paymentMethod: 'flixbits' | 'usd';
}

interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  targetAudience: {
    userTypes: string[];
    locations: string[];
    interests: string[];
    ageRange?: { min: number; max: number };
    gender?: 'male' | 'female' | 'all';
  };
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  senderId: string;
  senderName: string;
  packageUsed: string;
  deliveryStats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
  createdAt: Date;
}

const NotificationSystem: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'packages' | 'subscriptions' | 'campaigns' | 'analytics' | 'settings'>('packages');
  const [showCreatePackage, setShowCreatePackage] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<NotificationPackage | null>(null);

  // Sample notification packages
  const [notificationPackages, setNotificationPackages] = useState<NotificationPackage[]>([
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Perfect for small businesses and individual sellers',
      price: 500, // 500 Flixbits
      usdPrice: 50, // $50 USD
      features: {
        monthlyNotifications: 100,
        targetingOptions: ['location', 'userType'],
        analytics: false,
        scheduling: true,
        templates: 5,
        priority: 'low',
        deliveryGuarantee: 85
      },
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      description: 'Advanced features for growing businesses',
      price: 1500, // 1500 Flixbits
      usdPrice: 150, // $150 USD
      features: {
        monthlyNotifications: 500,
        targetingOptions: ['location', 'userType', 'interests', 'age'],
        analytics: true,
        scheduling: true,
        templates: 20,
        priority: 'medium',
        deliveryGuarantee: 92
      },
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      description: 'Unlimited power for large businesses and influencers',
      price: 3000, // 3000 Flixbits
      usdPrice: 300, // $300 USD
      features: {
        monthlyNotifications: 2000,
        targetingOptions: ['location', 'userType', 'interests', 'age', 'gender', 'behavior'],
        analytics: true,
        scheduling: true,
        templates: 50,
        priority: 'high',
        deliveryGuarantee: 98
      },
      isActive: true,
      createdAt: new Date('2024-01-01')
    }
  ]);

  // Sample subscriptions
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 'sub1',
      userId: 'seller1',
      userName: 'Mario\'s Pizza Restaurant',
      packageId: 'professional',
      packageName: 'Professional Plan',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      notificationsUsed: 127,
      notificationsLimit: 500,
      status: 'active',
      autoRenew: true,
      paymentMethod: 'flixbits'
    },
    {
      id: 'sub2',
      userId: 'influencer1',
      userName: 'Sarah Fashion',
      packageId: 'enterprise',
      packageName: 'Enterprise Plan',
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-02-10'),
      notificationsUsed: 456,
      notificationsLimit: 2000,
      status: 'active',
      autoRenew: true,
      paymentMethod: 'usd'
    }
  ]);

  // Sample campaigns
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([
    {
      id: 'camp1',
      title: 'Weekend Pizza Special',
      message: 'Get 30% off on all pizzas this weekend! Limited time offer.',
      targetAudience: {
        userTypes: ['user'],
        locations: ['Dubai', 'Abu Dhabi'],
        interests: ['Food & Dining'],
        ageRange: { min: 18, max: 45 },
        gender: 'all'
      },
      scheduledTime: new Date('2024-01-20T18:00:00'),
      status: 'sent',
      senderId: 'seller1',
      senderName: 'Mario\'s Pizza Restaurant',
      packageUsed: 'Professional Plan',
      deliveryStats: {
        sent: 1250,
        delivered: 1189,
        opened: 756,
        clicked: 234
      },
      createdAt: new Date('2024-01-19')
    }
  ]);

  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    price: 0,
    usdPrice: 0,
    monthlyNotifications: 0,
    targetingOptions: [] as string[],
    analytics: false,
    scheduling: true,
    templates: 0,
    priority: 'medium' as 'low' | 'medium' | 'high',
    deliveryGuarantee: 90
  });

  const [newCampaign, setNewCampaign] = useState({
    title: '',
    message: '',
    targetUserTypes: [] as string[],
    targetLocations: [] as string[],
    targetInterests: [] as string[],
    scheduledTime: '',
    packageId: ''
  });

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const packageData: NotificationPackage = {
      id: `pkg_${Date.now()}`,
      name: newPackage.name,
      description: newPackage.description,
      price: newPackage.price,
      usdPrice: newPackage.usdPrice,
      features: {
        monthlyNotifications: newPackage.monthlyNotifications,
        targetingOptions: newPackage.targetingOptions,
        analytics: newPackage.analytics,
        scheduling: newPackage.scheduling,
        templates: newPackage.templates,
        priority: newPackage.priority,
        deliveryGuarantee: newPackage.deliveryGuarantee
      },
      isActive: true,
      createdAt: new Date()
    };

    setNotificationPackages(prev => [...prev, packageData]);
    setShowCreatePackage(false);
    setNewPackage({
      name: '',
      description: '',
      price: 0,
      usdPrice: 0,
      monthlyNotifications: 0,
      targetingOptions: [],
      analytics: false,
      scheduling: true,
      templates: 0,
      priority: 'medium',
      deliveryGuarantee: 90
    });

    alert('Notification package created successfully!');
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    
    const campaignData: NotificationCampaign = {
      id: `camp_${Date.now()}`,
      title: newCampaign.title,
      message: newCampaign.message,
      targetAudience: {
        userTypes: newCampaign.targetUserTypes,
        locations: newCampaign.targetLocations,
        interests: newCampaign.targetInterests,
        gender: 'all'
      },
      scheduledTime: new Date(newCampaign.scheduledTime),
      status: 'scheduled',
      senderId: user?.id || 'admin',
      senderName: user?.name || 'Admin',
      packageUsed: 'Admin Package',
      deliveryStats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0
      },
      createdAt: new Date()
    };

    setCampaigns(prev => [...prev, campaignData]);
    setShowCreateCampaign(false);
    setNewCampaign({
      title: '',
      message: '',
      targetUserTypes: [],
      targetLocations: [],
      targetInterests: [],
      scheduledTime: '',
      packageId: ''
    });

    alert('Notification campaign created successfully!');
  };

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'basic':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'professional':
        return <Star className="w-6 h-6 text-purple-500" />;
      case 'enterprise':
        return <Crown className="w-6 h-6 text-gold-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const toggleTargetingOption = (option: string) => {
    setNewPackage(prev => ({
      ...prev,
      targetingOptions: prev.targetingOptions.includes(option)
        ? prev.targetingOptions.filter(o => o !== option)
        : [...prev.targetingOptions, option]
    }));
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🔔 Push Notification System</h1>
        <p className="text-blue-100">Manage subscription packages, campaigns, and notification analytics</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'packages'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Packages</span>
            </button>
            
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'subscriptions'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Subscriptions</span>
            </button>
            
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Campaigns</span>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Analytics</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Notification Packages</h2>
                <button
                  onClick={() => setShowCreatePackage(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Package</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {notificationPackages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      {getPackageIcon(pkg.id)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold">{pkg.price} FB / ${pkg.usdPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Notifications:</span>
                        <span className="font-semibold">{pkg.features.monthlyNotifications}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Priority:</span>
                        <span className={`font-semibold capitalize ${
                          pkg.features.priority === 'high' ? 'text-red-600' :
                          pkg.features.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {pkg.features.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Delivery:</span>
                        <span className="font-semibold">{pkg.features.deliveryGuarantee}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-gray-700">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {pkg.features.targetingOptions.map((option) => (
                          <span key={option} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {option}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs">
                        {pkg.features.analytics && <span className="text-green-600">✓ Analytics</span>}
                        {pkg.features.scheduling && <span className="text-green-600">✓ Scheduling</span>}
                        <span className="text-gray-600">{pkg.features.templates} Templates</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                        {pkg.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Active Subscriptions</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subscriptions.map((sub) => (
                        <tr key={sub.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{sub.userName}</div>
                              <div className="text-sm text-gray-500">{sub.userId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{sub.packageName}</div>
                            <div className="text-sm text-gray-500">{sub.paymentMethod === 'flixbits' ? 'Flixbits' : 'USD'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{sub.notificationsUsed} / {sub.notificationsLimit}</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(sub.notificationsUsed / sub.notificationsLimit) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sub.status)}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sub.endDate.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <button className="text-blue-600 hover:text-blue-900">View</button>
                              <button className="text-red-600 hover:text-red-900">Cancel</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Notification Campaigns</h2>
                <button
                  onClick={() => setShowCreateCampaign(true)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Campaign</span>
                </button>
              </div>

              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{campaign.title}</h3>
                        <p className="text-gray-600">{campaign.message}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Sent</p>
                        <p className="text-lg font-bold text-gray-900">{campaign.deliveryStats.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Delivered</p>
                        <p className="text-lg font-bold text-green-600">{campaign.deliveryStats.delivered.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Opened</p>
                        <p className="text-lg font-bold text-blue-600">{campaign.deliveryStats.opened.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Clicked</p>
                        <p className="text-lg font-bold text-purple-600">{campaign.deliveryStats.clicked.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <span>By: {campaign.senderName}</span>
                        <span>Package: {campaign.packageUsed}</span>
                        <span>Scheduled: {campaign.scheduledTime.toLocaleString()}</span>
                      </div>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                        <button className="text-green-600 hover:text-green-900">Duplicate</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Notification Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Sent</p>
                      <p className="text-3xl font-bold text-gray-900">12,450</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-lg">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Delivery Rate</p>
                      <p className="text-3xl font-bold text-gray-900">94.2%</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Open Rate</p>
                      <p className="text-3xl font-bold text-gray-900">68.7%</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">$8,450</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Global Settings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Enable Push Notifications</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Require Subscription</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Analytics Tracking</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Rate Limits</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max notifications per hour</label>
                      <input type="number" defaultValue="1000" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max notifications per user per day</label>
                      <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Package Modal */}
      {showCreatePackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Notification Package</h2>
                <button
                  onClick={() => setShowCreatePackage(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreatePackage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                    <input
                      type="text"
                      value={newPackage.name}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Notifications</label>
                    <input
                      type="number"
                      value={newPackage.monthlyNotifications || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, monthlyNotifications: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newPackage.description}
                    onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Flixbits)</label>
                    <input
                      type="number"
                      value={newPackage.price || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                    <input
                      type="number"
                      value={newPackage.usdPrice || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, usdPrice: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newPackage.priority}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Templates</label>
                    <input
                      type="number"
                      value={newPackage.templates || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, templates: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Guarantee (%)</label>
                    <input
                      type="number"
                      value={newPackage.deliveryGuarantee || ''}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, deliveryGuarantee: parseInt(e.target.value) || 90 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Targeting Options</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['location', 'userType', 'interests', 'age', 'gender', 'behavior'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleTargetingOption(option)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          newPackage.targetingOptions.includes(option)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPackage.analytics}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="mr-2 rtl:mr-0 rtl:ml-2"
                    />
                    <span className="text-sm text-gray-700">Include Analytics</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPackage.scheduling}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, scheduling: e.target.checked }))}
                      className="mr-2 rtl:mr-0 rtl:ml-2"
                    />
                    <span className="text-sm text-gray-700">Include Scheduling</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreatePackage(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    Create Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Notification Campaign</h2>
                <button
                  onClick={() => setShowCreateCampaign(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                  <input
                    type="text"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={newCampaign.message}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
                  <input
                    type="datetime-local"
                    value={newCampaign.scheduledTime}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target User Types</label>
                    <div className="space-y-2">
                      {['user', 'seller', 'influencer'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newCampaign.targetUserTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewCampaign(prev => ({ ...prev, targetUserTypes: [...prev.targetUserTypes, type] }));
                              } else {
                                setNewCampaign(prev => ({ ...prev, targetUserTypes: prev.targetUserTypes.filter(t => t !== type) }));
                              }
                            }}
                            className="mr-2 rtl:mr-0 rtl:ml-2"
                          />
                          <span className="text-sm capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Locations</label>
                    <div className="space-y-2">
                      {['Dubai', 'Abu Dhabi', 'Sharjah', 'Riyadh', 'Jeddah'].map((location) => (
                        <label key={location} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newCampaign.targetLocations.includes(location)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewCampaign(prev => ({ ...prev, targetLocations: [...prev.targetLocations, location] }));
                              } else {
                                setNewCampaign(prev => ({ ...prev, targetLocations: prev.targetLocations.filter(l => l !== location) }));
                              }
                            }}
                            className="mr-2 rtl:mr-0 rtl:ml-2"
                          />
                          <span className="text-sm">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Interests</label>
                    <div className="space-y-2">
                      {['Food & Dining', 'Shopping', 'Technology', 'Fashion', 'Sports'].map((interest) => (
                        <label key={interest} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newCampaign.targetInterests.includes(interest)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewCampaign(prev => ({ ...prev, targetInterests: [...prev.targetInterests, interest] }));
                              } else {
                                setNewCampaign(prev => ({ ...prev, targetInterests: prev.targetInterests.filter(i => i !== interest) }));
                              }
                            }}
                            className="mr-2 rtl:mr-0 rtl:ml-2"
                          />
                          <span className="text-sm">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateCampaign(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors"
                  >
                    Create Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;