import React from 'react';
import { Search, Download } from 'lucide-react';
import { TransactionFilters } from '../types';

interface FilterControlsProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onExport: () => void;
  transactionCount: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  onExport,
  transactionCount
}) => {
  const updateFilter = (key: keyof TransactionFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const updateDateRange = (key: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [key]: value
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Search by transaction ID, user name, email, phone, or description..."
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <select
            value={filters.statusFilter}
            onChange={(e) => updateFilter('statusFilter', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="completed">✅ Completed</option>
            <option value="failed">❌ Failed</option>
            <option value="cancelled">🚫 Cancelled</option>
            <option value="refunded">🔄 Refunded</option>
          </select>

          <select
            value={filters.typeFilter}
            onChange={(e) => updateFilter('typeFilter', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Types</option>
            <option value="purchase">🛒 Purchase</option>
            <option value="sale">💰 Sale</option>
            <option value="refund">↩️ Refund</option>
            <option value="withdrawal">📤 Withdrawal</option>
            <option value="deposit">📥 Deposit</option>
            <option value="reward">🎁 Reward</option>
            <option value="subscription">📋 Subscription</option>
          </select>

          <select
            value={filters.currencyFilter}
            onChange={(e) => updateFilter('currencyFilter', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Currencies</option>
            <option value="FB">🪙 Flixbits</option>
            <option value="SAR">🇸🇦 SAR</option>
            <option value="AED">🇦🇪 AED</option>
            <option value="USD">🇺🇸 USD</option>
            <option value="EUR">🇪🇺 EUR</option>
          </select>

          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => updateDateRange('start', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => updateDateRange('end', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="End Date"
          />

          <button
            onClick={onExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {transactionCount > 0 && (
          <div className="text-sm text-gray-600 text-center">
            Showing {transactionCount} transactions
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls;