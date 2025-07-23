import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Gift, 
  Star, 
  Clock, 
  Package, 
  Ticket, 
  Wrench, 
  Search,
  Filter,
  Heart,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Eye,
  Tag
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useRewards } from '../hooks/useRewards';
import { formatFlixbits, formatUSD } from '../utils/helpers';

const RewardsCenter: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const { rewards, categories, loading, claimReward, getRewardsByCategory, getFeaturedRewards } = useRewards();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'cost' | 'rating' | 'popularity'>('rating');
  const [showClaimModal, setShowClaimModal] = useState<string | null>(null);
  const [isClaimingReward, setIsClaimingReward] = useState(false);

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case 'physical': return <Package className="w-5 h-5" />;
      case 'digital': return <Gift className="w-5 h-5" />;
      case 'voucher': return <Ticket className="w-5 h-5" />;
      case 'service': return <Wrench className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case 'physical': return 'bg-blue-100 text-blue-800';
      case 'digital': return 'bg-purple-100 text-purple-800';
      case 'voucher': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRewards = rewards.filter(reward => {
    const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
    const matchesSearch = reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch && reward.isActive;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'cost':
        return a.cost - b.cost;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  const featuredRewards = getFeaturedRewards();

  const handleClaimReward = async (rewardId: string) => {
    setIsClaimingReward(true);
    
    try {
      const result = await claimReward(rewardId, user?.flixbits || 0);
      
      if (result.success) {
        const reward = rewards.find(r => r.id === rewardId);
        if (reward) {
          // Deduct Flixbits from user's wallet
          updateUser({
            flixbits: (user?.flixbits || 0) - reward.cost
          });
          
          alert(`🎉 Reward claimed successfully!\n\nClaim Code: ${result.claimCode}\n\n${reward.claimInstructions}`);
        }
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      alert('❌ Failed to claim reward. Please try again.');
    } finally {
      setIsClaimingReward(false);
      setShowClaimModal(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🎁 Rewards Center</h1>
        <p className="text-purple-100">Redeem your Flixbits for amazing rewards and prizes</p>
      </div>

      {/* User Balance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your Flixbits Balance</h3>
            <p className="text-3xl font-bold text-purple-600">{formatFlixbits(user?.flixbits || 0)}</p>
            <p className="text-gray-600">{formatUSD((user?.flixbits || 0) * 0.1)} equivalent</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <Gift className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Featured Rewards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Star className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-yellow-500" />
          Featured Rewards
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRewards.slice(0, 3).map((reward) => (
            <div key={reward.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={reward.image} 
                  alt={reward.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRewardTypeColor(reward.type)}`}>
                    {reward.type}
                  </span>
                </div>
                {reward.discount && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      -{reward.discount}%
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{reward.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{reward.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{reward.rating} ({reward.reviewCount})</span>
                  </div>
                  {reward.availability.isLimited && (
                    <span className="text-xs text-orange-600 font-medium">
                      Only {reward.availability.remaining} left!
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-purple-600">{formatFlixbits(reward.cost)}</p>
                    {reward.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">{formatUSD(reward.originalPrice)}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowClaimModal(reward.id)}
                    disabled={(user?.flixbits || 0) < reward.cost || reward.availability.remaining <= 0}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(user?.flixbits || 0) < reward.cost ? 'Insufficient FB' : 'Claim Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rewards..."
                className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="rating">Sort by Rating</option>
              <option value="cost">Sort by Cost</option>
              <option value="popularity">Sort by Popularity</option>
            </select>
          </div>
        </div>
      </div>

      {/* All Rewards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">All Rewards ({filteredRewards.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRewards.map((reward) => (
            <div key={reward.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={reward.image} 
                  alt={reward.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRewardTypeColor(reward.type)}`}>
                    {reward.type}
                  </span>
                </div>
                {reward.discount && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      -{reward.discount}%
                    </span>
                  </div>
                )}
                {reward.sponsor && (
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {reward.sponsor.logo} {reward.sponsor.name}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">{reward.title}</h4>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{reward.description}</p>
                
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-gray-600">{reward.rating}</span>
                  </div>
                  {reward.availability.isLimited && (
                    <span className="text-orange-600 font-medium">
                      {reward.availability.remaining} left
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-purple-600 text-sm">{formatFlixbits(reward.cost)}</p>
                    {reward.originalPrice && (
                      <p className="text-xs text-gray-500 line-through">{formatUSD(reward.originalPrice)}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowClaimModal(reward.id)}
                    disabled={(user?.flixbits || 0) < reward.cost || reward.availability.remaining <= 0}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Claim Confirmation Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {(() => {
              const reward = rewards.find(r => r.id === showClaimModal);
              if (!reward) return null;
              
              return (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Claim Reward</h2>
                    <button
                      onClick={() => setShowClaimModal(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="text-center mb-6">
                    <img 
                      src={reward.image} 
                      alt={reward.title}
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                    />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{reward.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-purple-800 mb-2">Claim Details</h4>
                      <div className="space-y-2 text-sm text-purple-700">
                        <div className="flex justify-between">
                          <span>Cost:</span>
                          <span className="font-bold">{formatFlixbits(reward.cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Your Balance:</span>
                          <span className="font-bold">{formatFlixbits(user?.flixbits || 0)}</span>
                        </div>
                        <div className="flex justify-between border-t border-purple-300 pt-2">
                          <span>Remaining After:</span>
                          <span className="font-bold">{formatFlixbits((user?.flixbits || 0) - reward.cost)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Claim Instructions:</strong> {reward.claimInstructions}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 rtl:space-x-reverse">
                    <button
                      onClick={() => setShowClaimModal(null)}
                      className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleClaimReward(reward.id)}
                      disabled={isClaimingReward || (user?.flixbits || 0) < reward.cost}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClaimingReward ? (
                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Claiming...</span>
                        </div>
                      ) : (
                        'Confirm Claim'
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsCenter;