import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import { formatFlixbits, formatUSD, getTransactionIcon, getTransactionColor } from '../utils/helpers';

const WalletDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  const [showBalance, setShowBalance] = React.useState(true);
  
  const { balance, transactions, stats, loading } = useWallet(user?.id || '');

  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">💰 Your Wallet</h2>
            <p className="text-orange-100">FlixMarket Digital Currency</p>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
          >
            {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-orange-100 text-sm">Total Balance</p>
            <p className="text-4xl font-bold">
              {showBalance ? formatFlixbits(balance.totalFlixbits) : '••••••'}
            </p>
            <p className="text-orange-200 text-lg">
              {showBalance ? formatUSD(balance.usdEquivalent) : '••••••'}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Wallet className="w-4 h-4" />
                <span className="text-sm">Available</span>
              </div>
              <p className="font-bold">
                {showBalance ? formatFlixbits(balance.availableFlixbits) : '••••'}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Pending</span>
              </div>
              <p className="font-bold">
                {showBalance ? formatFlixbits(balance.pendingFlixbits) : '••••'}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Lock className="w-4 h-4" />
                <span className="text-sm">Locked</span>
              </div>
              <p className="font-bold">
                {showBalance ? formatFlixbits(balance.lockedFlixbits) : '••••'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Earned</p>
              <p className="text-2xl font-bold text-green-600">{formatFlixbits(stats.totalEarned)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-red-600">{formatFlixbits(stats.totalSpent)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <ArrowDownLeft className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-2xl font-bold text-blue-600">{formatFlixbits(stats.monthlyEarnings)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Savings Rate</p>
              <p className="text-2xl font-bold text-purple-600">{stats.savingsRate.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="text-2xl">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-500">
                    <span className="capitalize">{transaction.type}</span>
                    <span>•</span>
                    <span>{transaction.createdAt.toLocaleDateString()}</span>
                    <span>•</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right rtl:text-left">
                <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                  {['earn', 'buy', 'reward', 'deposit', 'refund'].includes(transaction.type) ? '+' : '-'}
                  {formatFlixbits(transaction.amount)}
                </p>
                {transaction.usdAmount && (
                  <p className="text-sm text-gray-500">
                    {formatUSD(transaction.usdAmount)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-colors">
            <div className="text-center">
              <ArrowUpRight className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">Buy Flixbits</div>
              <div className="text-sm opacity-90">$0.10 per FB</div>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
            <div className="text-center">
              <ArrowDownLeft className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">Sell Flixbits</div>
              <div className="text-sm opacity-90">$0.08 per FB</div>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors">
            <div className="text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">Send Flixbits</div>
              <div className="text-sm opacity-90">To friends</div>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-colors">
            <div className="text-center">
              <Wallet className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">Redeem Rewards</div>
              <div className="text-sm opacity-90">Exchange for prizes</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;