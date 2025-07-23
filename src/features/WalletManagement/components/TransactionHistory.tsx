import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import { WalletFilters } from '../types';
import { 
  formatFlixbits, 
  formatUSD, 
  getTransactionIcon, 
  getTransactionColor, 
  getCategoryIcon,
  exportTransactions 
} from '../utils/helpers';

const TransactionHistory: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const { transactions, loading } = useWallet(user?.id || '');
  
  const [filters, setFilters] = useState<WalletFilters>({
    dateRange: { start: '', end: '' },
    transactionType: 'all',
    category: 'all',
    status: 'all',
    amountRange: { min: 0, max: 0 },
    searchQuery: ''
  });

  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = transaction.description.toLowerCase().includes(query) ||
                           transaction.id.toLowerCase().includes(query) ||
                           (transaction.fromUserName && transaction.fromUserName.toLowerCase().includes(query)) ||
                           (transaction.toUserName && transaction.toUserName.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.transactionType !== 'all' && transaction.type !== filters.transactionType) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && transaction.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      if (transaction.createdAt < startDate || transaction.createdAt > endDate) {
        return false;
      }
    }

    // Amount range filter
    if (filters.amountRange.max > 0) {
      if (transaction.amount < filters.amountRange.min || transaction.amount > filters.amountRange.max) {
        return false;
      }
    }

    return true;
  });

  const updateFilter = (key: keyof WalletFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateDateRange = (key: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [key]: value }
    }));
  };

  const updateAmountRange = (key: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      amountRange: { ...prev.amountRange, [key]: value }
    }));
  };

  const handleExport = () => {
    exportTransactions(filteredTransactions, 'wallet_transactions');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">📊 Transaction History</h1>
        <p className="text-blue-100">Complete record of all your Flixbits transactions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <select
              value={filters.transactionType}
              onChange={(e) => updateFilter('transactionType', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              <option value="earn">💰 Earn</option>
              <option value="spend">💸 Spend</option>
              <option value="buy">🛒 Buy</option>
              <option value="sell">💵 Sell</option>
              <option value="transfer">↔️ Transfer</option>
              <option value="reward">🎁 Reward</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Categories</option>
              <option value="qr_scan">📱 QR Scan</option>
              <option value="game_prediction">🎯 Game Prediction</option>
              <option value="referral">👥 Referral</option>
              <option value="purchase">🛍️ Purchase</option>
              <option value="sale">💰 Sale</option>
              <option value="contest">🏆 Contest</option>
              <option value="bonus">🎁 Bonus</option>
              <option value="marketplace">🏪 Marketplace</option>
              <option value="exchange">💱 Exchange</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">✅ Completed</option>
              <option value="pending">⏳ Pending</option>
              <option value="failed">❌ Failed</option>
              <option value="cancelled">🚫 Cancelled</option>
            </select>

            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => updateDateRange('start', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Start Date"
            />

            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => updateDateRange('end', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="End Date"
            />

            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Amount Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount (FB)</label>
              <input
                type="number"
                value={filters.amountRange.min || ''}
                onChange={(e) => updateAmountRange('min', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount (FB)</label>
              <input
                type="number"
                value={filters.amountRange.max || ''}
                onChange={(e) => updateAmountRange('max', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="No limit"
                min="0"
              />
            </div>
          </div>

          {filteredTransactions.length > 0 && (
            <div className="text-sm text-gray-600 text-center">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="text-2xl">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-gray-500">
                          <span className="capitalize">{transaction.type}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1 rtl:space-x-reverse">
                            <span>{getCategoryIcon(transaction.category)}</span>
                            <span className="capitalize">{transaction.category.replace('_', ' ')}</span>
                          </span>
                        </div>
                        {transaction.id && (
                          <div className="text-xs text-gray-400 font-mono">{transaction.id}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                        {['earn', 'buy', 'reward', 'deposit', 'refund'].includes(transaction.type) ? '+' : '-'}
                        {formatFlixbits(transaction.amount)}
                      </div>
                      {transaction.usdAmount && (
                        <div className="text-sm text-gray-500">
                          {formatUSD(transaction.usdAmount)}
                        </div>
                      )}
                      {transaction.fees && transaction.fees > 0 && (
                        <div className="text-xs text-orange-600">
                          Fee: {transaction.fees} FB
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {getStatusIcon(transaction.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{transaction.createdAt.toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{transaction.createdAt.toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedTransaction(transaction.id);
                        setShowTransactionDetails(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-4 space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="text-xl">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{transaction.description}</div>
                    <div className="text-xs text-gray-500 capitalize">{transaction.type} • {transaction.category.replace('_', ' ')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  {getStatusIcon(transaction.status)}
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                    {['earn', 'buy', 'reward', 'deposit', 'refund'].includes(transaction.type) ? '+' : '-'}
                    {formatFlixbits(transaction.amount)}
                  </div>
                  {transaction.usdAmount && (
                    <div className="text-sm text-gray-500">{formatUSD(transaction.usdAmount)}</div>
                  )}
                </div>
                <div className="text-right rtl:text-left">
                  <div className="text-sm text-gray-900">{transaction.createdAt.toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{transaction.createdAt.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {(() => {
              const transaction = transactions.find(t => t.id === selectedTransaction);
              if (!transaction) return null;
              
              return (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                    <button
                      onClick={() => setShowTransactionDetails(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{getTransactionIcon(transaction.type)}</div>
                      <h3 className="text-lg font-bold text-gray-900">{transaction.description}</h3>
                      <p className={`text-2xl font-bold ${getTransactionColor(transaction.type)}`}>
                        {['earn', 'buy', 'reward', 'deposit', 'refund'].includes(transaction.type) ? '+' : '-'}
                        {formatFlixbits(transaction.amount)}
                      </p>
                      {transaction.usdAmount && (
                        <p className="text-gray-600">{formatUSD(transaction.usdAmount)}</p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-sm">{transaction.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="capitalize">{transaction.category.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span>{transaction.createdAt.toLocaleString()}</span>
                      </div>
                      {transaction.completedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed:</span>
                          <span>{transaction.completedAt.toLocaleString()}</span>
                        </div>
                      )}
                      {transaction.paymentMethod && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span>{transaction.paymentMethod}</span>
                        </div>
                      )}
                      {transaction.fees && transaction.fees > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fees:</span>
                          <span className="text-orange-600">{transaction.fees} FB</span>
                        </div>
                      )}
                      {transaction.fromUserName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">From:</span>
                          <span>{transaction.fromUserName}</span>
                        </div>
                      )}
                      {transaction.toUserName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">To:</span>
                          <span>{transaction.toUserName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-6">
                    <button
                      onClick={() => setShowTransactionDetails(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Close
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

export default TransactionHistory;