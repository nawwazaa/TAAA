import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useExchange } from '../hooks/useExchange';
import { useWallet } from '../hooks/useWallet';
import { formatFlixbits, formatUSD, calculateExchangeFees } from '../utils/helpers';

const BuySellFlixbits: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const { exchangeRate, paymentMethods, orders, loading, createBuyOrder, createSellOrder } = useExchange();
  const { balance } = useWallet(user?.id || '');
  
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const defaultPaymentMethod = paymentMethods.find(pm => pm.isDefault);

  React.useEffect(() => {
    if (defaultPaymentMethod && !selectedPaymentMethod) {
      setSelectedPaymentMethod(defaultPaymentMethod.id);
    }
  }, [defaultPaymentMethod, selectedPaymentMethod]);

  const calculateBuyAmount = (usdAmount: number) => {
    const flixbits = usdAmount * exchangeRate.buyRate;
    const paymentMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
    const fees = paymentMethod ? calculateExchangeFees(usdAmount, paymentMethod.fees.buyFeePercentage, paymentMethod.fees.fixedFee) : 0;
    return { flixbits, fees, total: usdAmount + fees };
  };

  const calculateSellAmount = (flixbitsAmount: number) => {
    const usdGross = flixbitsAmount / exchangeRate.sellRate;
    const paymentMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
    const fees = paymentMethod ? calculateExchangeFees(usdGross, paymentMethod.fees.sellFeePercentage, paymentMethod.fees.fixedFee) : 0;
    return { usdGross, fees, netAmount: usdGross - fees };
  };

  const handleBuy = async () => {
    const usdAmount = parseFloat(amount);
    if (!usdAmount || !selectedPaymentMethod) return;

    setIsProcessing(true);
    try {
      const order = await createBuyOrder(usdAmount, selectedPaymentMethod);
      const { flixbits } = calculateBuyAmount(usdAmount);
      
      // Update user's Flixbits balance
      updateUser({
        flixbits: (user?.flixbits || 0) + flixbits
      });

      alert(`✅ Successfully purchased ${formatFlixbits(flixbits)} for ${formatUSD(usdAmount)}!`);
      setAmount('');
    } catch (error) {
      alert('❌ Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSell = async () => {
    const flixbitsAmount = parseFloat(amount);
    if (!flixbitsAmount || !selectedPaymentMethod) return;

    if (flixbitsAmount > balance.availableFlixbits) {
      alert('❌ Insufficient Flixbits balance');
      return;
    }

    setIsProcessing(true);
    try {
      const order = await createSellOrder(flixbitsAmount, selectedPaymentMethod);
      const { netAmount } = calculateSellAmount(flixbitsAmount);
      
      // Update user's Flixbits balance
      updateUser({
        flixbits: (user?.flixbits || 0) - flixbitsAmount
      });

      alert(`✅ Successfully sold ${formatFlixbits(flixbitsAmount)} for ${formatUSD(netAmount)}!`);
      setAmount('');
    } catch (error) {
      alert('❌ Sale failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const buyCalculation = activeTab === 'buy' && amount ? calculateBuyAmount(parseFloat(amount) || 0) : null;
  const sellCalculation = activeTab === 'sell' && amount ? calculateSellAmount(parseFloat(amount) || 0) : null;

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">💱 Buy & Sell Flixbits</h1>
        <p className="text-green-100">Exchange Flixbits with real money at competitive rates</p>
      </div>

      {/* Exchange Rate Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Current Exchange Rates</h3>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {exchangeRate.trend === 'up' ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : exchangeRate.trend === 'down' ? (
              <TrendingDown className="w-5 h-5 text-red-500" />
            ) : (
              <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
            )}
            <span className={`text-sm font-medium ${
              exchangeRate.trend === 'up' ? 'text-green-600' :
              exchangeRate.trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {exchangeRate.dailyChange > 0 ? '+' : ''}{exchangeRate.dailyChange}%
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-green-500 p-2 rounded-lg">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-green-800 font-bold text-lg">Buy Rate</p>
                <p className="text-green-600">{exchangeRate.buyRate} FB per $1 USD</p>
                <p className="text-green-500 text-sm">You get {exchangeRate.buyRate} Flixbits for every $1</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-blue-500 p-2 rounded-lg">
                <ArrowDownLeft className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-blue-800 font-bold text-lg">Sell Rate</p>
                <p className="text-blue-600">${(1/exchangeRate.sellRate).toFixed(3)} per 1 FB</p>
                <p className="text-blue-500 text-sm">You get ${(1/exchangeRate.sellRate).toFixed(3)} for every Flixbit</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">
            Last updated: {exchangeRate.lastUpdated.toLocaleTimeString()} • 
            Rates update every 30 seconds
          </p>
        </div>
      </div>

      {/* Buy/Sell Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'buy'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Buy Flixbits</span>
            </button>
            
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'sell'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Minus className="w-5 h-5" />
              <span className="font-medium">Sell Flixbits</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'buy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Buy Flixbits</h3>
                <p className="text-gray-600 mb-6">Purchase Flixbits using your preferred payment method</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Spend (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                        placeholder="0.00"
                        min="1"
                        max="1000"
                        step="0.01"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">Minimum: $1.00</span>
                      <span className="text-sm text-gray-500">Maximum: $1,000.00</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name} {method.isDefault ? '(Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {buyCalculation && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-bold text-green-800 mb-3">Purchase Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">You will receive:</span>
                          <span className="font-bold text-green-800">{formatFlixbits(buyCalculation.flixbits)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Exchange rate:</span>
                          <span className="text-green-800">{exchangeRate.buyRate} FB per $1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Processing fee:</span>
                          <span className="text-green-800">{formatUSD(buyCalculation.fees)}</span>
                        </div>
                        <div className="border-t border-green-300 pt-2 flex justify-between">
                          <span className="font-bold text-green-800">Total cost:</span>
                          <span className="font-bold text-green-800">{formatUSD(buyCalculation.total)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBuy}
                    disabled={!amount || !selectedPaymentMethod || isProcessing}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-bold text-lg hover:from-green-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `💰 Buy ${amount ? formatFlixbits(calculateBuyAmount(parseFloat(amount) || 0).flixbits) : 'Flixbits'}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sell' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">💵 Sell Flixbits</h3>
                <p className="text-gray-600 mb-6">Convert your Flixbits back to real money</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-blue-800 font-medium">Available Balance</p>
                      <p className="text-blue-600">{formatFlixbits(balance.availableFlixbits)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flixbits to Sell
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-3 pr-20 rtl:pr-3 rtl:pl-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        placeholder="0"
                        min="1"
                        max={balance.availableFlixbits}
                        step="1"
                      />
                      <div className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        FB
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">Minimum: 1 FB</span>
                      <button
                        onClick={() => setAmount(balance.availableFlixbits.toString())}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Use Max: {formatFlixbits(balance.availableFlixbits)}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name} {method.isDefault ? '(Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {sellCalculation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-bold text-blue-800 mb-3">Sale Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Selling:</span>
                          <span className="font-bold text-blue-800">{formatFlixbits(parseFloat(amount) || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Exchange rate:</span>
                          <span className="text-blue-800">${(1/exchangeRate.sellRate).toFixed(3)} per FB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Gross amount:</span>
                          <span className="text-blue-800">{formatUSD(sellCalculation.usdGross)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Processing fee:</span>
                          <span className="text-blue-800">{formatUSD(sellCalculation.fees)}</span>
                        </div>
                        <div className="border-t border-blue-300 pt-2 flex justify-between">
                          <span className="font-bold text-blue-800">You will receive:</span>
                          <span className="font-bold text-blue-800">{formatUSD(sellCalculation.netAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSell}
                    disabled={!amount || !selectedPaymentMethod || isProcessing || parseFloat(amount) > balance.availableFlixbits}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `💵 Sell ${amount ? formatFlixbits(parseFloat(amount) || 0) : 'Flixbits'}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className={`p-2 rounded-lg ${
                    order.type === 'buy' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {order.type === 'buy' ? (
                      <ArrowUpRight className={`w-5 h-5 ${order.type === 'buy' ? 'text-green-600' : 'text-blue-600'}`} />
                    ) : (
                      <ArrowDownLeft className={`w-5 h-5 ${order.type === 'buy' ? 'text-green-600' : 'text-blue-600'}`} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">
                      {order.type} {formatFlixbits(order.flixbitsAmount)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {order.createdAt.toLocaleString()} • {formatUSD(order.usdAmount)}
                    </p>
                  </div>
                </div>
                
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
          Important Information
        </h3>
        <div className="space-y-2 text-yellow-700 text-sm">
          <p>• 💳 <strong>Processing Time:</strong> Buy orders are instant, sell orders take 1-3 business days</p>
          <p>• 💰 <strong>Fees:</strong> Buy fees: 2.9% + $0.30, Sell fees: 3.5% + $0.30</p>
          <p>• 📈 <strong>Rates:</strong> Exchange rates update every 30 seconds based on market conditions</p>
          <p>• 🔒 <strong>Security:</strong> All transactions are encrypted and monitored for fraud</p>
          <p>• 📱 <strong>Limits:</strong> Daily limits apply based on your payment method and verification level</p>
        </div>
      </div>
    </div>
  );
};

export default BuySellFlixbits;