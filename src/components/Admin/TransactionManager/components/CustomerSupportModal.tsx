import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Transaction, CustomerMessage } from '../types';

interface CustomerSupportModalProps {
  transaction: Transaction;
  onClose: () => void;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  currentUser: any;
}

const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  transaction,
  onClose,
  onUpdateTransaction,
  currentUser
}) => {
  const [supportMessage, setSupportMessage] = useState('');

  const handleSendSupportMessage = () => {
    if (!supportMessage.trim()) return;

    const newMessage: CustomerMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id || 'support',
      senderName: currentUser?.name || 'Customer Support',
      senderType: 'support',
      message: supportMessage,
      timestamp: new Date()
    };

    const updatedTransaction = {
      ...transaction,
      customerSupport: {
        ...transaction.customerSupport!,
        status: 'responded' as const,
        messages: [...(transaction.customerSupport?.messages || []), newMessage]
      }
    };

    onUpdateTransaction(transaction.id, updatedTransaction);
    setSupportMessage('');
    alert('Message sent to customer successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Customer Support</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Customer: {transaction.userName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{transaction.userEmail}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{transaction.userPhone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Transaction:</span>
                  <p className="font-medium">{transaction.id}</p>
                </div>
              </div>
            </div>

            {/* Message History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Message History</h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {transaction.customerSupport?.messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.senderType === 'customer'
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'bg-green-50 border-l-4 border-green-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{message.senderName}</span>
                      <span className="text-sm text-gray-500">{message.timestamp.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Message */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Response</h3>
              <div className="space-y-4">
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Type your response to the customer..."
                />
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSendSupportMessage}
                    disabled={!supportMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportModal;