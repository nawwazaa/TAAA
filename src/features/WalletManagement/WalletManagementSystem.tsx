import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Wallet, 
  ArrowUpDown, 
  Gift, 
  History, 
  Settings,
  CreditCard,
  TrendingUp,
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WalletDashboard from './components/WalletDashboard';
import BuySellFlixbits from './components/BuySellFlixbits';
import RewardsCenter from './components/RewardsCenter';
import TransactionHistory from './components/TransactionHistory';

const WalletManagementSystem: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exchange' | 'rewards' | 'history' | 'settings'>('dashboard');

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">💰 Wallet Management</h1>
        <p className="text-orange-100">Complete Flixbits wallet with buy/sell, rewards, and transaction tracking</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveTab('exchange')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'exchange'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ArrowUpDown className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Buy & Sell</span>
            </button>
            
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'rewards'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Rewards</span>
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <History className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">History</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && <WalletDashboard />}
          {activeTab === 'exchange' && <BuySellFlixbits />}
          {activeTab === 'rewards' && <RewardsCenter />}
          {activeTab === 'history' && <TransactionHistory />}
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">⚙️ Wallet Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Two-Factor Authentication</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Transaction Notifications</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Email Confirmations</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Hide Balance</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Public Transaction History</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Allow Friend Requests</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <CreditCard className="w-6 h-6 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">Visa **** 1234</p>
                        <p className="text-sm text-gray-500">Expires 12/26 • Default</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                      <div>
                        <p className="font-medium text-gray-900">PayPal Account</p>
                        <p className="text-sm text-gray-500">user@email.com</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  </div>
                  
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                    + Add Payment Method
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Features */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-800 mb-4">🚀 Wallet Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-orange-900 flex items-center">
              <Wallet className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              Digital Wallet
            </h4>
            <ul className="text-orange-700 text-sm space-y-1">
              <li>• Secure Flixbits storage</li>
              <li>• Real-time balance updates</li>
              <li>• Multi-currency support</li>
              <li>• Instant transactions</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-orange-900 flex items-center">
              <ArrowUpDown className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              Exchange System
            </h4>
            <ul className="text-orange-700 text-sm space-y-1">
              <li>• Buy/sell Flixbits</li>
              <li>• Real-time exchange rates</li>
              <li>• Multiple payment methods</li>
              <li>• Low transaction fees</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-orange-900 flex items-center">
              <Gift className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              Rewards System
            </h4>
            <ul className="text-orange-700 text-sm space-y-1">
              <li>• Premium rewards catalog</li>
              <li>• Physical & digital items</li>
              <li>• Sponsor partnerships</li>
              <li>• Instant claim codes</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-orange-900 flex items-center">
              <History className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              Transaction Tracking
            </h4>
            <ul className="text-orange-700 text-sm space-y-1">
              <li>• Complete transaction history</li>
              <li>• Advanced filtering</li>
              <li>• Export capabilities</li>
              <li>• Real-time notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletManagementSystem;