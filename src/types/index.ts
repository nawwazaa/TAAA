export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'user' | 'influencer' | 'seller';
  location?: {
    country?: string;
    city?: string;
    district?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  interests?: string[];
  qrCode: string;
  flixbits: number;
  createdAt: Date;
  referralCode?: string;
  referredBy?: string;
  referrals?: Referral[];
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  referredId: string;
  referredName: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'expired';
  bonusAmount: number;
  bonusPaid: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface Seller extends User {
  userType: 'seller';
  storeName: string;
  storeDescription: string;
  rating: number;
  offers: Offer[];
  freeNotifications: number;
  location: {
    coordinates: {
      lat: number;
      lng: number;
    };
    address: string;
  };
}

interface Influencer extends User {
  userType: 'influencer';
  followers: string[];
  campaigns: Campaign[];
  videos: VideoAd[];
}

interface Offer {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  image: string;
  startTime: Date;
  endTime: Date;
  discount: number;
  rating: number;
  location: {
    lat: number;
    lng: number;
  };
}

interface Campaign {
  id: string;
  influencerId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participants: string[];
}

interface VideoAd {
  id: string;
  title: string;
  url: string;
  duration: number;
  rewards: number;
  createdBy: string;
}

interface Tournament {
  id: string;
  name: string;
  games: Game[];
  startDate: Date;
  endDate: Date;
  minPredictionAccuracy: number;
  prizes: Prize[];
}

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  gameTime: Date;
  predictions: Prediction[];
  actualResult?: GameResult;
}

interface Prediction {
  id: string;
  userId: string;
  gameId: string;
  predictedResult: GameResult;
  isCorrect?: boolean;
  points: number;
}

interface GameResult {
  homeScore: number;
  awayScore: number;
  winner: 'home' | 'away' | 'draw';
}

interface Prize {
  id: string;
  name: string;
  description: string;
  value: number;
  winnersCount: number;
  claimMethod: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  targetAudience: {
    userType?: string[];
    location?: {
      radius: number;
      center: {
        lat: number;
        lng: number;
      };
    };
    interests?: string[];
  };
  scheduledTime: Date;
  price: number;
  senderId: string;
}