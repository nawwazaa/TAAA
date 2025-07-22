import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Share2, 
  Copy, 
  Gift, 
  Award, 
  CheckCircle, 
  Clock, 
  DollarSign,
  User,
  Mail,
  Phone,
  Calendar,
  Link,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  Download,
  QrCode,
  Smartphone,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Referral } from '../../types';

const ReferralSystem: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, generateReferralCode, trackReferral, getReferrals, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'my-referrals' | 'leaderboard' | 'history'>('overview');
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [inputReferralCode, setInputReferralCode] = useState('');
  const [referralStatus, setReferralStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  
  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState([
    { id: 'user1', name: 'Ahmed Hassan', referrals: 24, totalBonus: 1200 },
    { id: 'user2', name: 'Sarah Al-Zahra', referrals: 18, totalBonus: 900 },
    { id: 'user3', name: 'Mohammed Ali', referrals: 15, totalBonus: 750 },
    { id: 'user4', name: 'Fatima Al-Sabah', referrals: 12, totalBonus: 600 },
    { id: 'user5', name: 'Khalid Al-Rashid', referrals: 10, totalBonus: 500 }
  ]);

  // Initialize referral code and link
  useEffect(() => {
    if (user) {
      const code = user.referralCode || generateReferralCode();
      setReferralCode(code);
      setReferralLink(`https://flixmarket.com/signup?ref=${code}`);
      
      // Get user's referrals
      setReferrals(getReferrals());
    }
  }, [user, generateReferralCode, getReferrals]);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleShareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join FlixMarket',
          text: `Use my referral code ${referralCode} to sign up for FlixMarket and get 50 Flixbits bonus!`,
          url: referralLink
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyReferralLink();
      alert('Referral link copied to clipboard! Share it with your friends.');
    }
  };

  const handleSubmitReferralCode = async () => {
    if (!inputReferralCode.trim()) {
      setErrorMessage('Please enter a referral code');
      setReferralStatus('error');
      return;
    }

    setReferralStatus('processing');
    
    try {
      // In a real app, this would be an API call to verify and process the referral
      const success = await trackReferral(inputReferralCode);
      
      if (success) {
        // Award Flixbits for using a referral code
        updateUser({
          flixbits: (user?.flixbits || 0) + 50
        });
        
        setReferralStatus('success');
        setInputReferralCode('');
        
        // Refresh referrals list
        setReferrals(getReferrals());
      } else {
        setErrorMessage('Invalid referral code or already used');
        setReferralStatus('error');
      }
    } catch (error) {
      setErrorMessage('Error processing referral code');
      setReferralStatus('error');
    }
  };

  // Calculate statistics
  const totalReferrals = referrals.filter(ref => ref.referrerId === user?.id).length;
  const pendingReferrals = referrals.filter(ref => ref.referrerId === user?.id && ref.status === 'pending').length;
  const totalEarned = referrals.filter(ref => ref.referrerId === user?.id && ref.bonusPaid).reduce((sum, ref) => sum + ref.bonusAmount, 0);

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">👥 Referral Program</h1>
        <p className="text-purple-100">Invite friends and earn Flixbits for each successful referral</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Overview</span>
            </button>
            
            <button
              onClick={() => setActiveTab('my-referrals')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'my-referrals'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">My Referrals</span>
            </button>
            
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'leaderboard'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Leaderboard</span>
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">History</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Referrals</p>
                      <p className="text-2xl font-bold text-gray-900">{totalReferrals}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingReferrals}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Earned</p>
                      <p className="text-2xl font-bold text-gray-900">{totalEarned} FB</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Referral Code */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-purple-900 mb-4">Your Referral Code</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Referral Code</p>
                        <p className="text-2xl font-bold text-gray-900 font-mono">{referralCode}</p>
                      </div>
                      <button
                        onClick={handleCopyReferralCode}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        {copiedToClipboard ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedToClipboard ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4 rtl:mr-0 rtl:ml-4">
                        <p className="text-gray-600 text-sm mb-1">Referral Link</p>
                        <p className="text-sm text-gray-900 break-all">{referralLink}</p>
                      </div>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={handleCopyReferralLink}
                          className="bg-gray-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                        >
                          <Link className="w-4 h-4" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={handleShareReferral}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enter Referral Code */}
              {!user?.referredBy && (
                <div>
                  {!showReferralInput ? (
                    <button
                      onClick={() => setShowReferralInput(true)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                    >
                      Have a referral code? Enter it here
                    </button>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Enter Referral Code</h3>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <input
                          type="text"
                          value={inputReferralCode}
                          onChange={(e) => setInputReferralCode(e.target.value)}
                          placeholder="Enter code (e.g., USER-ABC123)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleSubmitReferralCode}
                          disabled={referralStatus === 'processing'}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          {referralStatus === 'processing' ? 'Processing...' : 'Submit'}
                        </button>
                      </div>
                      
                      {referralStatus === 'error' && (
                        <p className="mt-2 text-red-600 text-sm">
                          {errorMessage}
                        </p>
                      )}
                      
                      {referralStatus === 'success' && (
                        <div className="mt-2 text-green-600 text-sm flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>Referral code applied successfully! You earned 50 Flixbits.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* How It Works */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Share Your Referral Code</h3>
                      <p className="text-gray-600">Share your unique referral code with friends and family through social media, messaging apps, or email.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Friends Sign Up</h3>
                      <p className="text-gray-600">When your friends sign up using your referral code, they'll be linked to your account.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Both of You Earn Rewards</h3>
                      <p className="text-gray-600">You'll earn 50 Flixbits for each friend who signs up, and they'll get 50 Flixbits too!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-600 font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Track Your Earnings</h3>
                      <p className="text-gray-600">Monitor your referrals and earnings in the "My Referrals" tab.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* My Referrals Tab */}
          {activeTab === 'my-referrals' && (
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search referrals..."
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
                
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {referrals.filter(ref => ref.referrerId === user?.id).map((referral) => (
                        <tr key={referral.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="ml-4 rtl:ml-0 rtl:mr-4">
                                <div className="text-sm font-medium text-gray-900">{referral.referredName}</div>
                                <div className="text-sm text-gray-500">{referral.referredId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {referral.createdAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              referral.status === 'completed' ? 'bg-green-100 text-green-800' :
                              referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {referral.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{referral.bonusAmount} FB</div>
                            <div className="text-xs text-gray-500">{referral.bonusPaid ? 'Paid' : 'Pending'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-purple-600 hover:text-purple-900">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {referrals.filter(ref => ref.referrerId === user?.id).map((referral) => (
                  <div key={referral.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{referral.referredName}</div>
                          <div className="text-xs text-gray-500">{referral.referredId}</div>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        referral.status === 'completed' ? 'bg-green-100 text-green-800' :
                        referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {referral.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-medium">{referral.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Bonus</p>
                        <p className="font-medium">{referral.bonusAmount} FB</p>
                        <p className="text-xs text-gray-500">{referral.bonusPaid ? 'Paid' : 'Pending'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button className="text-purple-600 hover:text-purple-900 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Referral Leaderboard</h2>
              
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earned</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leaderboard.map((leader, index) => (
                        <tr key={leader.id} className={`hover:bg-gray-50 ${leader.id === user?.id ? 'bg-purple-50' : ''}`}>
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
                                <span className="text-white font-bold">{leader.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4 rtl:ml-0 rtl:mr-4">
                                <div className="text-sm font-medium text-gray-900">{leader.name}</div>
                                <div className="text-sm text-gray-500">
                                  {leader.id === user?.id ? 'You' : 'User'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {leader.referrals}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{leader.totalBonus} FB</div>
                            <div className="text-xs text-gray-500">${(leader.totalBonus * 0.1).toFixed(2)} USD</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {leaderboard.map((leader, index) => (
                  <div key={leader.id} className={`bg-white border border-gray-200 rounded-lg p-4 ${leader.id === user?.id ? 'bg-purple-50 border-purple-200' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-200 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          <span className="font-bold">{index + 1}</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{leader.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{leader.name}</div>
                            <div className="text-xs text-gray-500">{leader.id === user?.id ? 'You' : 'User'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Referrals</p>
                        <p className="text-lg font-bold text-gray-900">{leader.referrals}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Earned</p>
                        <p className="text-lg font-bold text-gray-900">{leader.totalBonus} FB</p>
                        <p className="text-xs text-gray-500">${(leader.totalBonus * 0.1).toFixed(2)} USD</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prizes Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-4">Monthly Referral Prizes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-yellow-200 shadow-sm">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🥇</div>
                      <h4 className="font-bold text-gray-900 mb-1">1st Place</h4>
                      <p className="text-yellow-600 font-bold text-xl">5,000 FB</p>
                      <p className="text-gray-600 text-sm">+ Premium Badge</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🥈</div>
                      <h4 className="font-bold text-gray-900 mb-1">2nd Place</h4>
                      <p className="text-gray-600 font-bold text-xl">2,500 FB</p>
                      <p className="text-gray-600 text-sm">+ Silver Badge</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🥉</div>
                      <h4 className="font-bold text-gray-900 mb-1">3rd Place</h4>
                      <p className="text-orange-600 font-bold text-xl">1,000 FB</p>
                      <p className="text-gray-600 text-sm">+ Bronze Badge</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Referral History</h2>
              
              {referrals.filter(ref => ref.referredId === user?.id).length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Referral History</h3>
                  <p className="text-gray-600 mb-4">You haven't been referred by anyone yet.</p>
                </div>
              ) : (
                <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referred By</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code Used</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {referrals.filter(ref => ref.referredId === user?.id).map((referral) => (
                          <tr key={referral.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-4 rtl:ml-0 rtl:mr-4">
                                  <div className="text-sm font-medium text-gray-900">{referral.referrerName}</div>
                                  <div className="text-sm text-gray-500">{referral.referrerId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {referral.createdAt.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                              {referral.referralCode}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{referral.bonusAmount} FB</div>
                              <div className="text-xs text-gray-500">{referral.bonusPaid ? 'Received' : 'Pending'}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Mobile Card View for History */}
                <div className="lg:hidden space-y-4">
                  {referrals.filter(ref => ref.referredId === user?.id).map((referral) => (
                    <div key={referral.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{referral.referrerName}</div>
                          <div className="text-xs text-gray-500">{referral.referrerId}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-medium">{referral.createdAt.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Code Used</p>
                          <p className="font-mono text-xs">{referral.referralCode}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Bonus</p>
                          <p className="font-medium">{referral.bonusAmount} FB</p>
                          <p className="text-xs text-gray-500">{referral.bonusPaid ? 'Received' : 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Referral Marketing */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-purple-900 mb-4">Why Refer Friends?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Earn Flixbits</h3>
              <p className="text-gray-600">Get 50 Flixbits for each friend who joins using your code</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Win Prizes</h3>
              <p className="text-gray-600">Top referrers win monthly prizes and exclusive badges</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Grow Community</h3>
              <p className="text-gray-600">Help build a larger network of users for better offers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sharing Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Share Your Referral</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <span className="font-medium">SMS</span>
            </div>
          </button>
          
          <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📞</div>
              <span className="font-medium">WhatsApp</span>
            </div>
          </button>
          
          <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📧</div>
              <span className="font-medium">Email</span>
            </div>
          </button>
          
          <button className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🔗</div>
              <span className="font-medium">More</span>
            </div>
          </button>
        </div>
      </div>

      {/* QR Code Referral */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Referral QR Code</h2>
            <p className="text-gray-600">Let friends scan this QR code to sign up with your referral</p>
          </div>
          <div className="bg-white p-4 border-2 border-gray-200 rounded-lg">
            <QrCode className="w-32 h-32 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;