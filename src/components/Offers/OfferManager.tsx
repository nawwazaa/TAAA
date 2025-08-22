import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Eye, 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign,
  Star,
  QrCode,
  Camera,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: string;
  category: string;
  sellerId: string;
  sellerName: string;
  location: {
    address: string;
    city: string;
  };
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  maxRedemptions: number;
  currentRedemptions: number;
  rating: number;
  isActive: boolean;
}

const OfferManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  // Main navigation state - 3 clear options
  const [activeTab, setActiveTab] = useState<'browse' | 'my-purchases' | 'create-item'>('browse');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState<Offer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'flixbits' | 'paypal'>('flixbits');
  const [purchasedOffers, setPurchasedOffers] = useState<string[]>([]);
  
  // Create item form state
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    image: '',
    price: 0,
    category: 'electronics',
    startDate: '',
    endDate: '',
    location: {
      address: '',
      city: ''
    }
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'electronics', label: '📱 Electronics' },
    { id: 'fashion', label: '👕 Fashion' },
    { id: 'home', label: '🏠 Home & Garden' },
    { id: 'sports', label: '⚽ Sports' },
    { id: 'books', label: '📚 Books' },
    { id: 'toys', label: '🧸 Toys' },
    { id: 'automotive', label: '🚗 Automotive' },
    { id: 'other', label: '🔧 Other' }
  ];

  // Sample offers data
  const sampleOffers: Offer[] = [
    {
      id: 'offer1',
      title: 'iPhone 13 Pro - Excellent Condition',
      description: 'Barely used iPhone 13 Pro, 256GB, Space Gray. Includes original box, charger, and screen protector.',
      originalPrice: 800,
      discountedPrice: 650,
      discount: 19,
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'electronics',
      sellerId: 'seller1',
      sellerName: 'Tech Store Dubai',
      location: { address: 'Dubai Mall', city: 'Dubai' },
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      maxRedemptions: 1,
      currentRedemptions: 0,
      rating: 4.8,
      isActive: true
    },
    {
      id: 'offer2',
      title: 'Designer Handbag - Authentic',
      description: 'Genuine leather designer handbag, barely used. Perfect for special occasions.',
      originalPrice: 300,
      discountedPrice: 200,
      discount: 33,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'fashion',
      sellerId: 'seller2',
      sellerName: 'Fashion Boutique',
      location: { address: 'Mall of Emirates', city: 'Dubai' },
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-02-10'),
      maxRedemptions: 1,
      currentRedemptions: 0,
      rating: 4.9,
      isActive: true
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setNewItem(prev => ({ ...prev, image: imageDataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewItem(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.title || !newItem.description || !newItem.price || !newItem.startDate || !newItem.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(newItem.startDate) >= new Date(newItem.endDate)) {
      alert('End date must be after start date');
      return;
    }

    // Award Flixbits for creating item
    const creationBonus = 100;
    updateUser({
      flixbits: (user?.flixbits || 0) + creationBonus
    });

    alert(`Item listed successfully! You earned ${creationBonus} Flixbits! Your item is now live for sale.`);
    
    // Reset form
    setNewItem({
      title: '',
      description: '',
      image: '',
      price: 0,
      category: 'electronics',
      startDate: '',
      endDate: '',
      location: { address: '', city: '' }
    });
  };

  const handlePurchase = (offer: Offer) => {
    if (paymentMethod === 'flixbits') {
      if ((user?.flixbits || 0) < offer.discountedPrice) {
        alert('Insufficient Flixbits! Please add more to your wallet.');
        return;
      }
      
      updateUser({
        flixbits: (user?.flixbits || 0) - offer.discountedPrice
      });
      
      setPurchasedOffers(prev => [...prev, offer.id]);
      alert('Purchase successful! You can now redeem this offer.');
    }
    
    setShowPurchaseModal(null);
  };

  const filteredOffers = sampleOffers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory && offer.isActive;
  });

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🛍️ Marketplace</h1>
        <p className="text-blue-100">Buy and sell items with Flixbits or PayPal</p>
      </div>

      {/* Main Navigation - 3 Clear Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('browse')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'browse'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Browse Items</span>
              <span className="responsive-tab-text-short font-medium">Browse Items</span>
            </button>
            
            <button
              onClick={() => setActiveTab('my-purchases')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'my-purchases'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">My Purchases</span>
              <span className="responsive-tab-text-short font-medium">My Purchases</span>
            </button>
            
            <button
              onClick={() => setActiveTab('create-item')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'create-item'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Plus className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Create Sell</span>
              <span className="responsive-tab-text-short font-medium">Create Sell</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Browse Items Tab */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredOffers.map((offer) => (
                  <div key={offer.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={offer.image} 
                        alt={offer.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                          -{offer.discount}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-bold text-sm md:text-base text-gray-900 mb-2 line-clamp-2">{offer.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{offer.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="line-through">{offer.originalPrice} FB</span>
                          <span className="text-base md:text-lg font-bold text-green-600">{offer.discountedPrice} FB</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{offer.location.city}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-yellow-500" />
                          <span>{offer.rating} rating</span>
                        </div>
                      </div>
                      
                      {purchasedOffers.includes(offer.id) ? (
                        <div className="text-center py-2">
                          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                            ✓ Purchased
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowPurchaseModal(offer)}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg text-sm md:text-base font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Purchases Tab */}
          {activeTab === 'my-purchases' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">My Purchases</h2>
              
              {purchasedOffers.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchases Yet</h3>
                  <p className="text-gray-600 mb-4">Browse items and make your first purchase!</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
                  >
                    Browse Items
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {sampleOffers
                    .filter(offer => purchasedOffers.includes(offer.id))
                    .map((offer) => (
                      <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex space-x-4 rtl:space-x-reverse">
                          <img 
                            src={offer.image} 
                            alt={offer.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{offer.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">Paid: {offer.discountedPrice} FB</p>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
                                ✓ Purchased
                              </span>
                              <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 flex-shrink-0">
                                <QrCode className="w-3 h-3 inline mr-1 rtl:mr-0 rtl:ml-1" />
                                Show QR
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Create Item Tab */}
          {activeTab === 'create-item' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">🏷️ Create Sell</h2>
                <p className="text-gray-600">List your item for sale and earn Flixbits!</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-800 mb-4">🎁 Selling Benefits</h3>
                <div className="space-y-2 text-green-700">
                  <p>• Earn <strong>100 Flixbits</strong> for listing each item</p>
                  <p>• Get paid in Flixbits when items sell</p>
                  <p>• Reach thousands of potential buyers</p>
                  <p>• Secure payment processing</p>
                  <p>• Easy QR code redemption system</p>
                </div>
              </div>
              
              <form onSubmit={handleCreateItem} className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📝 Item Title * <span className="text-red-500">(Required)</span>
                  </label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., iPhone 13 Pro - Excellent Condition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🏷️ Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📄 Description * <span className="text-red-500">(Required)</span>
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe your item in detail, condition, features, etc..."
                    required
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📷 Item Photo * <span className="text-red-500">(Required)</span>
                  </label>
                  
                  {newItem.image ? (
                    <div className="relative mb-4">
                      <img 
                        src={newItem.image} 
                        alt="Item preview"
                        className="w-full h-64 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">Upload a clear photo of your item</p>
                        
                        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                          >
                            <Upload className="w-4 h-4" />
                            <span>📁 Choose File</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                          >
                            <Camera className="w-4 h-4" />
                            <span>📷 Take Photo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    💰 Price (Flixbits) * <span className="text-red-500">(Required)</span>
                  </label>
                  <input
                    type="number"
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                    placeholder="e.g., 500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    ≈ ${((newItem.price || 0) * 0.1).toFixed(2)} USD
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      📅 Sale Start Date * <span className="text-red-500">(Required)</span>
                    </label>
                    <input
                      type="date"
                      value={newItem.startDate}
                      onChange={(e) => setNewItem(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      📅 Sale End Date * <span className="text-red-500">(Required)</span>
                    </label>
                    <input
                      type="date"
                      value={newItem.endDate}
                      onChange={(e) => setNewItem(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      📍 Address
                    </label>
                    <input
                      type="text"
                      value={newItem.location.address}
                      onChange={(e) => setNewItem(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, address: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your address or area"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      🏙️ City
                    </label>
                    <input
                      type="text"
                      value={newItem.location.city}
                      onChange={(e) => setNewItem(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, city: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-2">🎁 Rewards for Listing This Item:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• <strong>100 Flixbits</strong> immediately upon listing</li>
                    <li>• Get paid when your item sells</li>
                    <li>• Reach thousands of potential buyers</li>
                    <li>• Secure payment protection</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setNewItem({
                        title: '',
                        description: '',
                        image: '',
                        price: 0,
                        category: 'electronics',
                        startDate: '',
                        endDate: '',
                        location: { address: '', city: '' }
                      });
                    }}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    🔄 Reset Form
                  </button>
                  <button
                    type="submit"
                    disabled={!newItem.title || !newItem.description || !newItem.price || !newItem.image || !newItem.startDate || !newItem.endDate}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🚀 List Item & Earn 100 FB
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Purchase Item</h2>
              
              <div className="mb-6">
                <img 
                  src={showPurchaseModal.image} 
                  alt={showPurchaseModal.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-gray-900 mb-2">{showPurchaseModal.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">{showPurchaseModal.discountedPrice} FB</span>
                  <span className="text-sm text-gray-500 line-through">{showPurchaseModal.originalPrice} FB</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="flixbits"
                        checked={paymentMethod === 'flixbits'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'flixbits' | 'paypal')}
                        className="mr-2 rtl:mr-0 rtl:ml-2"
                      />
                      <span>Pay with Flixbits (Balance: {user?.flixbits})</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'flixbits' | 'paypal')}
                        className="mr-2 rtl:mr-0 rtl:ml-2"
                      />
                      <span>Pay with PayPal (${(showPurchaseModal.discountedPrice * 0.1).toFixed(2)})</span>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'flixbits' ? (
                  <button
                    onClick={() => handlePurchase(showPurchaseModal)}
                    disabled={(user?.flixbits || 0) < showPurchaseModal.discountedPrice}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50"
                  >
                    {(user?.flixbits || 0) < showPurchaseModal.discountedPrice 
                      ? 'Insufficient Flixbits' 
                      : `Pay ${showPurchaseModal.discountedPrice} Flixbits`}
                  </button>
                ) : (
                  <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: {
                              value: (showPurchaseModal.discountedPrice * 0.1).toFixed(2)
                            }
                          }]
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then(() => {
                          handlePurchase(showPurchaseModal);
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                )}
              </div>
              
              <button
                onClick={() => setShowPurchaseModal(null)}
                className="w-full mt-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferManager;