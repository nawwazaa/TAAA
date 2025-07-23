import { Transaction } from '../types';

export const generateSampleTransactions = (): Transaction[] => {
  return [
    {
      id: 'txn_001',
      type: 'purchase',
      amount: 150.00,
      currency: 'SAR',
      status: 'completed',
      userId: 'user_001',
      userName: 'Ahmed Hassan Al-Mahmoud',
      userEmail: 'ahmed.hassan@email.com',
      userPhone: '+971501234567',
      description: 'Pizza Special Offer - Mario\'s Restaurant',
      paymentMethod: 'Mada Card',
      gatewayTransactionId: 'chg_TS02A5720231433Qs1w0809820',
      flixbitsInvolved: 1500,
      usdEquivalent: 40.00,
      fees: 2.63,
      location: { country: 'UAE', city: 'Dubai' },
      deviceInfo: { platform: 'iOS', version: '2.1.0', ip: '192.168.1.100' },
      createdAt: new Date('2024-01-20T14:30:00'),
      updatedAt: new Date('2024-01-20T14:31:00'),
      reviewedBy: 'admin',
      customerSupport: {
        status: 'none',
        messages: []
      }
    },
    {
      id: 'txn_002',
      type: 'subscription',
      amount: 1500,
      currency: 'FB',
      status: 'completed',
      userId: 'seller_001',
      userName: 'Mario\'s Pizza Restaurant',
      userEmail: 'mario@pizzarestaurant.com',
      userPhone: '+971507654321',
      description: 'Professional Push Notification Package',
      paymentMethod: 'Flixbits Wallet',
      flixbitsInvolved: 1500,
      usdEquivalent: 150.00,
      fees: 0,
      location: { country: 'UAE', city: 'Dubai' },
      deviceInfo: { platform: 'Android', version: '2.0.8', ip: '192.168.1.101' },
      createdAt: new Date('2024-01-19T16:45:00'),
      updatedAt: new Date('2024-01-19T16:46:00'),
      customerSupport: {
        status: 'pending',
        messages: [
          {
            id: 'msg_001',
            senderId: 'seller_001',
            senderName: 'Mario\'s Pizza Restaurant',
            senderType: 'customer',
            message: 'I need help setting up my push notifications. The package was purchased but I can\'t find the configuration options.',
            timestamp: new Date('2024-01-20T10:30:00')
          }
        ]
      }
    },
    {
      id: 'txn_003',
      type: 'reward',
      amount: 150,
      currency: 'FB',
      status: 'completed',
      userId: 'user_002',
      userName: 'Sarah Al-Zahra',
      userEmail: 'sarah@email.com',
      userPhone: '+971509876543',
      description: 'Game Prediction Reward - Manchester United vs Liverpool',
      paymentMethod: 'System Reward',
      flixbitsInvolved: 150,
      usdEquivalent: 15.00,
      fees: 0,
      location: { country: 'UAE', city: 'Abu Dhabi' },
      deviceInfo: { platform: 'iOS', version: '2.1.0', ip: '192.168.1.102' },
      createdAt: new Date('2024-01-18T20:15:00'),
      updatedAt: new Date('2024-01-18T20:15:00'),
      customerSupport: {
        status: 'none',
        messages: []
      }
    },
    {
      id: 'txn_004',
      type: 'refund',
      amount: 75.50,
      currency: 'AED',
      status: 'pending',
      userId: 'user_003',
      userName: 'Mohammed Ali Bin Rashid',
      userEmail: 'mohammed.ali@email.com',
      userPhone: '+971508765432',
      description: 'Refund for Fashion Item - Order #12345',
      paymentMethod: 'Visa Card',
      gatewayTransactionId: 'ref_TS02A5720231433Qs1w0809823',
      flixbitsInvolved: 755,
      usdEquivalent: 20.55,
      fees: -2.19,
      location: { country: 'UAE', city: 'Sharjah' },
      deviceInfo: { platform: 'Android', version: '2.0.5', ip: '192.168.1.103' },
      createdAt: new Date('2024-01-20T09:20:00'),
      updatedAt: new Date('2024-01-20T09:25:00'),
      customerSupport: {
        status: 'responded',
        messages: [
          {
            id: 'msg_002',
            senderId: 'user_003',
            senderName: 'Mohammed Ali Bin Rashid',
            senderType: 'customer',
            message: 'I want to return this item as it doesn\'t fit properly. How long will the refund take?',
            timestamp: new Date('2024-01-20T09:22:00')
          },
          {
            id: 'msg_003',
            senderId: 'support_001',
            senderName: 'Customer Support',
            senderType: 'support',
            message: 'Hello Mohammed, thank you for contacting us. Your refund request has been approved and will be processed within 3-5 business days. You will receive a confirmation email once completed.',
            timestamp: new Date('2024-01-20T11:15:00')
          }
        ]
      }
    },
    {
      id: 'txn_005',
      type: 'withdrawal',
      amount: 500.00,
      currency: 'SAR',
      status: 'failed',
      userId: 'influencer_001',
      userName: 'Sarah Fashion Blogger',
      userEmail: 'sarah@fashionblog.com',
      userPhone: '+966501234567',
      description: 'Flixbits to SAR Withdrawal',
      paymentMethod: 'Bank Transfer',
      flixbitsInvolved: 5000,
      usdEquivalent: 133.33,
      fees: 25.00,
      location: { country: 'Saudi Arabia', city: 'Riyadh' },
      deviceInfo: { platform: 'Web', version: '2.1.0', ip: '192.168.1.104' },
      createdAt: new Date('2024-01-17T14:00:00'),
      updatedAt: new Date('2024-01-17T14:05:00'),
      reviewNotes: 'Bank account verification failed. Customer needs to provide valid IBAN.',
      customerSupport: {
        status: 'pending',
        messages: [
          {
            id: 'msg_004',
            senderId: 'influencer_001',
            senderName: 'Sarah Fashion Blogger',
            senderType: 'customer',
            message: 'My withdrawal failed. I provided the correct IBAN number. Please help me resolve this issue.',
            timestamp: new Date('2024-01-18T08:30:00')
          }
        ]
      }
    }
  ];
};