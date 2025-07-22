import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  ShoppingBag, 
  BarChart3, 
  Users, 
  Bell, 
  MapPin, 
  Star,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SellerDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  const [showCreateOffer, setShowCreateOffer] = useState(false);

  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    startTime: '',
    endTime: '',
    category: ''
  });

  const activeOffers = [
    {
      id: 1,
      title: 'Fresh Pizza Special',
      discount: 30,
      views: 245,
      claims: 18,
      revenue: 450,
      status: 'active',
      endTime: '2024-01-15T20:00:00'
    },
    {
      id: 2,
      title: 'Weekend Breakfast Deal',
      discount: 25,
      views: 189,
      claims: 12,
      revenue: 320,
      status: 'active',
      endTime: '2024-01-16T12:00:00'
    }
  ];

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle offer creation
    console.log('Creating offer:', newOffer);
    setShowCreateOffer(false);
    setNewOffer({
      title: '',
      description: '',
      discount: '',
      startTime: '',
      endTime: '',
      category: ''
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your offers and track performance</p>
        </div>
        <button
          onClick={() => setShowCreateOffer(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="w-5 h-5" />
          <span>{t('createOffer')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Active Offers</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{activeOffers.length}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-2 md:p-3 rounded-lg">
              <ShoppingBag className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Total Views</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 md:p-3 rounded-lg">
              <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Followers</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">567</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 md:p-3 rounded-lg">
              <Users className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Revenue</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">$2,450</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 md:p-3 rounded-lg">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Offers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <ShoppingBag className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-blue-500" />
          Active Offers
        </h2>
        <div className="space-y-4">
          {activeOffers.map((offer) => (
            <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium capitalize">
                    {offer.status}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    -{offer.discount}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{offer.views}</p>
                  <p className="text-sm text-gray-600">Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{offer.claims}</p>
                  <p className="text-sm text-gray-600">Claims</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${offer.revenue}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1 rtl:mr-0 rtl:ml-1" />
                    Ends: {new Date(offer.endTime).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                    Edit
                  </button>
                  <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors">
                    Pause
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Bell className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  5 free notifications left
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Offer Modal */}
      {showCreateOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('createOffer')}</h2>
              <form onSubmit={handleCreateOffer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('offerTitle')}
                  </label>
                  <input
                    type="text"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('offerDescription')}
                  </label>
                  <textarea
                    value={newOffer.description}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('discount')}
                  </label>
                  <input
                    type="number"
                    value={newOffer.discount}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, discount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="100"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('startTime')}
                    </label>
                    <input
                      type="datetime-local"
                      value={newOffer.startTime}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('endTime')}
                    </label>
                    <input
                      type="datetime-local"
                      value={newOffer.endTime}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateOffer(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    {t('createOffer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;