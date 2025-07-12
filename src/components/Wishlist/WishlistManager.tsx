import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Filter,
  MessageCircle, 
  Bell, 
  Camera, 
  Upload, 
  X, 
  MapPin, 
  Clock, 
  DollarSign,
  User,
  Star,
  Send,
  Phone,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Wrench,
  Home,
  Car,
  Laptop,
  Heart,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ChatConversation {
  id: string;
  requestId: string;
  participants: {
    id: string;
    name: string;
    type: 'user' | 'provider';
  }[];
  messages: ChatMessage[];
  lastUpdated: Date;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'offer';
  offerDetails?: {
    price: number;
    description: string;
    accepted: boolean;
  };
}

interface WishlistRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  budget: {
    min: number;
    max: number;
  };
  location: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  urgency: 'low' | 'medium' | 'high';
  userId: string;
  userName: string;
  userPhone: string;
  createdAt: Date;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  responses: Response[];
  viewCount: number;
}

interface Response {
  id: string;
  requestId: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  message: string;
  quotedPrice: number;
  estimatedTime: string;
  images: string[];
  createdAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'offer';
}

const WishlistManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'browse' | 'my-requests' | 'create' | 'my-responses' | 'chat'>('browse');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState<WishlistRequest | null>(null);
  const [showChatModal, setShowChatModal] = useState<{ request: WishlistRequest; response: Response } | null>(null);
  const [activeConversations, setActiveConversations] = useState<ChatConversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const responseFileInputRef = useRef<HTMLInputElement>(null);

  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'repair',
    images: [] as string[],
    budget: { min: 0, max: 0 },
    location: { address: '', city: '' },
    urgency: 'medium' as 'low' | 'medium' | 'high'
  });

  const [newResponse, setNewResponse] = useState({
    message: '',
    quotedPrice: 0,
    estimatedTime: '',
    images: [] as string[]
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const categories = [
    { id: 'all', label: 'All Categories', icon: '🔧' },
    { id: 'repair', label: 'Appliance Repair', icon: '🔧' },
    { id: 'plumbing', label: 'Plumbing', icon: '🚿' },
    { id: 'electrical', label: 'Electrical', icon: '⚡' },
    { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
    { id: 'painting', label: 'Painting', icon: '🎨' },
    { id: 'gardening', label: 'Gardening', icon: '🌱' },
    { id: 'moving', label: 'Moving', icon: '📦' },
    { id: 'automotive', label: 'Automotive', icon: '🚗' },
    { id: 'tech', label: 'Tech Support', icon: '💻' },
    { id: 'other', label: 'Other', icon: '🛠️' }
  ];

  const [requests, setRequests] = useState<WishlistRequest[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);

  // Sample data
  const sampleRequests: WishlistRequest[] = [
    {
      id: 'req1',
      title: 'Refrigerator Not Cooling - Urgent Repair Needed',
      description: 'My refrigerator stopped cooling properly yesterday. The freezer works but the main compartment is not cold. Need someone experienced with Samsung appliances.',
      category: 'repair',
      images: ['https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=800'],
      budget: { min: 100, max: 300 },
      location: { address: 'Dubai Marina', city: 'Dubai' },
      urgency: 'high',
      userId: 'user1',
      userName: 'Ahmed Hassan',
      userPhone: '+971501234567',
      createdAt: new Date('2024-01-15'),
      status: 'open',
      responses: [],
      viewCount: 23
    },
    {
      id: 'req2',
      title: 'Bathroom Sink Leak - Need Plumber',
      description: 'Water is leaking from under the bathroom sink. Seems like a pipe connection issue. Available weekends only.',
      category: 'plumbing',
      images: ['https://images.pexels.com/photos/1358912/pexels-photo-1358912.jpeg?auto=compress&cs=tinysrgb&w=800'],
      budget: { min: 50, max: 150 },
      location: { address: 'Jumeirah Lake Towers', city: 'Dubai' },
      urgency: 'medium',
      userId: 'user2',
      userName: 'Sarah Al-Zahra',
      userPhone: '+971507654321',
      createdAt: new Date('2024-01-14'),
      status: 'open',
      responses: [],
      viewCount: 15
    },
    {
      id: 'req3',
      title: 'AC Not Working - Summer Emergency',
      description: 'Air conditioning unit completely stopped working. Very urgent as it\'s summer and we have small children. Need immediate repair.',
      category: 'repair',
      images: ['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'],
      budget: { min: 200, max: 500 },
      location: { address: 'Downtown Dubai', city: 'Dubai' },
      urgency: 'high',
      userId: 'user3',
      userName: 'Mohammed Ali',
      userPhone: '+971509876543',
      createdAt: new Date('2024-01-16'),
      status: 'open',
      responses: [],
      viewCount: 31
    }
  ];

  // Sample chat conversations
  useEffect(() => {
    // Initialize with sample conversations
    setActiveConversations([
      {
        id: 'conv1',
        requestId: 'req1',
        participants: [
          { id: user?.id || 'user1', name: user?.name || 'Ahmed Hassan', type: 'user' },
          { id: 'provider1', name: 'TechFix Solutions', type: 'provider' }
        ],
        messages: [
          {
            id: 'msg1',
            senderId: 'provider1',
            senderName: 'TechFix Solutions',
            message: 'Hello! I can help with your refrigerator repair. Based on your description, it sounds like it might be a compressor issue.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            type: 'text'
          },
          {
            id: 'msg2',
            senderId: user?.id || 'user1',
            senderName: user?.name || 'Ahmed Hassan',
            message: 'Thanks for responding. How much would it cost to fix?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
            type: 'text'
          },
          {
            id: 'msg3',
            senderId: 'provider1',
            senderName: 'TechFix Solutions',
            message: 'I can offer you a competitive price for this repair.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            type: 'offer',
            offerDetails: {
              price: 200,
              description: 'Full refrigerator repair including parts and labor. 3-month warranty included.',
              accepted: false
            }
          }
        ],
        lastUpdated: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
      }
    ]);
  }, [user?.id, user?.name]);

  const allRequests = [...sampleRequests, ...requests];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'request' | 'response') => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
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
          if (type === 'request') {
            setNewRequest(prev => ({ 
              ...prev, 
              images: [...prev.images, imageDataUrl] 
            }));
          } else {
            setNewResponse(prev => ({ 
              ...prev, 
              images: [...prev.images, imageDataUrl] 
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number, type: 'request' | 'response') => {
    if (type === 'request') {
      setNewRequest(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      setNewResponse(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequest.title || !newRequest.description) {
      alert('Please fill in all required fields');
      return;
    }

    const request: WishlistRequest = {
      id: `req_${Date.now()}`,
      title: newRequest.title,
      description: newRequest.description,
      category: newRequest.category,
      images: newRequest.images,
      budget: newRequest.budget,
      location: newRequest.location,
      urgency: newRequest.urgency,
      userId: user?.id || '',
      userName: user?.name || '',
      userPhone: user?.phone || '',
      createdAt: new Date(),
      status: 'open',
      responses: [],
      viewCount: 0
    };

    setRequests(prev => [...prev, request]);

    // Award Flixbits for creating request
    const creationBonus = 50;
    updateUser({
      flixbits: (user?.flixbits || 0) + creationBonus
    });

    alert(`Request posted successfully! You earned ${creationBonus} Flixbits! Service providers will be notified.`);
    
    setShowCreateModal(false);
    setNewRequest({
      title: '',
      description: '',
      category: 'repair',
      images: [],
      budget: { min: 0, max: 0 },
      location: { address: '', city: '' },
      urgency: 'medium'
    });
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showResponseModal || !newResponse.message || !newResponse.quotedPrice) {
      alert('Please fill in all required fields');
      return;
    }

    const response: Response = {
      id: `resp_${Date.now()}`,
      requestId: showResponseModal.id,
      providerId: user?.id || '',
      providerName: user?.name || '',
      providerRating: 4.5, // Mock rating
      message: newResponse.message,
      quotedPrice: newResponse.quotedPrice,
      estimatedTime: newResponse.estimatedTime,
      images: newResponse.images,
      createdAt: new Date(),
      status: 'pending'
    };

    setResponses(prev => [...prev, response]);

    // Award Flixbits for responding
    const responseBonus = 25;
    updateUser({
      flixbits: (user?.flixbits || 0) + responseBonus
    });

    alert(`Response submitted successfully! You earned ${responseBonus} Flixbits! The customer will be notified.`);
    
    setShowResponseModal(null);
    setNewResponse({
      message: '',
      quotedPrice: 0,
      estimatedTime: '',
      images: []
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !showChatModal) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || '',
      senderName: user?.name || '',
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleSendOffer = (price: number, description: string) => {
    if (!showChatModal) return;
    
    const offerMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || '',
      senderName: user?.name || '',
      message: 'I\'d like to offer you a price for this service.',
      timestamp: new Date(),
      type: 'offer',
      offerDetails: {
        price,
        description,
        accepted: false
      }
    };
    
    setChatMessages(prev => [...prev, offerMessage]);
    
    // Update active conversations
    setActiveConversations(prev => {
      const conversationIndex = prev.findIndex(conv => 
        conv.requestId === showChatModal.request.id && 
        conv.participants.some(p => p.id === user?.id)
      );
      
      if (conversationIndex >= 0) {
        const updatedConversations = [...prev];
        updatedConversations[conversationIndex].messages.push(offerMessage);
        updatedConversations[conversationIndex].lastUpdated = new Date();
        return updatedConversations;
      }
      
      return prev;
    });
  };

  const handleAcceptOffer = (messageId: string) => {
    setChatMessages(prev => 
      prev.map(msg => 
        msg.id === messageId && msg.type === 'offer' 
          ? { ...msg, offerDetails: { ...msg.offerDetails!, accepted: true } } 
          : msg
      )
    );
    
    // Update in active conversations
    setActiveConversations(prev => {
      return prev.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => 
          msg.id === messageId && msg.type === 'offer'
            ? { ...msg, offerDetails: { ...msg.offerDetails!, accepted: true } }
            : msg
        )
      }));
    });
    
    // Notify user
    alert('Offer accepted! You can now proceed with the service.');
  };

  const filteredRequests = allRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'all' || request.urgency === selectedUrgency;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '🔧';
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🛠️ Service Requests</h1>
        <p className="text-purple-100">Post your service needs and connect with skilled professionals</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'browse'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-5 h-5" />
              <span className="font-medium">Browse Requests</span>
            </button>
            
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'my-requests'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">My Requests</span>
            </button>
            
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'create'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Post Request</span>
            </button>
            
            {(user?.userType === 'seller' || user?.userType === 'influencer') && (
              <button
                onClick={() => setActiveTab('my-responses')}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                  activeTab === 'my-responses'
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">My Responses</span>
              </button>
            )}
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
                    placeholder="Search service requests..."
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Urgency</option>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>

              {/* Requests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {request.images.length > 0 && (
                      <div className="relative">
                        <img 
                          src={request.images[0]} 
                          alt={request.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency.toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                            {getCategoryIcon(request.category)} {categories.find(c => c.id === request.category)?.label}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{request.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{request.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>Budget: {request.budget.min} - {request.budget.max} FB</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{request.location.address}, {request.location.city}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{request.userName}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{request.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{request.viewCount} views</span>
                        </div>
                      </div>
                      
                      {user?.id !== request.userId && (user?.userType === 'seller' || user?.userType === 'influencer') && (
                        <button
                          onClick={() => setShowResponseModal(request)}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                        >
                          💬 Send Quote
                        </button>
                      )}
                      
                      {user?.id === request.userId && (
                        <div className="text-center py-2 text-gray-500 text-sm">
                          Your Request
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Requests Tab */}
          {activeTab === 'my-requests' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">My Service Requests</h2>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Plus className="w-5 h-5" />
                  <span>Post New Request</span>
                </button>
              </div>
              
              {allRequests.filter(r => r.userId === user?.id).length === 0 ? (
                <div className="text-center py-12">
                  <Wrench className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Posted Yet</h3>
                  <p className="text-gray-600 mb-4">Post your first service request to get help from professionals!</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    Post Request
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {allRequests.filter(r => r.userId === user?.id).map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        {request.images.length > 0 && (
                          <img 
                            src={request.images[0]} 
                            alt={request.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{request.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                          <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                            <span>Budget: {request.budget.min}-{request.budget.max} FB</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getUrgencyColor(request.urgency)}`}>
                              {request.urgency}
                            </span>
                            <span>{request.responses.length} responses</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {activeConversations.some(conv => conv.requestId === request.id) && (
                            <button
                              onClick={() => {
                                const conversation = activeConversations.find(conv => conv.requestId === request.id);
                                if (conversation) {
                                  const provider = conversation.participants.find(p => p.type === 'provider');
                                  if (provider) {
                                    const mockResponse: Response = {
                                      id: 'resp_' + Date.now(),
                                      requestId: request.id,
                                      providerId: provider.id,
                                      providerName: provider.name,
                                      providerRating: 4.5,
                                      message: 'I can help with this request.',
                                      quotedPrice: 200,
                                      estimatedTime: '2-3 hours',
                                      images: [],
                                      createdAt: new Date(),
                                      status: 'pending'
                                    };
                                    
                                    setShowChatModal({ request, response: mockResponse });
                                    setChatMessages(conversation.messages);
                                  }
                                }
                              }}
                              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Chat</span>
                            </button>
                          )}
                        </div>
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
              <h2 className="text-xl font-bold text-gray-900">🛠️ Post Service Request</h2>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-purple-800 mb-4">🎁 Request Posting Benefits</h3>
                <div className="space-y-2 text-purple-700">
                  <p>• Earn <strong>50 Flixbits</strong> for posting each request</p>
                  <p>• Get quotes from verified service providers</p>
                  <p>• Chat directly with professionals</p>
                  <p>• Compare prices and reviews</p>
                  <p>• Secure payment through the platform</p>
                </div>
              </div>
              
              <form onSubmit={handleCreateRequest} className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📝 Request Title * <span className="text-red-500">(Required)</span>
                  </label>
                  <input
                    type="text"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Refrigerator Not Cooling - Urgent Repair Needed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🏷️ Category
                  </label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📄 Description * <span className="text-red-500">(Required)</span>
                  </label>
                  <textarea
                    value={newRequest.description}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe the problem in detail, what needs to be fixed, any specific requirements..."
                    required
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📷 Images (Optional)
                  </label>
                  
                  {newRequest.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {newRequest.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, 'request')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-4">Upload images to help service providers understand the issue</p>
                      
                      <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                        >
                          <Upload className="w-4 h-4" />
                          <span>📁 Choose Files</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                        >
                          <Camera className="w-4 h-4" />
                          <span>📷 Take Photos</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, 'request')}
                    className="hidden"
                  />
                  
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={(e) => handleImageUpload(e, 'request')}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      💰 Minimum Budget (Flixbits)
                    </label>
                    <input
                      type="number"
                      value={newRequest.budget.min || ''}
                      onChange={(e) => setNewRequest(prev => ({ 
                        ...prev, 
                        budget: { ...prev.budget, min: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      placeholder="e.g., 100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      💰 Maximum Budget (Flixbits)
                    </label>
                    <input
                      type="number"
                      value={newRequest.budget.max || ''}
                      onChange={(e) => setNewRequest(prev => ({ 
                        ...prev, 
                        budget: { ...prev.budget, max: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      placeholder="e.g., 300"
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
                      value={newRequest.location.address}
                      onChange={(e) => setNewRequest(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, address: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your address or area"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      🏙️ City
                    </label>
                    <input
                      type="text"
                      value={newRequest.location.city}
                      onChange={(e) => setNewRequest(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, city: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ⚡ Urgency Level
                  </label>
                  <select
                    value={newRequest.urgency}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, urgency: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">🟢 Low - Can wait a few days</option>
                    <option value="medium">🟡 Medium - Need within 1-2 days</option>
                    <option value="high">🔴 High - Urgent, need ASAP</option>
                  </select>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-2">🎁 Rewards for Posting This Request:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• <strong>50 Flixbits</strong> immediately upon posting</li>
                    <li>• Get quotes from verified professionals</li>
                    <li>• Direct chat with service providers</li>
                    <li>• Secure payment protection</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setNewRequest({
                        title: '',
                        description: '',
                        category: 'repair',
                        images: [],
                        budget: { min: 0, max: 0 },
                        location: { address: '', city: '' },
                        urgency: 'medium'
                      });
                    }}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    🔄 Reset Form
                  </button>
                  <button
                    type="submit"
                    disabled={!newRequest.title || !newRequest.description}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🚀 Post Request & Earn 50 FB
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* My Responses Tab */}
          {activeTab === 'my-responses' && (user?.userType === 'seller' || user?.userType === 'influencer') && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">My Service Responses</h2>
              
              {responses.filter(r => r.providerId === user?.id).length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Responses Sent Yet</h3>
                  <p className="text-gray-600 mb-4">Browse service requests and send quotes to earn Flixbits!</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    Browse Requests
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {responses.filter(r => r.providerId === user?.id).map((response) => {
                    const request = allRequests.find(req => req.id === response.requestId);
                    if (!request) return null;
                    
                    return (
                      <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">{request.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">Your Quote: {response.quotedPrice} FB</p>
                        <p className="text-sm text-gray-600 mb-2">Message: {response.message}</p>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            response.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            response.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {response.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Sent: {response.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">💬 Send Quote</h2>
                <button
                  onClick={() => setShowResponseModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">{showResponseModal.title}</h3>
                <p className="text-gray-600 mb-2">{showResponseModal.description}</p>
                <div className="text-sm text-gray-500">
                  Budget: {showResponseModal.budget.min} - {showResponseModal.budget.max} FB
                </div>
              </div>
              
              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    value={newResponse.message}
                    onChange={(e) => setNewResponse(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Explain your experience and how you can help..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Quote (Flixbits) *
                    </label>
                    <input
                      type="number"
                      value={newResponse.quotedPrice || ''}
                      onChange={(e) => setNewResponse(prev => ({ ...prev, quotedPrice: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      placeholder="e.g., 150"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Time
                    </label>
                    <input
                      type="text"
                      value={newResponse.estimatedTime}
                      onChange={(e) => setNewResponse(prev => ({ ...prev, estimatedTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 2-3 hours"
                    />
                  </div>
                </div>

                {/* Response Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Images (Optional)
                  </label>
                  
                  {newResponse.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {newResponse.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, 'response')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => responseFileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Upload portfolio images to showcase your work</p>
                  </button>
                  
                  <input
                    ref={responseFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, 'response')}
                    className="hidden"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Reward:</strong> Earn 25 Flixbits for sending this quote!
                  </p>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowResponseModal(null)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                  >
                    Send Quote & Earn 25 FB
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{showChatModal.request.title}</h2>
                  <p className="text-sm text-gray-600">Chat with {showChatModal.response.providerName}</p>
                </div>
                <button
                  onClick={() => setShowChatModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto" id="chat-messages">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'offer' ? (
                      <div className={`max-w-xs lg:max-w-md rounded-lg border-2 ${
                        message.senderId === user?.id
                          ? 'border-purple-200 bg-purple-50'
                          : 'border-blue-200 bg-blue-50'
                      }`}>
                        <div className="p-3 border-b border-gray-200 bg-white bg-opacity-50">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Price Offer</span>
                            <span className="font-bold text-green-600">{message.offerDetails?.price} FB</span>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-gray-700 mb-2">{message.offerDetails?.description}</p>
                          <p className="text-xs text-gray-500 mb-2">
                            {message.timestamp.toLocaleTimeString()} by {message.senderName}
                          </p>
                          
                          {message.offerDetails?.accepted ? (
                            <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Offer Accepted
                            </div>
                          ) : (
                            message.senderId !== user?.id && (
                              <button
                                onClick={() => handleAcceptOffer(message.id)}
                                className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                              >
                                Accept Offer
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="mb-2 flex justify-between items-center">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => {
                      const price = prompt('Enter your price offer (in Flixbits):');
                      const description = prompt('Enter offer description:');
                      if (price && description) {
                        handleSendOffer(parseInt(price), description);
                      }
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Send Offer</span>
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Photo</span>
                  </button>
                </div>
                
                <div className="text-xs text-gray-500">
                  {user?.userType === 'seller' || user?.userType === 'influencer' 
                    ? 'Respond to customer inquiries professionally'
                    : 'Discuss service details and pricing'}
                </div>
              </div>
              
              <div className="flex space-x-2 rtl:space-x-reverse">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add a useEffect to scroll to bottom of chat when messages change */}
      {useEffect(() => {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, [chatMessages])}
    </div>
  );
};

export default WishlistManager;