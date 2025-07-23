import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTransactionData } from './hooks/useTransactionData';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import { exportTransactions } from './utils/helpers';
import StatisticsCards from './components/StatisticsCards';
import FilterControls from './components/FilterControls';
import TransactionTable from './components/TransactionTable';
import TransactionCards from './components/TransactionCards';
import TransactionDetailsModal from './components/TransactionDetailsModal';
import CustomerSupportModal from './components/CustomerSupportModal';
import { Transaction } from './types';

const TransactionManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const { transactions, updateTransaction, loading } = useTransactionData();
  const { filters, setFilters, filteredTransactions } = useTransactionFilters(transactions);
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showCustomerSupport, setShowCustomerSupport] = useState(false);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleOpenSupport = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCustomerSupport(true);
  };

  const handleExport = () => {
    exportTransactions(filteredTransactions);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">💳 Transaction Management</h1>
        <p className="text-blue-100">Monitor all transactions, handle customer support, and manage financial operations</p>
      </div>

      {/* Summary Statistics */}
      <StatisticsCards transactions={filteredTransactions} />

      {/* Filters and Search */}
      <FilterControls
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
        transactionCount={filteredTransactions.length}
      />

      {/* Transactions Display */}
      {/* Desktop Table View */}
      <div className="hidden xl:block">
        <TransactionTable
          transactions={filteredTransactions}
          onViewTransaction={handleViewTransaction}
          onOpenSupport={handleOpenSupport}
        />
      </div>

      {/* Mobile Card View */}
      <div className="xl:hidden">
        <TransactionCards
          transactions={filteredTransactions}
          onViewTransaction={handleViewTransaction}
          onOpenSupport={handleOpenSupport}
        />
      </div>

      {/* Modals */}
      {showTransactionDetails && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setShowTransactionDetails(false)}
          onOpenSupport={() => {
            setShowTransactionDetails(false);
            setShowCustomerSupport(true);
          }}
        />
      )}

      {showCustomerSupport && selectedTransaction && (
        <CustomerSupportModal
          transaction={selectedTransaction}
          onClose={() => setShowCustomerSupport(false)}
          onUpdateTransaction={updateTransaction}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default TransactionManager;