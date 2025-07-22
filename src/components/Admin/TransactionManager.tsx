import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DollarSign, 
  CreditCard, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  RefreshCw,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ArrowUpDown,
  FileText,
  Send,
  Phone,
  Mail,
  MessageCircle,
  Star,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Transaction {
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

interface CustomerMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'support';
  message: string;
  timestamp: Date;
  attachments?: string[];
}

const TransactionManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'purchase' | 'sale' | 'refund' | 'withdrawal' | 'deposit' | 'reward' | 'subscription'>('all');
  const [currencyFilter, setCurrencyFilter] = useState<'all' | 'FB' | 'SAR' | 'AED' | 'USD' | 'EUR'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showCustomerSupport, setShowCustomerSupport] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');

  // Sample transaction data
  useEffect(() => {
    const sampleTransactions: Transaction[] = [
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

    setTransactions(sampleTransactions);
    setFilteredTransactions(sampleTransactions);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(txn => 
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.userPhone.includes(searchQuery) ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.gatewayTransactionId && txn.gatewayTransactionId.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(txn => txn.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(txn => txn.type === typeFilter);
    }

    // Currency filter
    if (currencyFilter !== 'all') {
      filtered = filtered.filter(txn => txn.currency === currencyFilter);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter(txn => 
        txn.createdAt >= startDate && txn.createdAt <= endDate
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, statusFilter, typeFilter, currencyFilter, dateRange]);

  const handleSendSupportMessage = () => {
    if (!selectedTransaction || !supportMessage.trim()) return;

    const newMessage: CustomerMessage = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || 'support',
      senderName: user?.name || 'Customer Support',
      senderType: 'support',
      message: supportMessage,
      timestamp: new Date()
    };

    setTransactions(prev => prev.map(txn => 
      txn.id === selectedTransaction.id 
        ? {
            ...txn,
            customerSupport: {
              ...txn.customerSupport!,
              status: 'responded',
              messages: [...(txn.customerSupport?.messages || []), newMessage]
            }
          }
        : txn
    ));

    setSupportMessage('');
    alert('Message sent to customer successfully!');
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Transaction ID', 'Type', 'Amount', 'Currency', 'Status', 'User Name', 'Email', 'Phone', 'Description', 'Payment Method', 'Date'].join(','),
      ...filteredTransactions.map(txn => [
        txn.id,
        txn.type,
        txn.amount,
        txn.currency,
        txn.status,
        txn.userName,
        txn.userEmail,
        txn.userPhone,
        txn.description,
        txn.paymentMethod,
        txn.createdAt.toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'sale': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'refund': return <ArrowUpDown className="w-4 h-4 text-orange-500" />;
      case 'withdrawal': return <Download className="w-4 h-4 text-purple-500" />;
      case 'deposit': return <DollarSign className="w-4 h-4 text-teal-500" />;
      case 'reward': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'subscription': return <FileText className="w-4 h-4 text-indigo-500" />;
      default: return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSupportStatusColor = (status: string) => {
    switch (status) {
      case 'none': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-red-100 text-red-800';
      case 'responded': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate summary statistics
  const totalTransactions = filteredTransactions.length;
  const totalRevenue = filteredTransactions
    .filter(txn => txn.status === 'completed' && (txn.type === 'purchase' || txn.type === 'subscription'))
    .reduce((sum, txn) => sum + txn.usdEquivalent, 0);
  const pendingTransactions = filteredTransactions.filter(txn => txn.status === 'pending').length;
  const supportTickets = filteredTransactions.filter(txn => 
    txn.customerSupport?.status === 'pending' || txn.customerSupport?.status === 'responded'
  ).length;

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">💳 Transaction Management</h1>
        <p className="text-blue-100">Monitor all transactions, handle customer support, and manage financial operations</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-900">{totalTransactions}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{pendingTransactions}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Support Tickets</p>
              <p className="text-3xl font-bold text-gray-900">{supportTickets}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-3 md:space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by transaction ID, user name, email, phone, or description..."
              className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="completed">✅ Completed</option>
              <option value="failed">❌ Failed</option>
              <option value="cancelled">🚫 Cancelled</option>
              <option value="refunded">🔄 Refunded</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              <option value="purchase">🛒 Purchase</option>
              <option value="sale">💰 Sale</option>
              <option value="refund">↩️ Refund</option>
              <option value="withdrawal">📤 Withdrawal</option>
              <option value="deposit">📥 Deposit</option>
              <option value="reward">🎁 Reward</option>
              <option value="subscription">📋 Subscription</option>
            </select>

            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value as any)}
              className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Currencies</option>
              <option value="FB">🪙 Flixbits</option>
              <option value="SAR">🇸🇦 SAR</option>
              <option value="AED">🇦🇪 AED</option>
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
            </select>

            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Start Date"
            />

            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="End Date"
            />

            <button
              onClick={exportTransactions}
              className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 md:space-x-2 rtl:space-x-reverse text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Support</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(transaction.type)}
                      <div className="ml-3 rtl:ml-0 rtl:mr-3">
                        <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                        <div className="text-sm text-gray-500 capitalize">{transaction.type}</div>
                        {transaction.gatewayTransactionId && (
                          <div className="text-xs text-gray-400 font-mono">{transaction.gatewayTransactionId}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.userName}</div>
                      <div className="text-sm text-gray-500">{transaction.userEmail}</div>
                      <div className="text-sm text-gray-500">{transaction.userPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.amount} {transaction.currency}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${transaction.usdEquivalent.toFixed(2)} USD
                      </div>
                      {transaction.fees !== 0 && (
                        <div className="text-xs text-gray-400">
                          Fee: {transaction.fees > 0 ? '+' : ''}{transaction.fees.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSupportStatusColor(transaction.customerSupport?.status || 'none')}`}>
                      {transaction.customerSupport?.status || 'none'}
                    </span>
                    {transaction.customerSupport?.messages && transaction.customerSupport.messages.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {transaction.customerSupport.messages.length} message(s)
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{transaction.createdAt.toLocaleDateString()}</div>
                    <div>{transaction.createdAt.toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowTransactionDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {transaction.customerSupport?.status !== 'none' && (
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowCustomerSupport(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Customer Support"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3 p-3">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              {/* Transaction Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {getTypeIcon(transaction.type)}
                  <div>
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{transaction.id}</div>
                    <div className="text-xs text-gray-500 capitalize">{transaction.type}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                  {transaction.customerSupport?.status !== 'none' && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSupportStatusColor(transaction.customerSupport?.status || 'none')}`}>
                      {transaction.customerSupport?.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-900 mb-1 truncate">{transaction.userName}</div>
                <div className="text-xs text-gray-500 truncate">{transaction.userEmail}</div>
                <div className="text-xs text-gray-500">{transaction.userPhone}</div>
              </div>

              {/* Amount and Date */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-base font-bold text-gray-900">
                    {transaction.amount} {transaction.currency}
                  </div>
                  <div className="text-xs text-gray-500">
                    ${transaction.usdEquivalent.toFixed(2)} USD
                  </div>
                  {transaction.fees !== 0 && (
                    <div className="text-xs text-gray-400">
                      Fee: {transaction.fees > 0 ? '+' : ''}{transaction.fees.toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{transaction.createdAt.toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{transaction.createdAt.toLocaleTimeString()}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <div className="text-sm text-gray-600 line-clamp-2 mb-1">{transaction.description}</div>
                <div className="text-xs text-gray-500 mt-1">Payment: {transaction.paymentMethod}</div>
                {transaction.gatewayTransactionId && (
                  <div className="text-xs text-gray-400 font-mono mt-1 truncate">{transaction.gatewayTransactionId}</div>
                )}
              </div>

              {/* Support Messages */}
              {transaction.customerSupport?.messages && transaction.customerSupport.messages.length > 0 && (
                <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium">
                    💬 {transaction.customerSupport.messages.length} support message(s)
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setShowTransactionDetails(true);
                  }}
                  className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-1 rtl:space-x-reverse"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                {transaction.customerSupport?.status !== 'none' && (
                  <button
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowCustomerSupport(true);
                    }}
                    className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Support</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                <button
                  onClick={() => setShowTransactionDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Transaction Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                        <p className="text-gray-900 font-mono">{selectedTransaction.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <p className="text-gray-900 capitalize">{selectedTransaction.type}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <p className="text-gray-900">{selectedTransaction.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <p className="text-gray-900">{selectedTransaction.paymentMethod}</p>
                      </div>
                      {selectedTransaction.gatewayTransactionId && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Gateway Transaction ID</label>
                          <p className="text-gray-900 font-mono text-sm">{selectedTransaction.gatewayTransactionId}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <p className="text-gray-900 font-semibold">{selectedTransaction.amount} {selectedTransaction.currency}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">USD Equivalent</label>
                        <p className="text-gray-900">${selectedTransaction.usdEquivalent.toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Flixbits Involved</label>
                        <p className="text-gray-900">{selectedTransaction.flixbitsInvolved} FB</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fees</label>
                        <p className="text-gray-900">{selectedTransaction.fees.toFixed(2)} {selectedTransaction.currency}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                          {selectedTransaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="text-gray-900">{selectedTransaction.userName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{selectedTransaction.userEmail}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900">{selectedTransaction.userPhone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="text-gray-900">{selectedTransaction.location.city}, {selectedTransaction.location.country}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Platform</label>
                        <p className="text-gray-900">{selectedTransaction.deviceInfo.platform}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">App Version</label>
                        <p className="text-gray-900">{selectedTransaction.deviceInfo.version}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">IP Address</label>
                        <p className="text-gray-900 font-mono">{selectedTransaction.deviceInfo.ip}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created</label>
                        <p className="text-gray-900">{selectedTransaction.createdAt.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                        <p className="text-gray-900">{selectedTransaction.updatedAt.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Notes */}
                {selectedTransaction.reviewNotes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Notes</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">{selectedTransaction.reviewNotes}</p>
                      {selectedTransaction.reviewedBy && (
                        <p className="text-yellow-600 text-sm mt-2">Reviewed by: {selectedTransaction.reviewedBy}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowTransactionDetails(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  {selectedTransaction.customerSupport?.status !== 'none' && (
                    <button
                      onClick={() => {
                        setShowTransactionDetails(false);
                        setShowCustomerSupport(true);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Customer Support
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Support Modal */}
      {showCustomerSupport && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Customer Support</h2>
                <button
                  onClick={() => setShowCustomerSupport(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Customer: {selectedTransaction.userName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{selectedTransaction.userEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-medium">{selectedTransaction.userPhone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Transaction:</span>
                      <p className="font-medium">{selectedTransaction.id}</p>
                    </div>
                  </div>
                </div>

                {/* Message History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Message History</h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {selectedTransaction.customerSupport?.messages?.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                          message.senderType === 'customer'
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'bg-green-50 border-l-4 border-green-500'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">{message.senderName}</span>
                          <span className="text-sm text-gray-500">{message.timestamp.toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Send Message */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Response</h3>
                  <div className="space-y-4">
                    <textarea
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Type your response to the customer..."
                    />
                    
                    <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                      <button
                        onClick={() => setShowCustomerSupport(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleSendSupportMessage}
                        disabled={!supportMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManager;