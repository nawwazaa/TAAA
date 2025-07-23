import React from 'react';
import { 
  CreditCard, 
  User, 
  DollarSign, 
  TrendingUp, 
  ArrowUpDown, 
  Download, 
  Star, 
  FileText,
  MapPin,
  Eye,
  MessageCircle
} from 'lucide-react';
import { Transaction } from '../types';
import { getStatusColor, getSupportStatusColor } from '../utils/helpers';

interface TransactionCardsProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
  onOpenSupport: (transaction: Transaction) => void;
}

const TransactionCards: React.FC<TransactionCardsProps> = ({
  transactions,
  onViewTransaction,
  onOpenSupport
}) => {
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

  return (
    <div className="space-y-4 p-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          {/* Transaction Header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {getTypeIcon(transaction.type)}
              <div>
                <div className="text-sm font-bold text-gray-900">{transaction.id}</div>
                <div className="text-xs text-gray-500 capitalize">{transaction.type}</div>
              </div>
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
              {transaction.status}
            </span>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-3">
            {/* Customer Info */}
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">{transaction.userName}</div>
              <div className="text-xs text-gray-500">{transaction.userEmail}</div>
              <div className="text-xs text-gray-500">{transaction.userPhone}</div>
            </div>

            {/* Amount and Payment */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold text-gray-900">
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
            <div>
              <div className="text-sm text-gray-700 mb-1">{transaction.description}</div>
              <div className="text-xs text-gray-500">Payment: {transaction.paymentMethod}</div>
              {transaction.gatewayTransactionId && (
                <div className="text-xs text-gray-400 font-mono mt-1 break-all">{transaction.gatewayTransactionId}</div>
              )}
            </div>

            {/* Support Status */}
            {transaction.customerSupport?.status !== 'none' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSupportStatusColor(transaction.customerSupport?.status || 'none')}`}>
                    Support: {transaction.customerSupport?.status}
                  </span>
                  {transaction.customerSupport?.messages && transaction.customerSupport.messages.length > 0 && (
                    <div className="text-xs text-blue-600 font-medium">
                      {transaction.customerSupport.messages.length} message(s)
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 mt-3 border-t border-gray-100">
            <button
              onClick={() => onViewTransaction(transaction)}
              className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </button>
            {transaction.customerSupport?.status !== 'none' && (
              <button
                onClick={() => onOpenSupport(transaction)}
                className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionCards;