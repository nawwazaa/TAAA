import React from 'react';
import { BarChart3, DollarSign, Clock, MessageCircle } from 'lucide-react';
import { Transaction } from '../types';

interface StatisticsCardsProps {
  transactions: Transaction[];
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ transactions }) => {
  const totalTransactions = transactions.length;
  const totalRevenue = transactions
    .filter(txn => txn.status === 'completed' && (txn.type === 'purchase' || txn.type === 'subscription'))
    .reduce((sum, txn) => sum + txn.usdEquivalent, 0);
  const pendingTransactions = transactions.filter(txn => txn.status === 'pending').length;
  const supportTickets = transactions.filter(txn => 
    txn.customerSupport?.status === 'pending' || txn.customerSupport?.status === 'responded'
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
};

export default StatisticsCards;