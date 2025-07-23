import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { generateSampleTransactions } from '../utils/sampleData';

export const useTransactionData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadTransactions = async () => {
      setLoading(true);
      try {
        // In real app, this would be an API call
        const sampleData = generateSampleTransactions();
        setTransactions(sampleData);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(txn => 
        txn.id === id ? { ...txn, ...updates } : txn
      )
    );
  };

  return {
    transactions,
    setTransactions,
    updateTransaction,
    loading
  };
};