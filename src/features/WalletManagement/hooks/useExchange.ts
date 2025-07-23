import { useState, useEffect } from 'react';
import { ExchangeRate, ExchangeOrder, PaymentMethod } from '../types';

export const useExchange = () => {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    buyRate: 10.0, // 10 Flixbits per USD
    sellRate: 8.0, // $0.125 per Flixbit (8 Flixbits per USD)
    lastUpdated: new Date(),
    trend: 'stable',
    dailyChange: 0.5
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'card_001',
      type: 'credit_card',
      name: 'Visa **** 1234',
      lastFour: '1234',
      expiryDate: '12/26',
      isDefault: true,
      isActive: true,
      fees: {
        buyFeePercentage: 2.9,
        sellFeePercentage: 3.5,
        fixedFee: 0.30
      },
      limits: {
        dailyBuyLimit: 1000,
        dailySellLimit: 500,
        monthlyBuyLimit: 10000,
        monthlySellLimit: 5000
      },
      supportedCountries: ['US', 'AE', 'SA', 'QA', 'KW']
    },
    {
      id: 'paypal_001',
      type: 'paypal',
      name: 'PayPal Account',
      isDefault: false,
      isActive: true,
      fees: {
        buyFeePercentage: 3.4,
        sellFeePercentage: 3.9,
        fixedFee: 0.30
      },
      limits: {
        dailyBuyLimit: 2000,
        dailySellLimit: 1000,
        monthlyBuyLimit: 20000,
        monthlySellLimit: 10000
      },
      supportedCountries: ['US', 'AE', 'SA', 'QA', 'KW', 'BH', 'OM']
    }
  ]);

  const [orders, setOrders] = useState<ExchangeOrder[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate real-time rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRate(prev => {
        const change = (Math.random() - 0.5) * 0.1; // ±5% change
        const newBuyRate = Math.max(8, Math.min(12, prev.buyRate + change));
        const newSellRate = newBuyRate * 0.8; // 20% spread
        
        return {
          ...prev,
          buyRate: Number(newBuyRate.toFixed(2)),
          sellRate: Number(newSellRate.toFixed(2)),
          lastUpdated: new Date(),
          trend: change > 0.05 ? 'up' : change < -0.05 ? 'down' : 'stable',
          dailyChange: Number(((change / prev.buyRate) * 100).toFixed(2))
        };
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const createBuyOrder = async (usdAmount: number, paymentMethodId: string): Promise<ExchangeOrder> => {
    setLoading(true);
    
    try {
      const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      const flixbitsAmount = usdAmount * exchangeRate.buyRate;
      const fees = (usdAmount * paymentMethod.fees.buyFeePercentage / 100) + paymentMethod.fees.fixedFee;
      const netAmount = flixbitsAmount;

      const order: ExchangeOrder = {
        id: `buy_${Date.now()}`,
        userId: 'current_user',
        type: 'buy',
        flixbitsAmount,
        usdAmount,
        exchangeRate: exchangeRate.buyRate,
        fees,
        netAmount,
        paymentMethodId,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      };

      // Simulate payment processing
      setTimeout(() => {
        setOrders(prev => 
          prev.map(o => 
            o.id === order.id 
              ? { ...o, status: 'completed', completedAt: new Date() }
              : o
          )
        );
      }, 3000);

      setOrders(prev => [order, ...prev]);
      return order;

    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createSellOrder = async (flixbitsAmount: number, paymentMethodId: string): Promise<ExchangeOrder> => {
    setLoading(true);
    
    try {
      const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      const usdAmount = flixbitsAmount / exchangeRate.sellRate;
      const fees = (usdAmount * paymentMethod.fees.sellFeePercentage / 100) + paymentMethod.fees.fixedFee;
      const netAmount = usdAmount - fees;

      const order: ExchangeOrder = {
        id: `sell_${Date.now()}`,
        userId: 'current_user',
        type: 'sell',
        flixbitsAmount,
        usdAmount: netAmount,
        exchangeRate: exchangeRate.sellRate,
        fees,
        netAmount,
        paymentMethodId,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      };

      // Simulate payment processing
      setTimeout(() => {
        setOrders(prev => 
          prev.map(o => 
            o.id === order.id 
              ? { ...o, status: 'completed', completedAt: new Date() }
              : o
          )
        );
      }, 3000);

      setOrders(prev => [order, ...prev]);
      return order;

    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm_${Date.now()}`
    };
    setPaymentMethods(prev => [...prev, newMethod]);
    return newMethod;
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(pm => ({ ...pm, isDefault: pm.id === id }))
    );
  };

  return {
    exchangeRate,
    paymentMethods,
    orders,
    loading,
    createBuyOrder,
    createSellOrder,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod
  };
};