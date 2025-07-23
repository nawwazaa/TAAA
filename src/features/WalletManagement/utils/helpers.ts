export const formatFlixbits = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M FB`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K FB`;
  }
  return `${amount.toLocaleString()} FB`;
};

export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const calculateExchangeFees = (amount: number, feePercentage: number, fixedFee: number): number => {
  return (amount * feePercentage / 100) + fixedFee;
};

export const getTransactionIcon = (type: string): string => {
  switch (type) {
    case 'earn': return '💰';
    case 'spend': return '💸';
    case 'buy': return '🛒';
    case 'sell': return '💵';
    case 'transfer': return '↔️';
    case 'reward': return '🎁';
    case 'refund': return '↩️';
    case 'withdrawal': return '📤';
    case 'deposit': return '📥';
    default: return '💳';
  }
};

export const getTransactionColor = (type: string): string => {
  switch (type) {
    case 'earn':
    case 'buy':
    case 'reward':
    case 'deposit':
    case 'refund':
      return 'text-green-600';
    case 'spend':
    case 'sell':
    case 'withdrawal':
      return 'text-red-600';
    case 'transfer':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'qr_scan': return '📱';
    case 'game_prediction': return '🎯';
    case 'referral': return '👥';
    case 'purchase': return '🛍️';
    case 'sale': return '💰';
    case 'contest': return '🏆';
    case 'bonus': return '🎁';
    case 'marketplace': return '🏪';
    case 'exchange': return '💱';
    default: return '💳';
  }
};

export const validateTransactionAmount = (amount: number, type: 'buy' | 'sell', limits: any): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  const dailyLimit = type === 'buy' ? limits.dailyBuyLimit : limits.dailySellLimit;
  const monthlyLimit = type === 'buy' ? limits.monthlyBuyLimit : limits.monthlySellLimit;

  if (amount > dailyLimit) {
    return { isValid: false, error: `Amount exceeds daily limit of ${formatUSD(dailyLimit)}` };
  }

  if (amount > monthlyLimit) {
    return { isValid: false, error: `Amount exceeds monthly limit of ${formatUSD(monthlyLimit)}` };
  }

  return { isValid: true };
};

export const exportTransactions = (transactions: any[], filename: string = 'wallet_transactions') => {
  const csvContent = [
    ['Date', 'Type', 'Category', 'Amount (FB)', 'USD Amount', 'Description', 'Status'].join(','),
    ...transactions.map(txn => [
      txn.createdAt.toLocaleDateString(),
      txn.type,
      txn.category,
      txn.amount,
      txn.usdAmount || '',
      `"${txn.description}"`,
      txn.status
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const generateTransactionId = (): string => {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateSavingsRate = (totalEarned: number, totalSpent: number): number => {
  if (totalEarned === 0) return 0;
  return ((totalEarned - totalSpent) / totalEarned) * 100;
};

export const getSpendingTrend = (transactions: any[]): 'up' | 'down' | 'stable' => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const lastMonthSpending = transactions
    .filter(t => t.createdAt >= lastMonth && t.createdAt < now && t.type === 'spend')
    .reduce((sum, t) => sum + t.amount, 0);

  const previousMonthSpending = transactions
    .filter(t => t.createdAt >= twoMonthsAgo && t.createdAt < lastMonth && t.type === 'spend')
    .reduce((sum, t) => sum + t.amount, 0);

  const change = lastMonthSpending - previousMonthSpending;
  const changePercentage = previousMonthSpending > 0 ? (change / previousMonthSpending) * 100 : 0;

  if (changePercentage > 10) return 'up';
  if (changePercentage < -10) return 'down';
  return 'stable';
};