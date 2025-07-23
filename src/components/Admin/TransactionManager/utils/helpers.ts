export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    case 'refunded': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getSupportStatusColor = (status: string) => {
  switch (status) {
    case 'none': return 'bg-gray-100 text-gray-800';
    case 'pending': return 'bg-red-100 text-red-800';
    case 'responded': return 'bg-blue-100 text-blue-800';
    case 'resolved': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const exportTransactions = (transactions: any[]) => {
  const csvContent = [
    ['Transaction ID', 'Type', 'Amount', 'Currency', 'Status', 'User Name', 'Email', 'Phone', 'Description', 'Payment Method', 'Date'].join(','),
    ...transactions.map(txn => [
      txn.id,
      txn.type,
      txn.amount,
      txn.currency,
      txn.status,
      txn.userName,
      txn.userEmail,
      txn.userPhone,
      txn.description,
      txn.paymentMethod,
      txn.createdAt.toLocaleDateString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};