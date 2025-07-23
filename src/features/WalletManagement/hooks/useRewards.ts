import { useState, useEffect } from 'react';
import { RewardItem } from '../types';

export const useRewards = () => {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([
    'Electronics',
    'Fashion',
    'Food & Dining',
    'Travel',
    'Entertainment',
    'Health & Beauty',
    'Home & Garden',
    'Sports & Fitness'
  ]);

  useEffect(() => {
    const loadRewards = async () => {
      setLoading(true);
      try {
        // Sample rewards data
        const sampleRewards: RewardItem[] = [
          {
            id: 'reward_001',
            title: 'iPhone 15 Pro',
            description: 'Latest iPhone 15 Pro 256GB in Space Black',
            type: 'physical',
            cost: 50000, // 50,000 Flixbits
            originalPrice: 1199,
            discount: 15,
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'Electronics',
            availability: {
              total: 10,
              remaining: 3,
              isLimited: true
            },
            sponsor: {
              id: 'apple_store',
              name: 'Apple Store Dubai',
              logo: '🍎'
            },
            claimInstructions: 'Visit Apple Store Dubai Mall with your claim code and ID',
            expiresAt: new Date('2024-12-31'),
            isActive: true,
            rating: 4.9,
            reviewCount: 127,
            tags: ['premium', 'electronics', 'smartphone'],
            createdAt: new Date('2024-01-01')
          },
          {
            id: 'reward_002',
            title: '$100 Restaurant Voucher',
            description: 'Dining voucher valid at 50+ premium restaurants',
            type: 'voucher',
            cost: 8000, // 8,000 Flixbits
            originalPrice: 100,
            image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'Food & Dining',
            availability: {
              total: 100,
              remaining: 67,
              isLimited: false
            },
            claimInstructions: 'Present voucher code at participating restaurants',
            isActive: true,
            rating: 4.7,
            reviewCount: 89,
            tags: ['dining', 'voucher', 'restaurants'],
            createdAt: new Date('2024-01-05')
          },
          {
            id: 'reward_003',
            title: 'Designer Handbag',
            description: 'Luxury designer handbag from premium collection',
            type: 'physical',
            cost: 25000, // 25,000 Flixbits
            originalPrice: 599,
            discount: 20,
            image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'Fashion',
            availability: {
              total: 5,
              remaining: 2,
              isLimited: true
            },
            sponsor: {
              id: 'luxury_brands',
              name: 'Luxury Brands Dubai',
              logo: '👜'
            },
            claimInstructions: 'Visit Luxury Brands store in Dubai Mall',
            expiresAt: new Date('2024-06-30'),
            isActive: true,
            rating: 4.8,
            reviewCount: 45,
            tags: ['luxury', 'fashion', 'handbag'],
            createdAt: new Date('2024-01-10')
          },
          {
            id: 'reward_004',
            title: 'Spa Day Package',
            description: 'Full day spa treatment at 5-star hotel spa',
            type: 'service',
            cost: 15000, // 15,000 Flixbits
            originalPrice: 350,
            discount: 25,
            image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'Health & Beauty',
            availability: {
              total: 20,
              remaining: 12,
              isLimited: false
            },
            sponsor: {
              id: 'luxury_spa',
              name: 'Atlantis Spa Dubai',
              logo: '🧖‍♀️'
            },
            claimInstructions: 'Book appointment with spa using claim code',
            expiresAt: new Date('2024-08-31'),
            isActive: true,
            rating: 4.9,
            reviewCount: 78,
            tags: ['spa', 'relaxation', 'luxury'],
            createdAt: new Date('2024-01-15')
          },
          {
            id: 'reward_005',
            title: 'Gaming Headset',
            description: 'Premium wireless gaming headset with noise cancellation',
            type: 'physical',
            cost: 12000, // 12,000 Flixbits
            originalPrice: 299,
            discount: 30,
            image: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'Electronics',
            availability: {
              total: 50,
              remaining: 23,
              isLimited: false
            },
            claimInstructions: 'Shipped to your registered address within 3-5 business days',
            isActive: true,
            rating: 4.6,
            reviewCount: 156,
            tags: ['gaming', 'electronics', 'headset'],
            createdAt: new Date('2024-01-20')
          }
        ];

        setRewards(sampleRewards);
      } catch (error) {
        console.error('Error loading rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRewards();
  }, []);

  const claimReward = async (rewardId: string, userFlixbits: number): Promise<{ success: boolean; claimCode?: string; error?: string }> => {
    const reward = rewards.find(r => r.id === rewardId);
    
    if (!reward) {
      return { success: false, error: 'Reward not found' };
    }

    if (!reward.isActive) {
      return { success: false, error: 'Reward is no longer available' };
    }

    if (reward.availability.remaining <= 0) {
      return { success: false, error: 'Reward is out of stock' };
    }

    if (userFlixbits < reward.cost) {
      return { success: false, error: 'Insufficient Flixbits' };
    }

    if (reward.expiresAt && new Date() > reward.expiresAt) {
      return { success: false, error: 'Reward has expired' };
    }

    // Generate claim code
    const claimCode = `CLAIM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Update reward availability
    setRewards(prev => 
      prev.map(r => 
        r.id === rewardId 
          ? { ...r, availability: { ...r.availability, remaining: r.availability.remaining - 1 } }
          : r
      )
    );

    // Simulate claim processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, claimCode };
  };

  const getRewardsByCategory = (category: string) => {
    return rewards.filter(reward => reward.category === category && reward.isActive);
  };

  const getAvailableRewards = () => {
    return rewards.filter(reward => 
      reward.isActive && 
      reward.availability.remaining > 0 &&
      (!reward.expiresAt || new Date() < reward.expiresAt)
    );
  };

  const getFeaturedRewards = () => {
    return rewards
      .filter(reward => reward.isActive && reward.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  };

  return {
    rewards,
    categories,
    loading,
    claimReward,
    getRewardsByCategory,
    getAvailableRewards,
    getFeaturedRewards
  };
};