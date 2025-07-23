import React from 'react';
import { X } from 'lucide-react';
import { Transaction } from '../types';
import { getStatusColor } from '../utils/helpers';

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onClose: () => void;
  onOpenSupport: () => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  onClose,
  onOpenSupport
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Basic Transaction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                    <p className="text-gray-900 font-mono">{transaction.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="text-gray-900 capitalize">{transaction.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900">{transaction.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="text-gray-900">{transaction.paymentMethod}</p>
                  </div>
                  {transaction.gatewayTransactionId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gateway Transaction ID</label>
                      <p className="text-gray-900 font-mono text-sm">{transaction.gatewayTransactionId}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="text-gray-900 font-semibold">{transaction.amount} {transaction.currency}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">USD Equivalent</label>
                    <p className="text-gray-900">${transaction.usdEquivalent.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Flixbits Involved</label>
                    <p className="text-gray-900">{transaction.flixbitsInvolved} FB</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fees</label>
                    <p className="text-gray-900">{transaction.fees.toFixed(2)} {transaction.currency}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{transaction.userName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{transaction.userEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{transaction.userPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900">{transaction.location.city}, {transaction.location.country}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Platform</label>
                    <p className="text-gray-900">{transaction.deviceInfo.platform}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">App Version</label>
                    <p className="text-gray-900">{transaction.deviceInfo.version}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP Address</label>
                    <p className="text-gray-900 font-mono">{transaction.deviceInfo.ip}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-gray-900">{transaction.createdAt.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-gray-900">{transaction.updatedAt.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Notes */}
            {transaction.reviewNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Notes</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">{transaction.reviewNotes}</p>
                  {transaction.reviewedBy && (
                    <p className="text-yellow-600 text-sm mt-2">Reviewed by: {transaction.reviewedBy}</p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {transaction.customerSupport?.status !== 'none' && (
                <button
                  onClick={onOpenSupport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Customer Support
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;