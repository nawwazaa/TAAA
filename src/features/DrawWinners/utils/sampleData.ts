import { DrawEvent, DrawPrize } from '../types';

export const generateSampleDrawEvents = (): DrawEvent[] => {
  return [
    {
      id: 'draw_event_001',
      title: 'Tech Conference 2024 - Grand Prize Draw',
      description: 'Join our amazing tech conference and win incredible prizes! Scan the QR code at the venue to enter the draw.',
      creatorId: 'influencer_001',
      creatorName: 'Tech Guru Mike',
      creatorType: 'influencer',
      location: {
        name: 'Dubai World Trade Centre',
        address: 'Sheikh Zayed Road, Trade Centre, Dubai',
        city: 'Dubai',
        coordinates: { lat: 25.2285, lng: 55.3273 },
        verificationRadius: 200 // 200 meters
      },
      eventDate: new Date('2024-02-15'),
      startTime: '09:00',
      endTime: '18:00',
      qrCode: {
        id: 'qr_tech_conf_2024',
        data: JSON.stringify({ eventId: 'draw_event_001', type: 'draw_event', timestamp: Date.now() }),
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
        expiresAt: new Date('2024-02-15T23:59:59'),
        isActive: true,
        scanLimit: 1
      },
      prizes: [
        {
          id: 'prize_001',
          title: 'Grand Prize - Latest iPhone 15 Pro',
          description: 'Brand new iPhone 15 Pro 256GB with all accessories',
          type: 'physical',
          value: 5000, // Flixbits equivalent
          quantity: 1,
          sponsorId: 'sponsor_apple',
          sponsorName: 'Apple Store Dubai',
          claimInstructions: 'Visit Apple Store Dubai Mall with your claim code and ID',
          expiresAt: new Date('2024-03-15'),
          imageUrl: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
          isActive: true
        },
        {
          id: 'prize_002',
          title: '2nd Prize - 5,000 Flixbits',
          description: 'Digital currency added directly to your FlixMarket wallet',
          type: 'flixbits',
          value: 5000,
          quantity: 3,
          claimInstructions: 'Flixbits will be automatically added to your wallet',
          isActive: true
        },
        {
          id: 'prize_003',
          title: '3rd Prize - Restaurant Voucher',
          description: '$100 dining voucher for Mario\'s Pizza Restaurant',
          type: 'voucher',
          value: 1000, // Flixbits equivalent
          quantity: 10,
          sponsorId: 'seller_mario',
          sponsorName: 'Mario\'s Pizza Restaurant',
          claimInstructions: 'Present claim code at Mario\'s Pizza Restaurant',
          expiresAt: new Date('2024-04-15'),
          isActive: true
        }
      ],
      maxAttendees: 500,
      currentAttendees: 127,
      attendees: [
        {
          id: 'attendee_001',
          userId: 'user_001',
          userName: 'Ahmed Hassan',
          userEmail: 'ahmed@email.com',
          userPhone: '+971501234567',
          scanTime: new Date('2024-01-20T10:30:00'),
          location: { lat: 25.2285, lng: 55.3273, accuracy: 5 },
          deviceInfo: {
            platform: 'iOS',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
            ip: '192.168.1.100'
          },
          verificationStatus: 'verified',
          isEligibleForDraw: true,
          qrScanData: {
            qrCodeId: 'qr_tech_conf_2024',
            scanId: 'scan_001',
            verificationHash: 'hash_001'
          }
        }
      ],
      winners: [],
      status: 'active',
      drawSettings: {
        drawDate: new Date('2024-02-15T19:00:00'),
        isAutomatic: false,
        requiresApproval: true,
        allowMultipleWins: false
      },
      ratings: [
        {
          id: 'rating_001',
          userId: 'user_001',
          userName: 'Ahmed Hassan',
          eventId: 'draw_event_001',
          creatorId: 'influencer_001',
          rating: 5,
          comment: 'Amazing event! Well organized and great prizes.',
          categories: {
            organization: 5,
            venue: 4,
            prizes: 5,
            overall: 5
          },
          createdAt: new Date('2024-01-20T15:00:00')
        }
      ],
      averageRating: 5.0,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 'draw_event_002',
      title: 'Fashion Week Dubai - VIP Experience Draw',
      description: 'Attend our exclusive fashion show and win VIP experiences and designer items!',
      creatorId: 'influencer_002',
      creatorName: 'Sarah Fashion',
      creatorType: 'influencer',
      location: {
        name: 'Dubai Design District',
        address: 'Building 6, Dubai Design District',
        city: 'Dubai',
        coordinates: { lat: 25.1901, lng: 55.2441 },
        verificationRadius: 150
      },
      eventDate: new Date('2024-02-20'),
      startTime: '19:00',
      endTime: '23:00',
      qrCode: {
        id: 'qr_fashion_week_2024',
        data: JSON.stringify({ eventId: 'draw_event_002', type: 'draw_event', timestamp: Date.now() }),
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
        expiresAt: new Date('2024-02-21T02:00:00'),
        isActive: true,
        scanLimit: 1
      },
      prizes: [
        {
          id: 'prize_004',
          title: 'VIP Fashion Week Pass',
          description: 'Exclusive access to all fashion week events for 2024',
          type: 'service',
          value: 3000,
          quantity: 2,
          sponsorId: 'sponsor_fashion_week',
          sponsorName: 'Dubai Fashion Week',
          claimInstructions: 'Contact Dubai Fashion Week organizers with claim code',
          expiresAt: new Date('2024-12-31'),
          isActive: true
        },
        {
          id: 'prize_005',
          title: 'Designer Handbag Collection',
          description: 'Luxury designer handbag worth $500',
          type: 'physical',
          value: 2500,
          quantity: 5,
          sponsorId: 'sponsor_luxury_brands',
          sponsorName: 'Luxury Brands Dubai',
          claimInstructions: 'Visit Luxury Brands store in Dubai Mall',
          expiresAt: new Date('2024-03-20'),
          isActive: true
        }
      ],
      maxAttendees: 200,
      currentAttendees: 89,
      attendees: [],
      winners: [],
      status: 'active',
      drawSettings: {
        drawDate: new Date('2024-02-20T23:30:00'),
        isAutomatic: true,
        requiresApproval: false,
        allowMultipleWins: false
      },
      ratings: [],
      averageRating: 0,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    }
  ];
};