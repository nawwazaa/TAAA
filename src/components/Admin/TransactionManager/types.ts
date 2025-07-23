export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'refund' | 'withdrawal' | 'deposit' | 'reward' | 'subscription';
  amount: number;
  currency: 'FB' | 'SAR' | 'AED' | 'USD' | 'EUR';
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  description: string;
  paymentMethod: string;
  gatewayTransactionId?: string;
  flixbitsInvolved: number;
  usdEquivalent: number;
  fees: number;
  location: {
    country: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  deviceInfo: {
    platform: 'iOS' | 'Android' | 'Web';
    version: string;
    ip: string;
  };
  createdAt: Date;
  updatedAt: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  customerSupport?: {
    ticketId?: string;
    status: 'none' | 'pending' | 'responded' | 'resolved';
    messages: CustomerMessage[];
  };
}

export interface CustomerMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'support';
  message: string;
  timestamp: Date;
  attachments?: string[];
}

export interface TransactionFilters {
  searchQuery: string;
  statusFilter: 'all' | 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  typeFilter: 'all' | 'purchase' | 'sale' | 'refund' | 'withdrawal' | 'deposit' | 'reward' | 'subscription';
  currencyFilter: 'all' | 'FB' | 'SAR' | 'AED' | 'USD' | 'EUR';
  dateRange: { start: string; end: string };
}