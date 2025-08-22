import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Heart, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  MessageCircle, 
  Image as ImageIcon,
  Camera,
  Upload,
  X,
  Send,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Wrench,
  ShoppingCart,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WishlistItem {
  id: string;
  title: string;
  description: string;
  category: 'repair' | 'purchase' | 'service' | 'other';
  image?: string;
  userId: string;
  userName: string;
  userPhone: string;
  location: {
    city: string;
    district: string;
  };
  budget?: {
    min: number;
    max: number;
    currency: 'AED' | 'SAR' | 'USD';
  };
  urgency: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  expiresAt: Date;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  responses: WishlistResponse[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

interface WishlistResponse {
  id: string;
  wishlistId: string;
  responderId: string;
  responderName: string;
  responderType: 'user' | 'seller' | 'service_provider';
  message: string;
  estimatedPrice?: number;
  estimatedTime?: string;
  contactInfo?: string;
  rating?: number;
  isVerified: boolean;
  createdAt: Date;
}

interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number; // Flixbits
  duration: number; // days
  features: {
    extendedListing: number; // additional days
    priorityPlacement: boolean;
    unlimitedImages: boolean;
    featuredBadge: boolean;
    responseNotifications: boolean;
  };
  isActive: boolean;
}

const WishlistManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'browse' | 'my-wishes' | 'create' | 'subscriptions'>('browse');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState<string | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWish, setSelectedWish] = useState<WishlistItem | null>(null);
  const [showWishDetails, setShowWishDetails] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [newWish, setNewWish] = useState({
    title: '',
    description: '',
    category: 'repair' as 'repair' | 'purchase' | 'service' | 'other',
    image: '',
    budget: {
      min: 0,
      max: 0,
      currency: 'AED' as 'AED' | 'SAR' | 'USD'
    },
    urgency: 'medium' as 'low' | 'medium' | 'high',
    location: {
      city: '',
      district: ''
    }
  });

  const [responseMessage, setResponseMessage] = useState('');

  // Subscription packages
  const subscriptionPackages: SubscriptionPackage[] = [
    {
      id: 'basic',
      name: 'Basic Extension',
      description: 'Extend your wishlist item for 2 additional weeks',
      price: 50, // 50 Flixbits
      duration: 14,
      features: {
        extendedListing: 14,
        priorityPlacement: false,
        unlimitedImages: false,
        featuredBadge: false,
        responseNotifications: true
      },
      isActive: true
    },
    {
      id: 'premium',
      name: 'Premium Boost',
      description: 'Featured listing with priority placement for 1 month',
      price: 200, // 200 Flixbits
      duration: 30,
      features: {
        extendedListing: 30,
        priorityPlacement: true,
        unlimitedImages: true,
        featuredBadge: true,
        responseNotifications: true
      },
      isActive: true
    },
    {
      id: 'ultimate',
      name: 'Ultimate Package',
      description: 'Maximum visibility and features for 3 months',
      price: 500, // 500 Flixbits
      duration: 90,
      features: {
        extendedListing: 90,
        priorityPlacement: true,
        unlimitedImages: true,
        featuredBadge: true,
        responseNotifications: true
      },
      isActive: true
    }
  ];

  // Sample wishlist items
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 'wish_001',
      title: 'iPhone Screen Repair Needed',
      description: 'My iPhone 13 Pro screen is cracked and needs professional repair. Looking for reliable service provider in Dubai.',
      category: 'repair',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
      userId: 'user_001',
      userName: 'Ahmed Hassan',
      userPhone: '+971501234567',
      location: { city: 'Dubai', district: 'Downtown' },
      budget: { min: 200, max: 400, currency: 'AED' },
      urgency: 'high',
      status: 'active',
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      isPremium: false,
      responses: [
        {
          id: 'resp_001',
          wishlistId: 'wish_001',
          responderId: 'seller_tech',
          responderName: 'TechFix Solutions',
          responderType: 'seller',
          message: 'We can fix your iPhone screen in 2 hours. Original parts guaranteed!',
          estimatedPrice: 300,
          estimatedTime: '2 hours',
          contactInfo: '+971507654321',
          rating: 4.8,
          isVerified: true,
          createdAt: new Date('2024-01-20T10:30:00')
        }
      ],
      views: 45,
      createdAt: new Date('2024-01-18T14:20:00'),
      updatedAt: new Date('2024-01-20T10:30:00')
    },
    {
      id: 'wish_002',
      title: 'Looking for Fresh Organic Vegetables',
      description: 'Need weekly delivery of fresh organic vegetables for family of 4. Prefer local suppliers.',
      category: 'purchase',
      image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400',
      userId: 'user_002',
      userName: 'Sarah Al-Zahra',
      userPhone: '+971509876543',
      location: { city: 'Abu Dhabi', district: 'Corniche' },
      budget: { min: 150, max: 250, currency: 'AED' },
      urgency: 'medium',
      status: 'active',
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      isPremium: true,
      premiumExpiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      responses: [],
      views: 23,
      createdAt: new Date('2024-01-19T09:15:00'),
      updatedAt: new Date('2024-01-19T09:15:00')
    },
    {
      id: 'wish_003',
      title: 'Home Cleaning Service Required',
      description: 'Need professional home cleaning service for 3-bedroom apartment. Weekly basis preferred.',
      category: 'service',
      userId: 'user_003',
      userName: 'Mohammed Ali',
      userPhone: '+971508765432',
      location: { city: 'Sharjah', district: 'Al Nahda' },
      budget: { min: 100, max: 200, currency: 'AED' },
      urgency: 'low',
      status: 'active',
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      isPremium: false,
      responses: [
        {
          id: 'resp_002',
          wishlistId: 'wish_003',
          responderId: 'service_clean',
          responderName: 'CleanPro Services',
          responderType: 'service_provider',
          message: 'Professional cleaning team available. Eco-friendly products used.',
          estimatedPrice: 150,
          estimatedTime: '3 hours',
          contactInfo: '+971506543210',
          rating: 4.9,
          isVerified: true,
          createdAt: new Date('2024-01-19T16:45:00')
        }
      ],
      views: 67,
      createdAt: new Date('2024-01-17T11:30:00'),
      updatedAt: new Date('2024-01-19T16:45:00')
    }
  ]);

  const categories = [
    { id: 'all', label: 'All Categories', icon: '📋' },
    { id: 'repair', label: 'Repair & Fix', icon: '🔧' },
    { id: 'purchase', label: 'Want to Buy', icon: '🛒' },
    { id: 'service', label: 'Service Needed', icon: '🛠️' },
    { id: 'other', label: 'Other', icon: '📦' }
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
        setNewWish(prev => ({ ...prev, image: imageDataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewWish(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleCreateWish = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWish.title || !newWish.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (newWish.description.length > 200) {
      alert('Description must be 200 characters or less');
      return;
    }

    const wishItem: WishlistItem = {
      id: `wish_${Date.now()}`,
      title: newWish.title,
      description: newWish.description,
      category: newWish.category,
      image: newWish.image,
      userId: user?.id || '',
      userName: user?.name || '',
      userPhone: user?.phone || '',
      location: newWish.location,
      budget: newWish.budget.max > 0 ? newWish.budget : undefined,
      urgency: newWish.urgency,
      status: 'active',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days free
      isPremium: false,
      responses: [],
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setWishlistItems(prev => [wishItem, ...prev]);
    
    // Award Flixbits for creating wishlist item
    const creationBonus = 25;
    updateUser({
      flixbits: (user?.flixbits || 0) + creationBonus
    });

    alert(`Wishlist item created successfully! You earned ${creationBonus} Flixbits. Your item will be listed for 7 days for free.`);
    
    setShowCreateModal(false);
    setNewWish({
      title: '',
      description: '',
      category: 'repair',
      image: '',
      budget: { min: 0, max: 0, currency: 'AED' },
      urgency: 'medium',
      location: { city: '', district: '' }
    });
  };

  const handleSendResponse = (wishlistId: string) => {
    if (!responseMessage.trim()) {
      alert('Please enter a response message');
      return;
    }

    if (responseMessage.length > 60) {
      alert('Response message must be 60 characters or less');
      return;
    }

    const response: WishlistResponse = {
      id: `resp_${Date.now()}`,
      wishlistId,
      responderId: user?.id || '',
      responderName: user?.name || '',
      responderType: user?.userType || 'user',
      message: responseMessage,
      isVerified: user?.userType === 'seller',
      createdAt: new Date()
    };

    setWishlistItems(prev => 
      prev.map(item => 
        item.id === wishlistId 
          ? { ...item, responses: [...item.responses, response], updatedAt: new Date() }
          : item
      )
    );

    // Award Flixbits for responding
    const responseBonus = 10;
    updateUser({
      flixbits: (user?.flixbits || 0) + responseBonus
    });

    alert(`Response sent successfully! You earned ${responseBonus} Flixbits for helping.`);
    setResponseMessage('');
    setShowResponseModal(null);
  };

  const handleSubscribe = (packageId: string, wishId: string) => {
    const package_ = subscriptionPackages.find(p => p.id === packageId);
    if (!package_) return;

    if ((user?.flixbits || 0) < package_.price) {
      alert('Insufficient Flixbits! Please earn more to subscribe.');
      return;
    }

    // Deduct Flixbits
    updateUser({
      flixbits: (user?.flixbits || 0) - package_.price
    });

    // Update wishlist item
    setWishlistItems(prev => 
      prev.map(item => 
        item.id === wishId 
          ? { 
              ...item, 
              isPremium: true,
              premiumExpiresAt: new Date(Date.now() + package_.duration * 24 * 60 * 60 * 1000),
              expiresAt: new Date(Math.max(item.expiresAt.getTime(), Date.now()) + package_.duration * 24 * 60 * 60 * 1000)
            }
          : item
      )
    );

    alert(`Successfully subscribed to ${package_.name}! Your wishlist item has been extended and boosted.`);
    setShowSubscriptionModal(false);
  };

  const filteredWishes = wishlistItems.filter(wish => {
    const matchesCategory = selectedCategory === 'all' || wish.category === selectedCategory;
    const matchesSearch = wish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wish.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && wish.status === 'active';
  });

  const myWishes = wishlistItems.filter(wish => wish.userId === user?.id);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'repair': return '🔧';
      case 'purchase': return '🛒';
      case 'service': return '🛠️';
      default: return '📦';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const timeDiff = expiresAt.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Expiring soon';
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">💝 Service Requests & Wishlist</h1>
        <p className="text-pink-100">Post what you need, get help from the community, and earn Flixbits</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('browse')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'browse'
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Browse Requests</span>
              <span className="responsive-tab-text-short font-medium">Browse Req</span>
                <span className="hidden md:inline">Browse Requests</span>
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('my-wishes')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'my-wishes'
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium text-xs md:text-base">
                <span className="md:hidden">My Req</span>
              <Heart className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">My Requests</span>
              <span className="responsive-tab-text-short font-medium">My Req</span>
            </button>
            
            <button
              onClick={() => setActiveTab('create')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'create'
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Plus className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Create Request</span>
              <span className="responsive-tab-text-short font-medium">Create Req</span>
                <span className="hidden md:inline">Create Request</span>
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'subscriptions'
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Zap className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Boost Packages</span>
              <span className="responsive-tab-text-short font-medium">Boost Pack</span>
                <span className="hidden md:inline">Boost Packages</span>
              </span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Browse Requests Tab */}
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
                    placeholder="Search requests..."
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Requests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWishes.map((wish) => (
                  <div key={wish.id} className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                    wish.isPremium ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 bg-white'
                  }`}>
                    {wish.isPremium && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 text-center">
                        <Star className="w-4 h-4 inline mr-1 rtl:mr-0 rtl:ml-1" />
                        <span className="text-sm font-bold">FEATURED</span>
                      </div>
                    )}
                    
                    {wish.image && (
                      <div className="relative">
                        <img 
                          src={wish.image} 
                          alt={wish.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(wish.urgency)}`}>
                            {wish.urgency} priority
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{getCategoryIcon(wish.category)}</span>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{wish.views}</span>
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{wish.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{wish.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{wish.location.city}, {wish.location.district}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>Expires in: {getTimeRemaining(wish.expiresAt)}</span>
                        </div>
                        {wish.budget && (
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            <span>Budget: {wish.budget.min}-{wish.budget.max} {wish.budget.currency}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{wish.responses.length} responses</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => {
                            setSelectedWish(wish);
                            setShowWishDetails(true);
                          }}
                          className="flex-1 bg-pink-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setShowResponseModal(wish.id)}
                          className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                        >
                          Respond
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Requests Tab */}
          {activeTab === 'my-wishes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">My Service Requests</h2>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Request</span>
                </button>
              </div>
              
              {myWishes.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Yet</h3>
                  <p className="text-gray-600 mb-4">Create your first service request to get help from the community!</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-colors"
                  >
                    Create Request
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myWishes.map((wish) => (
                    <div key={wish.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{wish.title}</h4>
                          <p className="text-gray-600 text-sm">{wish.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            wish.status === 'active' ? 'bg-green-100 text-green-800' :
                            wish.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {wish.status}
                          </span>
                          {wish.isPremium && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                              PREMIUM
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                        <div>
                          <span className="font-medium">Views:</span> {wish.views}
                        </div>
                        <div>
                          <span className="font-medium">Responses:</span> {wish.responses.length}
                        </div>
                        <div>
                          <span className="font-medium">Expires:</span> {getTimeRemaining(wish.expiresAt)}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {wish.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => {
                            setSelectedWish(wish);
                            setShowWishDetails(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          View Details
                        </button>
                        {wish.status === 'active' && (
                          <button
                            onClick={() => setShowSubscriptionModal(true)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                          >
                            Boost
                          </button>
                        )}
                        <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Request Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Service Request</h2>
                <p className="text-gray-600 mb-6">Tell the community what you need help with</p>
                
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Request</span>
                </button>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-pink-800 mb-4">How It Works</h3>
                <div className="space-y-3 text-pink-700">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <p>Create your request with photos and description (max 200 characters)</p>
                  </div>
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <p>Your request is listed for 7 days FREE</p>
                  </div>
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <p>Community members respond with solutions (max 60 characters per response)</p>
                  </div>
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <p>Extend listing with subscription packages for more visibility</p>
                  </div>
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                    <p>Earn 25 Flixbits for creating requests, 10 Flixbits for responding</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Packages Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Boost Your Requests</h2>
              <p className="text-gray-600">Extend your listing duration and get more visibility with our boost packages</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPackages.map((package_) => (
                  <div key={package_.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{package_.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{package_.description}</p>
                      <div className="text-3xl font-bold text-pink-600 mb-2">{package_.price} FB</div>
                      <div className="text-sm text-gray-500">{package_.duration} days extension</div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm">+{package_.features.extendedListing} days listing</span>
                      </div>
                      {package_.features.priorityPlacement && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">Priority placement</span>
                        </div>
                      )}
                      {package_.features.featuredBadge && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Star className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Featured badge</span>
                        </div>
                      )}
                      {package_.features.unlimitedImages && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <ImageIcon className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Unlimited images</span>
                        </div>
                      )}
                      {package_.features.responseNotifications && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <MessageCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Response notifications</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      disabled={(user?.flixbits || 0) < package_.price}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {(user?.flixbits || 0) < package_.price ? 'Insufficient Flixbits' : 'Subscribe'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Service Request</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateWish} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Request Title * <span className="text-red-500">(Required)</span>
                  </label>
                  <input
                    type="text"
                    value={newWish.title}
                    onChange={(e) => setNewWish(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="e.g., iPhone Screen Repair Needed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newWish.category}
                    onChange={(e) => setNewWish(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="repair">🔧 Repair & Fix</option>
                    <option value="purchase">🛒 Want to Buy</option>
                    <option value="service">🛠️ Service Needed</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description * <span className="text-red-500">(Max 200 characters)</span>
                  </label>
                  <textarea
                    value={newWish.description}
                    onChange={(e) => setNewWish(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={4}
                    maxLength={200}
                    placeholder="Describe what you need help with..."
                    required
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {newWish.description.length}/200 characters
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📷 Add Photo (Optional)
                  </label>
                  
                  {newWish.image ? (
                    <div className="relative mb-4">
                      <img 
                        src={newWish.image} 
                        alt="Request preview"
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
                        <p className="text-gray-600 mb-4">Upload a photo to help others understand your request</p>
                        
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      📍 City
                    </label>
                    <input
                      type="text"
                      value={newWish.location.city}
                      onChange={(e) => setNewWish(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, city: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Dubai"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      🏘️ District
                    </label>
                    <input
                      type="text"
                      value={newWish.location.district}
                      onChange={(e) => setNewWish(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, district: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Downtown"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      💰 Min Budget
                    </label>
                    <input
                      type="number"
                      value={newWish.budget.min || ''}
                      onChange={(e) => setNewWish(prev => ({ 
                        ...prev, 
                        budget: { ...prev.budget, min: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      💰 Max Budget
                    </label>
                    <input
                      type="number"
                      value={newWish.budget.max || ''}
                      onChange={(e) => setNewWish(prev => ({ 
                        ...prev, 
                        budget: { ...prev.budget, max: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      💱 Currency
                    </label>
                    <select
                      value={newWish.budget.currency}
                      onChange={(e) => setNewWish(prev => ({ 
                        ...prev, 
                        budget: { ...prev.budget, currency: e.target.value as any }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="AED">🇦🇪 AED</option>
                      <option value="SAR">🇸🇦 SAR</option>
                      <option value="USD">🇺🇸 USD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ⚡ Urgency Level
                  </label>
                  <select
                    value={newWish.urgency}
                    onChange={(e) => setNewWish(prev => ({ ...prev, urgency: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="low">🟢 Low - Can wait</option>
                    <option value="medium">🟡 Medium - Preferred soon</option>
                    <option value="high">🔴 High - Urgent</option>
                  </select>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-2">🎁 Rewards for Creating Request:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• <strong>25 Flixbits</strong> immediately upon creating</li>
                    <li>• <strong>7 days FREE</strong> listing period</li>
                    <li>• Get responses from verified service providers</li>
                    <li>• Extend with boost packages for more visibility</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    🔄 Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newWish.title || !newWish.description}
                    className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🚀 Create Request & Earn 25 FB
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Send Response</h2>
                <button
                  onClick={() => setShowResponseModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Response (Max 60 characters)
                  </label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={3}
                    maxLength={60}
                    placeholder="I can help with this..."
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {responseMessage.length}/60 characters
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Reward:</strong> Earn 10 Flixbits for helping someone!
                  </p>
                </div>
                
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <button
                    onClick={() => setShowResponseModal(null)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendResponse(showResponseModal)}
                    disabled={!responseMessage.trim()}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send & Earn 10 FB</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wish Details Modal */}
      {showWishDetails && selectedWish && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
                <button
                  onClick={() => setShowWishDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {selectedWish.image && (
                  <img 
                    src={selectedWish.image} 
                    alt={selectedWish.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedWish.title}</h3>
                  <p className="text-gray-600 mb-4">{selectedWish.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <p className="font-medium capitalize">{selectedWish.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Urgency:</span>
                      <p className="font-medium capitalize">{selectedWish.urgency}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="font-medium">{selectedWish.location.city}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Expires:</span>
                      <p className="font-medium">{getTimeRemaining(selectedWish.expiresAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Responses ({selectedWish.responses.length})</h4>
                  {selectedWish.responses.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No responses yet</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedWish.responses.map((response) => (
                        <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="font-medium">{response.responderName}</span>
                              {response.isVerified && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  Verified
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {response.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{response.message}</p>
                          {response.estimatedPrice && (
                            <p className="text-sm text-green-600 mt-2">
                              Estimated: {response.estimatedPrice} AED
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowWishDetails(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedWish.userId !== user?.id && (
                  <button
                    onClick={() => {
                      setShowWishDetails(false);
                      setShowResponseModal(selectedWish.id);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors"
                  >
                    Send Response
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistManager;