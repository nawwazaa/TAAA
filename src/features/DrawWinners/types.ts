export interface DrawEvent {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorType: 'influencer' | 'seller';
  location: {
    name: string;
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    verificationRadius: number; // meters
  };
  eventDate: Date;
  startTime: string;
  endTime: string;
  qrCode: {
    id: string;
    data: string;
    imageUrl: string;
    expiresAt: Date;
    isActive: boolean;
    scanLimit?: number; // max scans per person
  };
  prizes: DrawPrize[];
  maxAttendees: number;
  currentAttendees: number;
  attendees: EventAttendee[];
  winners: DrawWinner[];
  status: 'draft' | 'active' | 'ended' | 'cancelled';
  drawSettings: {
    drawDate: Date;
    isAutomatic: boolean;
    requiresApproval: boolean;
    allowMultipleWins: boolean;
  };
  ratings: EventRating[];
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DrawPrize {
  id: string;
  title: string;
  description: string;
  type: 'flixbits' | 'physical' | 'voucher' | 'service';
  value: number; // Flixbits amount or monetary value
  quantity: number; // number of winners for this prize
  sponsorId?: string;
  sponsorName?: string;
  claimInstructions: string;
  expiresAt?: Date;
  imageUrl?: string;
  isActive: boolean;
}

export interface EventAttendee {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  scanTime: Date;
  location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  deviceInfo: {
    platform: string;
    userAgent: string;
    ip: string;
  };
  verificationStatus: 'verified' | 'pending' | 'failed';
  isEligibleForDraw: boolean;
  qrScanData: {
    qrCodeId: string;
    scanId: string;
    verificationHash: string;
  };
}

export interface DrawWinner {
  id: string;
  attendeeId: string;
  userId: string;
  userName: string;
  prizeId: string;
  prizeTitle: string;
  prizeType: 'flixbits' | 'physical' | 'voucher' | 'service';
  prizeValue: number;
  selectedAt: Date;
  claimStatus: 'pending' | 'claimed' | 'expired';
  claimCode: string;
  claimDeadline: Date;
  claimedAt?: Date;
  deliveryInfo?: {
    method: 'pickup' | 'delivery' | 'digital';
    address?: string;
    trackingNumber?: string;
    status: 'pending' | 'shipped' | 'delivered';
  };
}

export interface EventRating {
  id: string;
  userId: string;
  userName: string;
  eventId: string;
  creatorId: string;
  rating: number; // 1-5 stars
  comment?: string;
  categories: {
    organization: number;
    venue: number;
    prizes: number;
    overall: number;
  };
  createdAt: Date;
}

export interface QRScanResult {
  isValid: boolean;
  attendee?: EventAttendee;
  error?: string;
  verificationDetails: {
    locationVerified: boolean;
    timeVerified: boolean;
    qrCodeVerified: boolean;
    userVerified: boolean;
    distance?: number;
  };
}

export interface DrawFilters {
  status: 'all' | 'draft' | 'active' | 'ended' | 'cancelled';
  creatorType: 'all' | 'influencer' | 'seller';
  dateRange: { start: string; end: string };
  location: string;
  searchQuery: string;
}