import { useState, useEffect } from 'react';
import { WalletTransaction, WalletBalance, WalletStats } from '../types';
import { generateSampleTransactions } from '../utils/sampleData';

export const useWallet = (userId: string) => {
  const [balance, setBalance] = useState<WalletBalance>({
    totalFlixbits: 1250,
    availableFlixbits: 1150,
    pendingFlixbits: 100,
    lockedFlixbits: 0,
    usdEquivalent: 125.0,
    lastUpdated: new Date()
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [stats, setStats] = useState<WalletStats>({
    totalEarned: 2500,
    totalSpent: 1250,
    totalBought: 1000,
    totalSold: 500,
    averageTransactionSize: 85,
    transactionCount: 47,
    favoriteCategory: 'qr_scan',
    monthlyEarnings: 450,
    monthlySpending: 320,
    savingsRate: 28.9
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWalletData = async () => {
      setLoading(true);
      try {
        // In real app, this would be API calls
        const sampleTransactions = generateSampleTransactions(userId);
        setTransactions(sampleTransactions);
        
        // Calculate balance from transactions
        const totalEarned = sampleTransactions
          .filter(t => ['earn', 'buy', 'reward', 'deposit'].includes(t.type) && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalSpent = sampleTransactions
          .filter(t => ['spend', 'sell', 'transfer', 'withdrawal'].includes(t.type) && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0);

        const pending = sampleTransactions
          .filter(t => t.status === 'pending')
          .reduce((sum, t) => sum + (t.type === 'earn' ? t.amount : -t.amount), 0);

        setBalance(prev => ({
          ...prev,
          totalFlixbits: totalEarned - totalSpent,
          availableFlixbits: totalEarned - totalSpent - pending,
          pendingFlixbits: Math.max(pending, 0),
          usdEquivalent: (totalEarned - totalSpent) * 0.1
        }));

      } catch (error) {
        console.error('Error loading wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, [userId]);

  const addTransaction = (transaction: Omit<WalletTransaction, 'id' | 'createdAt'>) => {
    const newTransaction: WalletTransaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Update balance if transaction is completed
    if (newTransaction.status === 'completed') {
      setBalance(prev => {
        const change = ['earn', 'buy', 'reward', 'deposit'].includes(newTransaction.type) 
          ? newTransaction.amount 
          : -newTransaction.amount;
        
        const newTotal = prev.totalFlixbits + change;
        return {
          ...prev,
          totalFlixbits: newTotal,
          availableFlixbits: newTotal - prev.pendingFlixbits,
          usdEquivalent: newTotal * 0.1,
          lastUpdated: new Date()
        };
      });
    }

    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<WalletTransaction>) => {
    setTransactions(prev => 
      prev.map(txn => 
        txn.id === id ? { ...txn, ...updates } : txn
      )
    );
  };

  const getTransactionsByCategory = (category: string) => {
    return transactions.filter(txn => txn.category === category);
  };

  const getTransactionsByType = (type: string) => {
    return transactions.filter(txn => txn.type === type);
  };

  const getMonthlyTransactions = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return transactions.filter(txn => txn.createdAt >= startOfMonth);
  };

  return {
    balance,
    transactions,
    stats,
    loading,
    addTransaction,
    updateTransaction,
    getTransactionsByCategory,
    getTransactionsByType,
    getMonthlyTransactions
  };
};