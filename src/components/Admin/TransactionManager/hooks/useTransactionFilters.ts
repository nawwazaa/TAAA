import { useState, useEffect } from 'react';
import { Transaction, TransactionFilters } from '../types';

export const useTransactionFilters = (transactions: Transaction[]) => {
  const [filters, setFilters] = useState<TransactionFilters>({
    searchQuery: '',
    statusFilter: 'all',
    typeFilter: 'all',
    currencyFilter: 'all',
    dateRange: { start: '', end: '' }
  });

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

  useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(txn => 
        txn.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        txn.userName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        txn.userEmail.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        txn.userPhone.includes(filters.searchQuery) ||
        txn.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (txn.gatewayTransactionId && txn.gatewayTransactionId.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(txn => txn.status === filters.statusFilter);
    }

    // Type filter
    if (filters.typeFilter !== 'all') {
      filtered = filtered.filter(txn => txn.type === filters.typeFilter);
    }

    // Currency filter
    if (filters.currencyFilter !== 'all') {
      filtered = filtered.filter(txn => txn.currency === filters.currencyFilter);
    }

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(txn => 
        txn.createdAt >= startDate && txn.createdAt <= endDate
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  return {
    filters,
    setFilters,
    filteredTransactions
  };
};