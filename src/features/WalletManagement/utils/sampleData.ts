import { WalletTransaction } from '../types';

export const generateSampleTransactions = (userId: string): WalletTransaction[] => {
  return [
    {
      id: 'txn_001',
      type: 'earn',
      amount: 150,
      description: 'QR Code Redemption - Mario\'s Pizza Special',
      category: 'qr_scan',
      status: 'completed',
      relatedId: 'qr_offer_001',
      location: { country: 'UAE', city: 'Dubai' },
      deviceInfo: { platform: 'iOS', userAgent: 'Mozilla/5.0 (iPhone)' },
      createdAt: new Date('2024-01-20T14:30:00'),
      completedAt: new Date('2024-01-20T14:30:05')
    },
    {
      id: 'txn_002',
      type: 'reward',
      amount: 200,
      description: 'Game Prediction Correct - Manchester United vs Liverpool',
      category: 'game_prediction',
      status: 'completed',
      relatedId: 'game_001',
      createdAt: new Date('2024-01-19T20:15:00'),
      completedAt: new Date('2024-01-19T20:15:00')
    },
    {
      id: 'txn_003',
      type: 'earn',
      amount: 50,
      description: 'Referral Bonus - Friend joined FlixMarket',
      category: 'referral',
      status: 'completed',
      fromUserId: 'user_new_001',
      fromUserName: 'Sarah Al-Zahra',
      createdAt: new Date('2024-01-18T16:45:00'),
      completedAt: new Date('2024-01-18T16:45:00')
    },
    {
      id: 'txn_004',
      type: 'buy',
      amount: 1000,
      usdAmount: 100,
      description: 'Purchased Flixbits via Credit Card',
      category: 'exchange',
      status: 'completed',
      paymentMethod: 'Visa **** 1234',
      gatewayTransactionId: 'ch_1234567890',
      fees: 3.20,
      exchangeRate: 10.0,
      createdAt: new Date('2024-01-17T10:20:00'),
      completedAt: new Date('2024-01-17T10:22:00')
    },
    {
      id: 'txn_005',
      type: 'spend',
      amount: 500,
      usdAmount: 50,
      description: 'Purchased iPhone Case from TechWorld',
      category: 'marketplace',
      status: 'completed',
      toUserId: 'seller_tech_001',
      toUserName: 'TechWorld Electronics',
      relatedId: 'product_001',
      createdAt: new Date('2024-01-16T13:15:00'),
      completedAt: new Date('2024-01-16T13:15:00')
    },
    {
      id: 'txn_006',
      type: 'earn',
      amount: 100,
      description: 'Video Contest Participation Bonus',
      category: 'contest',
      status: 'completed',
      relatedId: 'video_contest_001',
      createdAt: new Date('2024-01-15T18:30:00'),
      completedAt: new Date('2024-01-15T18:30:00')
    },
    {
      id: 'txn_007',
      type: 'sell',
      amount: 800,
      usdAmount: 64,
      description: 'Sold Flixbits to PayPal',
      category: 'exchange',
      status: 'pending',
      paymentMethod: 'PayPal Account',
      fees: 2.56,
      exchangeRate: 8.0,
      createdAt: new Date('2024-01-20T09:45:00'),
      expiresAt: new Date('2024-01-20T10:00:00')
    },
    {
      id: 'txn_008',
      type: 'earn',
      amount: 25,
      description: 'Daily Login Bonus',
      category: 'bonus',
      status: 'completed',
      createdAt: new Date('2024-01-20T08:00:00'),
      completedAt: new Date('2024-01-20T08:00:00')
    },
    {
      id: 'txn_009',
      type: 'spend',
      amount: 15000,
      description: 'Redeemed iPhone 15 Pro Reward',
      category: 'marketplace',
      status: 'completed',
      relatedId: 'reward_iphone_001',
      createdAt: new Date('2024-01-14T15:20:00'),
      completedAt: new Date('2024-01-14T15:20:00')
    },
    {
      id: 'txn_010',
      type: 'transfer',
      amount: 200,
      description: 'Sent Flixbits to Ahmed Hassan',
      category: 'transfer',
      status: 'completed',
      toUserId: 'user_ahmed_001',
      toUserName: 'Ahmed Hassan',
      createdAt: new Date('2024-01-13T11:30:00'),
      completedAt: new Date('2024-01-13T11:30:00')
    }
  ];
};