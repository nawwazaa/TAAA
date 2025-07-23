import React from 'react';
import { 
  CreditCard, 
  User, 
  DollarSign, 
  CheckCircle, 
  MessageCircle, 
  Calendar, 
  Settings,
  Eye,
  TrendingUp,
  ArrowUpDown,
  Download,
  Star,
  FileText,
  MapPin
} from 'lucide-react';
import { Transaction } from '../types';
import { getStatusColor, getSupportStatusColor } from '../utils/helpers';

interface TransactionTableProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
  onOpenSupport: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Transaction Records</h3>
          <div className="text-sm text-gray-600">
            Showing {transactions.length} transactions
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span>Transaction Details</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-green-500" />
                  <span>Customer Information</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-purple-500" />
                  <span>Financial Details</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-orange-500" />
                  <span>Status</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-red-500" />
                  <span>Support</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  <span>Date & Time</span>
                </div>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                <div className="flex items-center justify-center space-x-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(transaction.type)}
                    <div>
                      <div className="text-sm font-bold text-gray-900">{transaction.id}</div>
                      <div className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full inline-block">
                        {transaction.type}
                      </div>
                      {transaction.gatewayTransactionId && (
                        <div className="text-xs text-gray-400 font-mono mt-1 truncate max-w-[150px]">
                          {transaction.gatewayTransactionId}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                      {transaction.userName}
                    </div>
                    <div className="text-xs text-gray-600 truncate max-w-[200px]">
                      {transaction.userEmail}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {transaction.userPhone}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {transaction.location.city}, {transaction.location.country}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-gray-900">
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      ${transaction.usdEquivalent.toFixed(2)} USD
                    </div>
                    <div className="text-xs text-blue-600">
                      {transaction.flixbitsInvolved} Flixbits
                    </div>
                    {transaction.fees !== 0 && (
                      <div className="text-xs text-orange-600">
                        Fee: {transaction.fees > 0 ? '+' : ''}{transaction.fees.toFixed(2)} {transaction.currency}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {transaction.paymentMethod}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                    <div className="text-xs text-gray-500">
                      {transaction.deviceInfo.platform} • {transaction.deviceInfo.version}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getSupportStatusColor(transaction.customerSupport?.status || 'none')}`}>
                      {transaction.customerSupport?.status || 'none'}
                    </span>
                    {transaction.customerSupport?.messages && transaction.customerSupport.messages.length > 0 && (
                      <div className="text-xs text-blue-600 font-medium">
                        {transaction.customerSupport.messages.length} message(s)
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.createdAt.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.createdAt.toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      Updated: {transaction.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => onViewTransaction(transaction)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    {transaction.customerSupport?.status !== 'none' && (
                      <button
                        onClick={() => onOpenSupport(transaction)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;