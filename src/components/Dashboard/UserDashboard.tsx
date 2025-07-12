import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Trophy, 
  Gift, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Bell, 
  QrCode,
  DollarSign,
  CheckCircle,
  Video,
  ThumbsUp,
  ThumbsDown,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Target,
  Award,
  Plus,
  Minus,
  RefreshCw,
  MessageCircle,
  Mic,
  Send,
  X,
  Calendar,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface VideoAd {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  creator: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  contestEndTime?: Date;
  isContest: boolean;
}

interface GamePrediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  gameDate: Date;
  gameTime: string;
  status: 'upcoming' | 'live' | 'finished';
  userPrediction?: 'home' | 'away' | 'draw';
}

const UserDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAction, setWalletAction] = useState<'buy' | 'sell' | 'redeem' | null>(null);
  const [amount, setAmount] = useState('');
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantType, setAssistantType] = useState<'chatgpt' | 'alexa' | 'siri' | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const subscriptionPackages = [
    {
      id: 'notification-basic',
      name: 'Push Notifications - Basic',
      type: 'notifications',
      price: 500,
      duration: '1 Month',
      features: [
        'Send notifications to your followers',
        'Basic targeting options',
        'Up to 10 notifications per month',
        'Basic analytics',
        'Text notifications only'
      ],
      color: 'from-blue-500 to-teal-500'
    },
    {
      id: 'notification-pro',
      name: 'Push Notifications - Pro',
      type: 'notifications',
      price: 1200,
      duration: '1 Month',
      features: [
        'Send notifications to followers + radius targeting',
        'Advanced location-based targeting',
        'Up to 50 notifications per month',
        'Detailed analytics & insights',
        'Rich media notifications (images, videos)',
        'Schedule notifications',
        'A/B testing capabilities'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'notification-enterprise',
      name: 'Push Notifications - Enterprise',
      type: 'notifications',
      price: 2500,
      duration: '1 Month',
      features: [
        'Unlimited notifications',
        'City-wide targeting',
        'Interest-based targeting',
        'Advanced demographics targeting',
        'Priority delivery',
        'Custom notification templates',
        'API access',
        'Dedicated support'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'contest-basic',
      name: 'Contest Creator - Basic',
      type: 'contests',
      price: 800,
      duration: '1 Month',
      features: [
        'Create video contests',
        'Create prediction contests',
        'Up to 5 contests per month',
        'Basic prize management',
        'Standard contest duration (7 days)',
        'Basic participant management'
      ],
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'contest-pro',
      name: 'Contest Creator - Pro',
      type: 'contests',
      price: 1800,
      duration: '1 Month',
      features: [
        'Create all types of contests',
        'Unlimited contests',
        'Custom contest duration',
        'Advanced prize management',
        'Sponsored contests',
        'Contest promotion tools',
        'Detailed analytics',
        'Custom branding'
      ],
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'premium-bundle',
      name: 'Premium Bundle',
      type: 'bundle',
      price: 3500,
      duration: '1 Month',
      originalPrice: 4500,
      features: [
        'All notification features (Enterprise)',
        'All contest creation features (Pro)',
        'Priority customer support',
        'Early access to new features',
        'Custom integrations',
        'Advanced analytics dashboard',
        'White-label options',
        'Dedicated account manager'
      ],
      color: 'from-gradient-to-r from-yellow-400 via-red-500 to-pink-500'
    }
  ];

  const handleSubscriptionPurchase = (packageId: string, price: number) => {
    if ((user?.flixbits || 0) < price) {
      alert('Insufficient Flixbits! Please buy more Flixbits first.');
      return;
    }

    updateUser({
      flixbits: (user?.flixbits || 0) - price
    });

    const packageName = subscriptionPackages.find(p => p.id === packageId)?.name;
    alert(`🎉 Successfully subscribed to ${packageName}! You can now use all the premium features.`);
    
    setShowSubscriptionModal(false);
    setSelectedPackage(null);
  };

  const videoAds: VideoAd[] = [
    {
      id: '1',
      title: 'Best Pizza in Town - Contest Entry',
      url: 'https://example.com/video1',
      thumbnail: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
      creator: 'Mario\'s Pizza',
      duration: 30,
      views: 1250,
      likes: 89,
      dislikes: 5,
      isContest: true,
      contestEndTime: new Date('2024-01-20T23:59:59')
    },
    {
      id: '2',
      title: 'Fashion Week Special Offers',
      url: 'https://example.com/video2',
      thumbnail: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
      creator: 'StyleHub',
      duration: 45,
      views: 890,
      likes: 67,
      dislikes: 3,
      isContest: false
    },
    {
      id: '3',
      title: 'Tech Gadgets Review - Vote for Best',
      url: 'https://example.com/video3',
      thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
      creator: 'TechReviewer',
      duration: 60,
      views: 2100,
      likes: 156,
      dislikes: 12,
      isContest: true,
      contestEndTime: new Date('2024-01-25T18:00:00')
    }
  ];

  const upcomingGames: GamePrediction[] = [
    {
      id: '1',
      homeTeam: 'Manchester United',
      awayTeam: 'Liverpool',
      league: 'Premier League',
      gameDate: new Date('2024-01-15'),
      gameTime: '15:00',
      status: 'upcoming'
    },
    {
      id: '2',
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      league: 'La Liga',
      gameDate: new Date('2024-01-16'),
      gameTime: '20:00',
      status: 'upcoming'
    }
  ];

  const upcomingTournaments = [
    {
      id: 1,
      name: 'Premier League Predictions',
      startDate: '2024-01-15',
      prize: '10,000 Flixbits',
      participants: 1250
    },
    {
      id: 2,
      name: 'Champions League Quarter Finals',
      startDate: '2024-01-20',
      prize: '25,000 Flixbits',
      participants: 890
    }
  ];

  const nearbyOffers = [
    {
      id: 1,
      title: 'Fresh Pizza - 30% Off',
      seller: 'Mario\'s Pizza',
      discount: 30,
      distance: '0.5 km',
      rating: 4.8,
      endTime: '2024-01-15T20:00:00'
    },
    {
      id: 2,
      title: 'Electronics Sale',
      seller: 'TechWorld',
      discount: 45,
      distance: '1.2 km',
      rating: 4.6,
      endTime: '2024-01-16T18:00:00'
    }
  ];

  useEffect(() => {
    // Auto-play next video every 30 seconds
    const interval = setInterval(() => {
      if (isPlaying && !isFullscreen) {
        setCurrentVideoIndex((prev) => (prev + 1) % videoAds.length);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isPlaying, isFullscreen, videoAds.length]);

  const currentVideo = videoAds[currentVideoIndex];

  const handleVideoAction = (action: 'like' | 'dislike') => {
    // Handle video rating
    console.log(`${action} video:`, currentVideo.id);
    // Update video likes/dislikes in real app
  };

  const handleWalletAction = () => {
    if (!walletAction || !amount) return;
    
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    let newBalance = user?.flixbits || 0;
    
    switch (walletAction) {
      case 'buy':
        // $0.10 per Flixbit
        newBalance += numAmount;
        alert(`Purchased ${numAmount} Flixbits for $${(numAmount * 0.1).toFixed(2)}`);
        break;
      case 'sell':
        if (newBalance >= numAmount) {
          newBalance -= numAmount;
          alert(`Sold ${numAmount} Flixbits for $${(numAmount * 0.08).toFixed(2)}`);
        } else {
          alert('Insufficient balance');
          return;
        }
        break;
      case 'redeem':
        if (newBalance >= numAmount) {
          newBalance -= numAmount;
          alert(`Redeemed ${numAmount} Flixbits for rewards`);
        } else {
          alert('Insufficient balance');
          return;
        }
        break;
    }

    updateUser({ flixbits: newBalance });
    setShowWalletModal(false);
    setAmount('');
    setWalletAction(null);
  };

  const openWalletModal = (action: 'buy' | 'sell' | 'redeem') => {
    setWalletAction(action);
    setShowWalletModal(true);
  };

  const openAssistant = (type: 'chatgpt' | 'alexa' | 'siri') => {
    setAssistantType(type);
    setShowAssistant(true);
    setChatMessages([
      {
        role: 'assistant',
        content: `Hello! I'm your ${type === 'chatgpt' ? 'ChatGPT' : type === 'alexa' ? 'Alexa' : 'Siri'} assistant. I can help you find nearby shops, events, offers, and answer any questions about FlixMarket. How can I assist you today?`
      }
    ]);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage = currentMessage.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setCurrentMessage('');

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('pizza') || lowerMessage.includes('food')) {
        response = "I found 3 pizza places near you:\n\n🍕 Mario's Pizza - 0.5km away, 30% off until 8 PM\n🍕 Tony's Pizzeria - 1.2km away, 4.8★ rating\n🍕 Pizza Palace - 0.8km away, Buy 1 Get 1 Free\n\nWould you like directions to any of these?";
      } else if (lowerMessage.includes('shop') || lowerMessage.includes('store')) {
        response = "Here are the top-rated shops in your area:\n\n🛍️ TechWorld - Electronics, 1.2km away, 45% sale\n👕 StyleHub - Fashion, 0.9km away, Weekend special\n📚 BookCorner - Books, 1.5km away, New arrivals\n\nAll these shops accept Flixbits as payment!";
      } else if (lowerMessage.includes('event') || lowerMessage.includes('tournament')) {
        response = "Upcoming events and tournaments:\n\n🏆 Premier League Predictions - Starts Jan 15, 10,000 Flixbits prize\n🎬 Video Contest - Ends in 3 days, Rate videos to win\n⚽ Champions League - Jan 20, 25,000 Flixbits prize\n\nYour prediction accuracy is 85% - you're eligible for free entry!";
      } else if (lowerMessage.includes('flixbit') || lowerMessage.includes('wallet')) {
        response = `Your current balance: ${user?.flixbits.toLocaleString()} Flixbits (≈$${((user?.flixbits || 0) * 0.1).toFixed(2)})\n\n💰 You can earn more by:\n• Watching video ads (+50 Flixbits)\n• Game predictions (+150 Flixbits)\n• Referring friends (+200 Flixbits)\n• Rating videos (+25 Flixbits)`;
      } else {
        response = `I understand you're asking about "${userMessage}". I can help you with:\n\n🔍 Finding nearby shops and restaurants\n🎯 Tournament and event information\n💰 Flixbits and wallet management\n🎬 Video contests and ratings\n📍 Location-based offers\n\nWhat specific information would you like?`;
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  const startVoiceRecognition = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setCurrentMessage("Find pizza places near me");
      setIsListening(false);
    }, 2000);
  };
  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Video Player Section - Top Third */}
      <div className="bg-black rounded-2xl overflow-hidden relative" style={{ height: '300px' }}>
        <div className="relative w-full h-full">
          <img
            src={currentVideo.thumbnail}
            alt={currentVideo.title}
            className="w-full h-full object-cover"
          />
          
          {/* Video Overlay Controls */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </button>
          </div>

          {/* Video Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h3 className="text-white font-bold text-lg mb-1">{currentVideo.title}</h3>
            <p className="text-gray-300 text-sm mb-2">by {currentVideo.creator}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <button
                  onClick={() => handleVideoAction('like')}
                  className="flex items-center space-x-1 rtl:space-x-reverse text-white hover:text-green-400 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{currentVideo.likes}</span>
                </button>
                <button
                  onClick={() => handleVideoAction('dislike')}
                  className="flex items-center space-x-1 rtl:space-x-reverse text-white hover:text-red-400 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm">{currentVideo.dislikes}</span>
                </button>
                {currentVideo.isContest && currentVideo.contestEndTime && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                    Contest ends: {currentVideo.contestEndTime.toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentVideoIndex((prev) => (prev - 1 + videoAds.length) % videoAds.length)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentVideoIndex((prev) => (prev + 1) % videoAds.length)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Video Indicators */}
          <div className="absolute top-4 right-4 flex space-x-1 rtl:space-x-reverse">
            {videoAds.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentVideoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">{t('welcomeBack')}, {user?.name}!</h1>
        <p className="text-blue-100">Discover amazing offers and win exciting prizes</p>
      </div>

      {/* Action Icons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button 
          onClick={() => {
            const event = new CustomEvent('navigate-to-tab', { detail: 'qr-scanner' });
            window.dispatchEvent(event);
          }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-lg mx-auto w-fit mb-3 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">QR Scanner</h3>
            <p className="text-sm text-gray-600">Scan QR codes</p>
          </div>
        </button>

        <button 
          onClick={() => {
            const event = new CustomEvent('navigate-to-tab', { detail: 'tournaments' });
            window.dispatchEvent(event);
          }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg mx-auto w-fit mb-3 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Game Predictions</h3>
            <p className="text-sm text-gray-600">Predict winners</p>
          </div>
        </button>

        <button 
          onClick={() => {
            const event = new CustomEvent('navigate-to-tab', { detail: 'video-contest' });
            window.dispatchEvent(event);
          }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg mx-auto w-fit mb-3 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Video Contest</h3>
            <p className="text-sm text-gray-600">Rate & compete</p>
          </div>
        </button>

        <button 
          onClick={() => {
            const event = new CustomEvent('navigate-to-tab', { detail: 'wallet-management' });
            window.dispatchEvent(event);
          }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg mx-auto w-fit mb-3 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Wallet</h3>
            <p className="text-sm text-gray-600">Manage Flixbits</p>
          </div>
        </button>

        <button 
          onClick={() => setShowAssistant(true)}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="text-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg mx-auto w-fit mb-3 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Assistant</h3>
            <p className="text-sm text-gray-600">Ask anything</p>
          </div>
        </button>

        <button 
          onClick={() => setShowSubscriptionModal(true)}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="text-center">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg mx-auto w-fit mb-3 group-hover:scale-110 transition-transform">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Subscriptions</h3>
            <p className="text-sm text-gray-600">Premium packages</p>
          </div>
        </button>

        <button 
          onClick={() => {
            const event = new CustomEvent('navigate-to-tab', { detail: 'events' });
            window.dispatchEvent(event);
          }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="text-center">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-lg mx-auto w-fit mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Events</h3>
            <p className="text-sm text-gray-600">Discover events</p>
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{t('totalFlixbits')}</p>
              <p className="text-3xl font-bold text-gray-900">{user?.flixbits.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{t('activeOffers')}</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Prediction Accuracy</p>
              <p className="text-3xl font-bold text-gray-900">85%</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Game Predictions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-yellow-500" />
          Quick Predictions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingGames.slice(0, 2).map((game) => (
            <div key={game.id} className="border border-gray-200 rounded-lg p-4">
              <div className="text-center mb-3">
                <h3 className="font-semibold text-gray-900">{game.homeTeam} vs {game.awayTeam}</h3>
                <p className="text-sm text-gray-600">{game.league}</p>
                <p className="text-sm text-gray-500">{game.gameDate.toLocaleDateString()} at {game.gameTime}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-center transition-colors">
                  <p className="text-sm font-medium text-blue-900">{game.homeTeam}</p>
                </button>
                <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 text-center transition-colors">
                  <p className="text-sm font-medium text-gray-900">Draw</p>
                </button>
                <button className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-2 text-center transition-colors">
                  <p className="text-sm font-medium text-red-900">{game.awayTeam}</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Tournaments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Award className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-yellow-500" />
          {t('upcomingTournaments')}
        </h2>
        <div className="space-y-4">
          {upcomingTournaments.map((tournament) => (
            <div key={tournament.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{tournament.name}</h3>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {tournament.prize}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600 space-x-4 rtl:space-x-reverse">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  {new Date(tournament.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  {tournament.participants} participants
                </div>
              </div>
              <button className="mt-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-colors">
                Join Tournament
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Offers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-green-500" />
          Nearby Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyOffers.map((offer) => (
            <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                  -{offer.discount}%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{offer.seller}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  {offer.distance}
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1 text-yellow-500" />
                  {offer.rating}
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-red-600 font-medium">
                  Ends: {new Date(offer.endTime).toLocaleDateString()}
                </span>
                <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-colors">
                  Claim Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Management Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Wallet className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-orange-500" />
                Wallet Management
              </h2>
              
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold mb-1">Current Balance</h3>
                <p className="text-2xl font-bold">{user?.flixbits.toLocaleString()} Flixbits</p>
                <p className="text-sm opacity-90">≈ ${((user?.flixbits || 0) * 0.1).toFixed(2)} USD</p>
              </div>

              {!walletAction ? (
                <div className="space-y-3">
                  <button
                    onClick={() => openWalletModal('buy')}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Buy Flixbits</span>
                  </button>
                  
                  <button
                    onClick={() => openWalletModal('sell')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <Minus className="w-5 h-5" />
                    <span>Sell Flixbits</span>
                  </button>
                  
                  <button
                    onClick={() => openWalletModal('redeem')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <Gift className="w-5 h-5" />
                    <span>Redeem Rewards</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount ({walletAction === 'buy' ? 'to purchase' : walletAction === 'sell' ? 'to sell' : 'to redeem'})
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                      min="1"
                    />
                    {walletAction === 'buy' && amount && (
                      <p className="text-sm text-gray-600 mt-1">
                        Cost: ${(parseInt(amount) * 0.1).toFixed(2)} USD
                      </p>
                    )}
                    {walletAction === 'sell' && amount && (
                      <p className="text-sm text-gray-600 mt-1">
                        You'll receive: ${(parseInt(amount) * 0.08).toFixed(2)} USD
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-3 rtl:space-x-reverse">
                    <button
                      onClick={() => {
                        setWalletAction(null);
                        setAmount('');
                      }}
                      className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleWalletAction}
                      disabled={!amount || parseInt(amount) <= 0}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              {!walletAction && (
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="w-full mt-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full h-[600px] flex flex-col">
            {!assistantType ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Choose Your AI Assistant</h2>
                  <button
                    onClick={() => setShowAssistant(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => openAssistant('chatgpt')}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-colors flex items-center space-x-3 rtl:space-x-reverse"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <div className="text-left rtl:text-right">
                      <div className="font-bold">ChatGPT Assistant</div>
                      <div className="text-sm opacity-90">Advanced AI for complex queries</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => openAssistant('alexa')}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center space-x-3 rtl:space-x-reverse"
                  >
                    <Mic className="w-6 h-6" />
                    <div className="text-left rtl:text-right">
                      <div className="font-bold">Alexa Assistant</div>
                      <div className="text-sm opacity-90">Voice-powered shopping helper</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => openAssistant('siri')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center space-x-3 rtl:space-x-reverse"
                  >
                    <Mic className="w-6 h-6" />
                    <div className="text-left rtl:text-right">
                      <div className="font-bold">Siri Assistant</div>
                      <div className="text-sm opacity-90">Smart recommendations & navigation</div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-t-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <MessageCircle className="w-6 h-6" />
                      <h2 className="text-lg font-bold capitalize">{assistantType} Assistant</h2>
                    </div>
                    <button
                      onClick={() => {
                        setShowAssistant(false);
                        setAssistantType(null);
                        setChatMessages([]);
                      }}
                      className="text-white hover:text-gray-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={`Ask ${assistantType} anything...`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={startVoiceRecognition}
                      disabled={isListening}
                      className={`p-2 rounded-lg transition-colors ${
                        isListening
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!currentMessage.trim()}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  {isListening && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      🎤 Listening... Speak now
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Subscription Packages Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Premium Subscription Packages</h2>
                  <p className="text-gray-600">Unlock powerful features for notifications and contest creation</p>
                </div>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Current Balance */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold mb-1">Your Current Balance</h3>
                <p className="text-2xl font-bold">{user?.flixbits.toLocaleString()} Flixbits</p>
                <p className="text-sm opacity-90">≈ ${((user?.flixbits || 0) * 0.1).toFixed(2)} USD</p>
              </div>

              {/* Package Categories */}
              <div className="space-y-8">
                {/* Push Notifications Packages */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Bell className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-blue-500" />
                    Push Notification Packages
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptionPackages.filter(pkg => pkg.type === 'notifications').map((pkg) => (
                      <div key={pkg.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all">
                        <div className={`bg-gradient-to-r ${pkg.color} text-white rounded-lg p-4 mb-4`}>
                          <h4 className="text-lg font-bold">{pkg.name}</h4>
                          <p className="text-2xl font-bold">{pkg.price.toLocaleString()} Flixbits</p>
                          <p className="text-sm opacity-90">{pkg.duration}</p>
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 rtl:mr-0 rtl:ml-2 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <button
                          onClick={() => handleSubscriptionPurchase(pkg.id, pkg.price)}
                          disabled={(user?.flixbits || 0) < pkg.price}
                          className={`w-full bg-gradient-to-r ${pkg.color} text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {(user?.flixbits || 0) < pkg.price ? 'Insufficient Flixbits' : 'Subscribe Now'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contest Creation Packages */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Trophy className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-purple-500" />
                    Contest Creation Packages
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subscriptionPackages.filter(pkg => pkg.type === 'contests').map((pkg) => (
                      <div key={pkg.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all">
                        <div className={`bg-gradient-to-r ${pkg.color} text-white rounded-lg p-4 mb-4`}>
                          <h4 className="text-lg font-bold">{pkg.name}</h4>
                          <p className="text-2xl font-bold">{pkg.price.toLocaleString()} Flixbits</p>
                          <p className="text-sm opacity-90">{pkg.duration}</p>
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 rtl:mr-0 rtl:ml-2 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <button
                          onClick={() => handleSubscriptionPurchase(pkg.id, pkg.price)}
                          disabled={(user?.flixbits || 0) < pkg.price}
                          className={`w-full bg-gradient-to-r ${pkg.color} text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {(user?.flixbits || 0) < pkg.price ? 'Insufficient Flixbits' : 'Subscribe Now'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium Bundle */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-yellow-500" />
                    Premium Bundle (Best Value!)
                  </h3>
                  <div className="max-w-2xl mx-auto">
                    {subscriptionPackages.filter(pkg => pkg.type === 'bundle').map((pkg) => (
                      <div key={pkg.id} className="border-4 border-yellow-400 rounded-xl p-6 bg-gradient-to-r from-yellow-50 to-orange-50 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                            BEST VALUE - Save 1,000 Flixbits!
                          </span>
                        </div>
                        
                        <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white rounded-lg p-6 mb-4 text-center">
                          <h4 className="text-2xl font-bold mb-2">{pkg.name}</h4>
                          <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                            {pkg.originalPrice && (
                              <p className="text-lg line-through opacity-75">{pkg.originalPrice.toLocaleString()} Flixbits</p>
                            )}
                            <p className="text-3xl font-bold">{pkg.price.toLocaleString()} Flixbits</p>
                          </div>
                          <p className="text-sm opacity-90">{pkg.duration}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {pkg.features.map((feature, index) => (
                            <div key={index} className="flex items-start text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 rtl:mr-0 rtl:ml-2 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => handleSubscriptionPurchase(pkg.id, pkg.price)}
                          disabled={(user?.flixbits || 0) < pkg.price}
                          className="w-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {(user?.flixbits || 0) < pkg.price ? 'Insufficient Flixbits' : 'Get Premium Bundle Now!'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features Explanation */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Package Features Explained</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
                  <div>
                    <h4 className="font-bold mb-2">🔔 Push Notifications:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Followers Only:</strong> Send to your followers</li>
                      <li>• <strong>Radius Targeting:</strong> Target users within specific distance</li>
                      <li>• <strong>City-wide:</strong> Reach entire city population</li>
                      <li>• <strong>Interest-based:</strong> Target by user interests</li>
                      <li>• <strong>Rich Media:</strong> Include images and videos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">🏆 Contest Creation:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Video Contests:</strong> Users submit videos</li>
                      <li>• <strong>Prediction Contests:</strong> Sports/game predictions</li>
                      <li>• <strong>Photo Contests:</strong> Image submissions</li>
                      <li>• <strong>Quiz Contests:</strong> Knowledge competitions</li>
                      <li>• <strong>Custom Prizes:</strong> Set Flixbits or physical rewards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;