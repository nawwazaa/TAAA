export interface WalletTransaction {
  id: string;
  type: 'earn' | 'spend' | 'buy' | 'sell' | 'transfer' | 'reward' | 'refund' | 'withdrawal' | 'deposit';
  amount: number; // Flixbits amount
  usdAmount?: number; // USD equivalent
  description: string;
  category: 'qr_scan' | 'game_prediction' | 'referral' | 'purchase' | 'sale' | 'contest' | 'bonus' | 'marketplace' | 'exchange';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  fromUserId?: string;
  fromUserName?: string;
  toUserId?: string;
  toUserName?: string;
  relatedId?: string; // Related offer, game, etc.
  paymentMethod?: string;
  gatewayTransactionId?: string;
  fees?: number;
  exchangeRate?: number; // USD to Flixbits rate at time of transaction
  location?: {
    country: string;
    city: string;
  };
  deviceInfo?: {
    platform: string;
    userAgent: string;
  };
  createdAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
}

export interface WalletBalance {
  totalFlixbits: number;
  availableFlixbits: number;
  pendingFlixbits: number;
  lockedFlixbits: number;
  usdEquivalent: number;
  lastUpdated: Date;
}

export interface ExchangeRate {
  buyRate: number; // USD to Flixbits (how many FB you get per USD)
  sellRate: number; // Flixbits to USD (how many USD you get per FB)
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
  dailyChange: number; // percentage
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'apple_pay' | 'google_pay' | 'tap_payments';
  name: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  isActive: boolean;
  fees: {
    buyFeePercentage: number;
    sellFeePercentage: number;
    fixedFee: number;
  };
  limits: {
    dailyBuyLimit: number;
    dailySellLimit: number;
    monthlyBuyLimit: number;
    monthlySellLimit: number;
  };
  supportedCountries: string[];
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  type: 'physical' | 'digital' | 'voucher' | 'service' | 'discount';
  cost: number; // Flixbits required
  originalPrice?: number; // Original USD price
  discount?: number; // Percentage discount
  image: string;
  category: string;
  availability: {
    total: number;
    remaining: number;
    isLimited: boolean;
  };
  sponsor?: {
    id: string;
    name: string;
    logo: string;
  };
  claimInstructions: string;
  expiresAt?: Date;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: Date;
}

export interface WalletStats {
  totalEarned: number;
  totalSpent: number;
  totalBought: number;
  totalSold: number;
  averageTransactionSize: number;
  transactionCount: number;
  favoriteCategory: string;
  monthlyEarnings: number;
  monthlySpending: number;
  savingsRate: number; // percentage of earnings saved
}

export interface ExchangeOrder {
  id: string;
  userId: string;
  type: 'buy' | 'sell';
  flixbitsAmount: number;
  usdAmount: number;
  exchangeRate: number;
  fees: number;
  netAmount: number;
  paymentMethodId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  gatewayTransactionId?: string;
  failureReason?: string;
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

export interface WalletFilters {
  dateRange: { start: string; end: string };
  transactionType: 'all' | 'earn' | 'spend' | 'buy' | 'sell' | 'transfer';
  category: 'all' | 'qr_scan' | 'game_prediction' | 'referral' | 'purchase' | 'sale' | 'contest' | 'bonus' | 'marketplace' | 'exchange';
  status: 'all' | 'pending' | 'completed' | 'failed' | 'cancelled';
  amountRange: { min: number; max: number };
  searchQuery: string;
}