import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CreditCard, 
  DollarSign, 
  Settings, 
  Key, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Globe, 
  Smartphone,
  Wallet,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TapPaymentConfig {
  apiKey: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
  webhookUrl: string;
  supportedCurrencies: string[];
  supportedCountries: string[];
  isActive: boolean;
  lastUpdated: Date;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'wallet' | 'bank' | 'crypto';
  icon: string;
  isEnabled: boolean;
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  countries: string[];
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  description: string;
  createdAt: Date;
  tapTransactionId: string;
  fees: number;
}

const TapPaymentGateway: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'config' | 'methods' | 'transactions' | 'analytics' | 'webhooks'>('config');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');

  // Tap Payment Configuration
  const [tapConfig, setTapConfig] = useState<TapPaymentConfig>({
    apiKey: 'sk_test_XKokBfNWv6FIYuTMg5sLPjhJ',
    secretKey: 'sk_live_XKokBfNWv6FIYuTMg5sLPjhJ_HIDDEN',
    environment: 'sandbox',
    webhookUrl: 'https://flixmarket.com/api/webhooks/tap',
    supportedCurrencies: ['SAR', 'AED', 'USD', 'EUR'],
    supportedCountries: ['SA', 'AE', 'QA', 'KW', 'BH', 'OM'],
    isActive: true,
    lastUpdated: new Date()
  });

  // Supported Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'visa',
      name: 'Visa',
      type: 'card',
      icon: '💳',
      isEnabled: true,
      fees: { percentage: 2.9, fixed: 0, currency: 'SAR' },
      countries: ['SA', 'AE', 'QA', 'KW']
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      type: 'card',
      icon: '💳',
      isEnabled: true,
      fees: { percentage: 2.9, fixed: 0, currency: 'SAR' },
      countries: ['SA', 'AE', 'QA', 'KW']
    },
    {
      id: 'mada',
      name: 'Mada',
      type: 'card',
      icon: '🏧',
      isEnabled: true,
      fees: { percentage: 1.75, fixed: 0, currency: 'SAR' },
      countries: ['SA']
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      type: 'wallet',
      icon: '🍎',
      isEnabled: true,
      fees: { percentage: 2.9, fixed: 0, currency: 'SAR' },
      countries: ['SA', 'AE', 'QA', 'KW']
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      type: 'wallet',
      icon: '🔍',
      isEnabled: true,
      fees: { percentage: 2.9, fixed: 0, currency: 'SAR' },
      countries: ['SA', 'AE', 'QA', 'KW']
    },
    {
      id: 'stc_pay',
      name: 'STC Pay',
      type: 'wallet',
      icon: '📱',
      isEnabled: true,
      fees: { percentage: 2.5, fixed: 0, currency: 'SAR' },
      countries: ['SA']
    },
    {
      id: 'urpay',
      name: 'urpay',
      type: 'wallet',
      icon: '💰',
      isEnabled: true,
      fees: { percentage: 2.5, fixed: 0, currency: 'AED' },
      countries: ['AE']
    },
    {
      id: 'benefit',
      name: 'Benefit',
      type: 'bank',
      icon: '🏦',
      isEnabled: true,
      fees: { percentage: 1.5, fixed: 0, currency: 'BHD' },
      countries: ['BH']
    }
  ]);

  // Sample Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn_001',
      amount: 150.00,
      currency: 'SAR',
      status: 'completed',
      paymentMethod: 'Mada',
      customerName: 'Ahmed Hassan',
      customerEmail: 'ahmed@email.com',
      description: 'FlixMarket Purchase - Pizza Offer',
      createdAt: new Date('2024-01-20T14:30:00'),
      tapTransactionId: 'chg_TS02A5720231433Qs1w0809820',
      fees: 2.63
    },
    {
      id: 'txn_002',
      amount: 75.50,
      currency: 'AED',
      status: 'completed',
      paymentMethod: 'Visa',
      customerName: 'Sarah Al-Zahra',
      customerEmail: 'sarah@email.com',
      description: 'FlixMarket Purchase - Fashion Item',
      createdAt: new Date('2024-01-20T16:45:00'),
      tapTransactionId: 'chg_TS02A5720231433Qs1w0809821',
      fees: 2.19
    },
    {
      id: 'txn_003',
      amount: 200.00,
      currency: 'SAR',
      status: 'pending',
      paymentMethod: 'STC Pay',
      customerName: 'Mohammed Ali',
      customerEmail: 'mohammed@email.com',
      description: 'FlixMarket Purchase - Electronics',
      createdAt: new Date('2024-01-20T18:15:00'),
      tapTransactionId: 'chg_TS02A5720231433Qs1w0809822',
      fees: 5.00
    }
  ]);

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('testing');
    
    // Simulate API call to Tap
    setTimeout(() => {
      // In real implementation, this would make actual API call to Tap
      const isValid = tapConfig.apiKey && tapConfig.secretKey;
      setConnectionStatus(isValid ? 'connected' : 'disconnected');
      setIsTestingConnection(false);
      
      if (isValid) {
        alert('✅ Successfully connected to Tap Payment Gateway!');
      } else {
        alert('❌ Failed to connect. Please check your API credentials.');
      }
    }, 2000);
  };

  const updateTapConfig = (field: keyof TapPaymentConfig, value: any) => {
    setTapConfig(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date()
    }));
  };

  const togglePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === methodId 
          ? { ...method, isEnabled: !method.isEnabled }
          : method
      )
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      case 'testing': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'disconnected': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'testing': return <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">💳 Tap Payment Gateway</h1>
            <p className="text-green-100">Integrate Tap Payments for Saudi Arabia and GCC region</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              {getConnectionStatusIcon()}
              <span className={`font-medium ${getConnectionStatusColor()}`}>
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'testing' ? 'Testing...' : 'Disconnected'}
              </span>
            </div>
            <a 
              href="https://www.tap.company/en-sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-100 hover:text-white flex items-center space-x-1 rtl:space-x-reverse"
            >
              <span>Visit Tap.company</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'config'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Configuration</span>
            </button>
            
            <button
              onClick={() => setActiveTab('methods')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'methods'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Payment Methods</span>
            </button>
            
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'transactions'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Transactions</span>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Analytics</span>
            </button>
            
            <button
              onClick={() => setActiveTab('webhooks')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'webhooks'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Webhooks</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Tap Payment Configuration</h2>
                <button
                  onClick={testConnection}
                  disabled={isTestingConnection}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <RefreshCw className={`w-5 h-5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                  <span>{isTestingConnection ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* API Configuration */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                    API Credentials
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                      <select
                        value={tapConfig.environment}
                        onChange={(e) => updateTapConfig('environment', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="sandbox">🧪 Sandbox (Testing)</option>
                        <option value="production">🚀 Production (Live)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={tapConfig.apiKey}
                          onChange={(e) => updateTapConfig('apiKey', e.target.value)}
                          className="w-full px-3 py-2 pr-20 rtl:pr-3 rtl:pl-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                          placeholder="sk_test_..."
                        />
                        <div className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 flex space-x-1 rtl:space-x-reverse">
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(tapConfig.apiKey)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                      <div className="relative">
                        <input
                          type={showSecretKey ? 'text' : 'password'}
                          value={tapConfig.secretKey}
                          onChange={(e) => updateTapConfig('secretKey', e.target.value)}
                          className="w-full px-3 py-2 pr-20 rtl:pr-3 rtl:pl-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                          placeholder="sk_live_..."
                        />
                        <div className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 flex space-x-1 rtl:space-x-reverse">
                          <button
                            type="button"
                            onClick={() => setShowSecretKey(!showSecretKey)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(tapConfig.secretKey)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={tapConfig.webhookUrl}
                          onChange={(e) => updateTapConfig('webhookUrl', e.target.value)}
                          className="w-full px-3 py-2 pr-10 rtl:pr-3 rtl:pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="https://your-domain.com/webhooks/tap"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(tapConfig.webhookUrl)}
                          className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regional Settings */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                    Regional Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supported Currencies</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['SAR', 'AED', 'USD', 'EUR', 'QAR', 'KWD', 'BHD', 'OMR'].map((currency) => (
                          <label key={currency} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={tapConfig.supportedCurrencies.includes(currency)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateTapConfig('supportedCurrencies', [...tapConfig.supportedCurrencies, currency]);
                                } else {
                                  updateTapConfig('supportedCurrencies', tapConfig.supportedCurrencies.filter(c => c !== currency));
                                }
                              }}
                              className="mr-2 rtl:mr-0 rtl:ml-2"
                            />
                            <span className="text-sm">{currency}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supported Countries</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { code: 'SA', name: '🇸🇦 Saudi Arabia' },
                          { code: 'AE', name: '🇦🇪 UAE' },
                          { code: 'QA', name: '🇶🇦 Qatar' },
                          { code: 'KW', name: '🇰🇼 Kuwait' },
                          { code: 'BH', name: '🇧🇭 Bahrain' },
                          { code: 'OM', name: '🇴🇲 Oman' }
                        ].map((country) => (
                          <label key={country.code} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={tapConfig.supportedCountries.includes(country.code)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateTapConfig('supportedCountries', [...tapConfig.supportedCountries, country.code]);
                                } else {
                                  updateTapConfig('supportedCountries', tapConfig.supportedCountries.filter(c => c !== country.code));
                                }
                              }}
                              className="mr-2 rtl:mr-0 rtl:ml-2"
                            />
                            <span className="text-sm">{country.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable Tap Payments</span>
                      <input
                        type="checkbox"
                        checked={tapConfig.isActive}
                        onChange={(e) => updateTapConfig('isActive', e.target.checked)}
                        className="toggle"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Guide */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">🚀 Integration Guide</h3>
                <div className="space-y-3 text-blue-800">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <p>Create account at <a href="https://www.tap.company/en-sa" target="_blank" className="underline">tap.company</a> and get your API keys</p>
                  </div>
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <p>Enter your API Key and Secret Key in the configuration above</p>
                  </div>
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <p>Configure webhook URL in your Tap dashboard for real-time notifications</p>
                  </div>
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <p>Test the connection and enable payment methods for your region</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'methods' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{method.type}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={method.isEnabled}
                        onChange={() => togglePaymentMethod(method.id)}
                        className="toggle"
                      />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee:</span>
                        <span className="font-medium">{method.fees.percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fixed Fee:</span>
                        <span className="font-medium">{method.fees.fixed} {method.fees.currency}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Countries:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {method.countries.map((country) => (
                            <span key={country} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                              <div className="text-sm text-gray-500 font-mono">{transaction.tapTransactionId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{transaction.customerName}</div>
                              <div className="text-sm text-gray-500">{transaction.customerEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.amount.toFixed(2)} {transaction.currency}
                            </div>
                            <div className="text-sm text-gray-500">Fee: {transaction.fees.toFixed(2)} {transaction.currency}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.createdAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <button className="text-blue-600 hover:text-blue-900">View</button>
                              <button className="text-green-600 hover:text-green-900">Refund</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Payment Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">425.50 SAR</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Transactions</p>
                      <p className="text-3xl font-bold text-gray-900">156</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Success Rate</p>
                      <p className="text-3xl font-bold text-gray-900">98.7%</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Fees</p>
                      <p className="text-3xl font-bold text-gray-900">9.82 SAR</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Webhooks Tab */}
          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Webhook Configuration</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-4">⚠️ Important Webhook Setup</h3>
                <div className="space-y-3 text-yellow-800">
                  <p>Configure these webhook URLs in your Tap dashboard:</p>
                  <div className="bg-white rounded-lg p-4 font-mono text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span>Payment Success:</span>
                      <button onClick={() => copyToClipboard('https://flixmarket.com/api/webhooks/tap/success')}>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <code className="text-green-600">https://flixmarket.com/api/webhooks/tap/success</code>
                  </div>
                  <div className="bg-white rounded-lg p-4 font-mono text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span>Payment Failed:</span>
                      <button onClick={() => copyToClipboard('https://flixmarket.com/api/webhooks/tap/failed')}>
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <code className="text-red-600">https://flixmarket.com/api/webhooks/tap/failed</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TapPaymentGateway;