import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Gift, 
  Award, 
  User,
  DollarSign,
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Link,
  Share2,
  QrCode,
  Smartphone,
  Mail,
  MessageSquare,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Referral } from '../../types';

interface ReferralCampaign {
  id: string;
  name: string;
  description: string;
  bonusAmount: number;
  referrerBonus: number;
  referredBonus: number;
  startDate: Date;
  endDate: Date;
  targetAudience: string[];
  isActive: boolean;
  totalReferrals: number;
  conversionRate: number;
  totalBonusPaid: number;
}

interface ReferralStatistics {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  conversionRate: number;
  totalBonusPaid: number;
  topReferrers: {
    userId: string;
    userName: string;
    referrals: number;
    bonusEarned: number;
  }[];
  monthlyGrowth: {
    month: string;
    referrals: number;
    previousMonthChange: number;
  }[];
}

const ReferralManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'referrals' | 'settings'>('overview');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'expired'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Sample referral campaigns
  const [referralCampaigns, setReferralCampaigns] = useState<ReferralCampaign[]>([
    {
      id: 'campaign_001',
      name: 'Standard Referral Program',
      description: 'Default referral program for all users',
      bonusAmount: 100, // Total bonus amount
      referrerBonus: 50, // Amount for referrer
      referredBonus: 50, // Amount for referred user
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      targetAudience: ['all'],
      isActive: true,
      totalReferrals: 1250,
      conversionRate: 65,
      totalBonusPaid: 125000
    },
    {
      id: 'campaign_002',
      name: 'Influencer Boost',
      description: 'Special campaign for influencers with higher bonuses',
      bonusAmount: 200,
      referrerBonus: 150,
      referredBonus: 50,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-15'),
      targetAudience: ['influencer'],
      isActive: true,
      totalReferrals: 450,
      conversionRate: 78,
      totalBonusPaid: 90000
    },
    {
      id: 'campaign_003',
      name: 'Seller Network Expansion',
      description: 'Campaign to increase seller registrations',
      bonusAmount: 300,
      referrerBonus: 200,
      referredBonus: 100,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-30'),
      targetAudience: ['seller'],
      isActive: true,
      totalReferrals: 180,
      conversionRate: 82,
      totalBonusPaid: 54000
    }
  ]);

  // Sample referrals
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: 'ref_001',
      referrerId: 'user_001',
      referrerName: 'Ahmed Hassan',
      referredId: 'user_002',
      referredName: 'Sarah Al-Zahra',
      referralCode: 'USER-ABC123',
      status: 'completed',
      bonusAmount: 50,
      bonusPaid: true,
      createdAt: new Date('2024-01-15'),
      completedAt: new Date('2024-01-16')
    },
    {
      id: 'ref_002',
      referrerId: 'user_001',
      referrerName: 'Ahmed Hassan',
      referredId: 'user_003',
      referredName: 'Mohammed Ali',
      referralCode: 'USER-ABC123',
      status: 'completed',
      bonusAmount: 50,
      bonusPaid: true,
      createdAt: new Date('2024-01-18'),
      completedAt: new Date('2024-01-19')
    },
    {
      id: 'ref_003',
      referrerId: 'influencer_001',
      referrerName: 'Sarah Fashion',
      referredId: 'user_004',
      referredName: 'Fatima Al-Sabah',
      referralCode: 'INFL-XYZ789',
      status: 'completed',
      bonusAmount: 150,
      bonusPaid: true,
      createdAt: new Date('2024-01-20'),
      completedAt: new Date('2024-01-21')
    },
    {
      id: 'ref_004',
      referrerId: 'seller_001',
      referrerName: 'Mario\'s Pizza',
      referredId: 'seller_002',
      referredName: 'TechWorld',
      referralCode: 'SELL-DEF456',
      status: 'completed',
      bonusAmount: 200,
      bonusPaid: true,
      createdAt: new Date('2024-01-25'),
      completedAt: new Date('2024-01-26')
    },
    {
      id: 'ref_005',
      referrerId: 'user_002',
      referrerName: 'Sarah Al-Zahra',
      referredId: 'user_005',
      referredName: 'Khalid Al-Rashid',
      referralCode: 'USER-GHI789',
      status: 'pending',
      bonusAmount: 50,
      bonusPaid: false,
      createdAt: new Date('2024-01-28')
    }
  ]);

  // Sample statistics
  const [statistics, setStatistics] = useState<ReferralStatistics>({
    totalReferrals: 1880,
    activeReferrals: 1650,
    pendingReferrals: 230,
    conversionRate: 72,
    totalBonusPaid: 269000,
    topReferrers: [
      { userId: 'user_001', userName: 'Ahmed Hassan', referrals: 24, bonusEarned: 1200 },
      { userId: 'influencer_001', userName: 'Sarah Fashion', referrals: 18, bonusEarned: 2700 },
      { userId: 'seller_001', userName: 'Mario\'s Pizza', referrals: 15, bonusEarned: 3000 },
      { userId: 'user_002', userName: 'Sarah Al-Zahra', referrals: 12, bonusEarned: 600 },
      { userId: 'user_003', userName: 'Mohammed Ali', referrals: 10, bonusEarned: 500 }
    ],
    monthlyGrowth: [
      { month: 'Jan 2024', referrals: 450, previousMonthChange: 25 },
      { month: 'Dec 2023', referrals: 360, previousMonthChange: 20 },
      { month: 'Nov 2023', referrals: 300, previousMonthChange: 15 },
      { month: 'Oct 2023', referrals: 260, previousMonthChange: 10 },
      { month: 'Sep 2023', referrals: 235, previousMonthChange: 5 },
      { month: 'Aug 2023', referrals: 225, previousMonthChange: 0 }
    ]
  });

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    bonusAmount: 100,
    referrerBonus: 50,
    referredBonus: 50,
    startDate: '',
    endDate: '',
    targetAudience: [] as string[]
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.description || !newCampaign.startDate || !newCampaign.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const campaign: ReferralCampaign = {
      id: `campaign_${Date.now()}`,
      name: newCampaign.name,
      description: newCampaign.description,
      bonusAmount: newCampaign.bonusAmount,
      referrerBonus: newCampaign.referrerBonus,
      referredBonus: newCampaign.referredBonus,
      startDate: new Date(newCampaign.startDate),
      endDate: new Date(newCampaign.endDate),
      targetAudience: newCampaign.targetAudience.length > 0 ? newCampaign.targetAudience : ['all'],
      isActive: true,
      totalReferrals: 0,
      conversionRate: 0,
      totalBonusPaid: 0
    };

    setReferralCampaigns(prev => [...prev, campaign]);
    setShowCreateCampaign(false);
    setNewCampaign({
      name: '',
      description: '',
      bonusAmount: 100,
      referrerBonus: 50,
      referredBonus: 50,
      startDate: '',
      endDate: '',
      targetAudience: []
    });

    alert('Referral campaign created successfully!');
  };

  const toggleTargetAudience = (audience: string) => {
    setNewCampaign(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(a => a !== audience)
        : [...prev.targetAudience, audience]
    }));
  };

  const updateBonusDistribution = (referrerBonus: number) => {
    const totalBonus = newCampaign.bonusAmount;
    const referredBonus = totalBonus - referrerBonus;
    
    setNewCampaign(prev => ({
      ...prev,
      referrerBonus,
      referredBonus
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter referrals based on search and filters
  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = searchQuery
      ? referral.referrerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.referredName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.referralCode.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const referralDate = referral.createdAt;
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = referralDate >= startDate && referralDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">👥 Referral System Management</h1>
        <p className="text-purple-100">Manage referral campaigns, track performance, and optimize conversion</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>
            
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'campaigns'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span className="font-medium">Campaigns</span>
            </button>
            
            <button
              onClick={() => setActiveTab('referrals')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'referrals'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Referrals</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Referrals</p>
                      <p className="text-3xl font-bold text-gray-900">{statistics.totalReferrals.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Conversion Rate</p>
                      <p className="text-3xl font-bold text-gray-900">{statistics.conversionRate}%</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Pending Referrals</p>
                      <p className="text-3xl font-bold text-gray-900">{statistics.pendingReferrals}</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Bonus Paid</p>
                      <p className="text-3xl font-bold text-gray-900">{statistics.totalBonusPaid.toLocaleString()} FB</p>
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Referrers */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Referrers</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus Earned</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {statistics.topReferrers.map((referrer, index) => (
                        <tr key={referrer.userId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-200 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">{referrer.userName.charAt(0)}</span>
                              </div>
                              <div className="ml-4 rtl:ml-0 rtl:mr-4">
                                <div className="text-sm font-medium text-gray-900">{referrer.userName}</div>
                                <div className="text-sm text-gray-500">{referrer.userId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {referrer.referrals}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{referrer.bonusEarned} FB</div>
                            <div className="text-xs text-gray-500">${(referrer.bonusEarned * 0.1).toFixed(2)} USD</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Growth Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Referral Growth</h2>
                <div className="h-64 flex items-end space-x-4 rtl:space-x-reverse">
                  {statistics.monthlyGrowth.map((month, index) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-t-lg relative">
                        <div 
                          className={`w-full bg-gradient-to-t ${
                            month.previousMonthChange > 0 ? 'from-green-500 to-green-300' : 
                            month.previousMonthChange < 0 ? 'from-red-500 to-red-300' : 
                            'from-gray-500 to-gray-300'
                          } rounded-t-lg`}
                          style={{ height: `${(month.referrals / Math.max(...statistics.monthlyGrowth.map(m => m.referrals))) * 200}px` }}
                        >
                          {month.previousMonthChange !== 0 && (
                            <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${
                              month.previousMonthChange > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {month.previousMonthChange > 0 ? '↑' : '↓'}{Math.abs(month.previousMonthChange)}%
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">{month.month}</div>
                      <div className="text-sm font-medium text-gray-900">{month.referrals}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Referral Campaigns</h2>
                <button
                  onClick={() => setShowCreateCampaign(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Campaign</span>
                </button>
              </div>

              {/* Campaigns Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {referralCampaigns.map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Gift className="h-5 w-5 text-white" />
                              </div>
                              <div className="ml-4 rtl:ml-0 rtl:mr-4">
                                <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                                <div className="text-sm text-gray-500">{campaign.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Total: {campaign.bonusAmount} FB</div>
                            <div className="text-xs text-gray-500">
                              Referrer: {campaign.referrerBonus} FB | Referred: {campaign.referredBonus} FB
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {campaign.targetAudience.map((audience) => (
                                <span key={audience} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs capitalize">
                                  {audience}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{campaign.startDate.toLocaleDateString()}</div>
                            <div>to {campaign.endDate.toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{campaign.totalReferrals} referrals</div>
                            <div className="text-xs text-gray-500">
                              {campaign.conversionRate}% conversion | {campaign.totalBonusPaid.toLocaleString()} FB paid
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {campaign.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                              <button className="text-red-600 hover:text-red-900">
                                {campaign.isActive ? 'Deactivate' : 'Activate'}
                              </button>
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

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">All Referrals</h2>
              
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or referral code..."
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
                
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Start Date"
                />
                
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="End Date"
                />
                
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>

              {/* Referrals Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referred User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredReferrals.map((referral) => (
                        <tr key={referral.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="ml-4 rtl:ml-0 rtl:mr-4">
                                <div className="text-sm font-medium text-gray-900">{referral.referrerName}</div>
                                <div className="text-sm text-gray-500">{referral.referrerId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4 rtl:ml-0 rtl:mr-4">
                                <div className="text-sm font-medium text-gray-900">{referral.referredName}</div>
                                <div className="text-sm text-gray-500">{referral.referredId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                            {referral.referralCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>Created: {referral.createdAt.toLocaleDateString()}</div>
                            {referral.completedAt && (
                              <div>Completed: {referral.completedAt.toLocaleDateString()}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                              {referral.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{referral.bonusAmount} FB</div>
                            <div className="text-xs text-gray-500">{referral.bonusPaid ? 'Paid' : 'Pending'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <button className="text-indigo-600 hover:text-indigo-900">View</button>
                              {referral.status === 'pending' && (
                                <>
                                  <button className="text-green-600 hover:text-green-900">Approve</button>
                                  <button className="text-red-600 hover:text-red-900">Reject</button>
                                </>
                              )}
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

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Referral System Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Referral Bonus (Flixbits)
                      </label>
                      <input
                        type="number"
                        defaultValue="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Referred User Bonus (Flixbits)
                      </label>
                      <input
                        type="number"
                        defaultValue="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Referral Code Format
                      </label>
                      <input
                        type="text"
                        defaultValue="USER-[RANDOM6]"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use [USERID], [RANDOM6], [NAME] as placeholders
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Referral Link Format
                      </label>
                      <input
                        type="text"
                        defaultValue="https://flixmarket.com/signup?ref=[CODE]"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Limits & Restrictions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Referrals Per User
                      </label>
                      <input
                        type="number"
                        defaultValue="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Set to 0 for unlimited referrals
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Referral Expiration (Days)
                      </label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Days until a pending referral expires
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Auto-approve Referrals</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Require Email Verification</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Allow Self-Referrals</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">In-App Notifications</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referrer Notification Template
                    </label>
                    <textarea
                      defaultValue="Congratulations! {{referred_name}} has joined using your referral code. You've earned {{bonus_amount}} Flixbits!"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referred User Notification Template
                    </label>
                    <textarea
                      defaultValue="Welcome to FlixMarket! You've been referred by {{referrer_name}} and earned {{bonus_amount}} Flixbits!"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Reset to Defaults
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Referral Campaign</h2>
                <button
                  onClick={() => setShowCreateCampaign(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Summer Referral Boost"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the campaign purpose and benefits"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Bonus Amount (Flixbits) *
                  </label>
                  <input
                    type="number"
                    value={newCampaign.bonusAmount}
                    onChange={(e) => {
                      const totalBonus = parseInt(e.target.value) || 0;
                      setNewCampaign(prev => ({
                        ...prev,
                        bonusAmount: totalBonus,
                        referrerBonus: Math.floor(totalBonus / 2),
                        referredBonus: Math.floor(totalBonus / 2)
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bonus Distribution
                  </label>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700">Referrer: {newCampaign.referrerBonus} FB</span>
                      <span className="text-sm text-gray-700">Referred: {newCampaign.referredBonus} FB</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={newCampaign.bonusAmount}
                      value={newCampaign.referrerBonus}
                      onChange={(e) => updateBonusDistribution(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-600">All to referred</span>
                      <span className="text-xs text-gray-600">Equal</span>
                      <span className="text-xs text-gray-600">All to referrer</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['all', 'user', 'seller', 'influencer'].map((audience) => (
                      <button
                        key={audience}
                        type="button"
                        onClick={() => toggleTargetAudience(audience)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          newCampaign.targetAudience.includes(audience)
                            ? 'bg-purple-500 text-white border-purple-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {audience === 'all' ? 'All Users' : audience.charAt(0).toUpperCase() + audience.slice(1) + 's'}
                      </button>
                    ))}
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
                    type="button"
                    onClick={handleCreateCampaign}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralManager;