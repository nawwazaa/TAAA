import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Brain, 
  Users, 
  Target, 
  Clock, 
  MapPin, 
  Tag, 
  BarChart3, 
  Settings,
  Zap,
  Lightbulb,
  Cpu,
  Layers,
  Sliders,
  Play,
  Save,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  User,
  Star,
  Heart,
  ShoppingBag,
  Calendar,
  Smartphone,
  Wifi
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    interests?: string[];
    locations?: string[];
    userTypes?: string[];
    minAge?: number;
    maxAge?: number;
    minFlixbits?: number;
    activityLevel?: 'low' | 'medium' | 'high';
    purchaseHistory?: boolean;
    referralCount?: number;
    joinedBefore?: Date;
  };
  estimatedReach: number;
  createdAt: Date;
  lastUsed?: Date;
}

interface AlgorithmInsight {
  id: string;
  title: string;
  description: string;
  category: 'timing' | 'location' | 'interest' | 'behavior' | 'content';
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high';
  recommendedAction: string;
  createdAt: Date;
}

interface SimulationResult {
  segmentId: string;
  segmentName: string;
  estimatedReach: number;
  estimatedEngagement: number;
  estimatedConversions: number;
  optimalSendTime: string;
  locationHotspots: string[];
  contentRecommendations: string[];
}

const NotificationAlgorithm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'segments' | 'insights' | 'simulation' | 'settings'>('overview');
  const [showCreateSegment, setShowCreateSegment] = useState(false);
  const [showSegmentDetails, setShowSegmentDetails] = useState<UserSegment | null>(null);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null);
  
  // Algorithm parameters
  const [algorithmParams, setAlgorithmParams] = useState({
    timingWeight: 80,
    locationWeight: 85,
    interestWeight: 90,
    behaviorWeight: 95,
    socialWeight: 75,
    contentWeight: 85,
    engagementThreshold: 65,
    maxNotificationsPerDay: 3,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    minLocationAccuracy: 500, // meters
    enabledFactors: {
      timing: true,
      location: true,
      interests: true,
      behavior: true,
      social: true,
      content: true
    }
  });

  // Sample user segments
  const [userSegments, setUserSegments] = useState<UserSegment[]>([
    {
      id: 'segment_001',
      name: 'Active Food Enthusiasts',
      description: 'Users interested in food & dining with high activity levels',
      criteria: {
        interests: ['Food & Dining'],
        activityLevel: 'high',
        purchaseHistory: true
      },
      estimatedReach: 2450,
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'segment_002',
      name: 'Tech-Savvy Shoppers',
      description: 'Users interested in technology who have made purchases',
      criteria: {
        interests: ['Technology', 'Shopping'],
        minFlixbits: 500,
        purchaseHistory: true
      },
      estimatedReach: 1850,
      createdAt: new Date('2024-01-16')
    },
    {
      id: 'segment_003',
      name: 'Dubai Fashion Followers',
      description: 'Fashion enthusiasts in Dubai area',
      criteria: {
        interests: ['Fashion'],
        locations: ['Dubai'],
        userTypes: ['user', 'influencer']
      },
      estimatedReach: 3200,
      createdAt: new Date('2024-01-17'),
      lastUsed: new Date('2024-01-20')
    },
    {
      id: 'segment_004',
      name: 'New App Users',
      description: 'Users who joined in the last 30 days',
      criteria: {
        joinedBefore: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        activityLevel: 'low'
      },
      estimatedReach: 5600,
      createdAt: new Date('2024-01-18')
    },
    {
      id: 'segment_005',
      name: 'Top Referrers',
      description: 'Users who have referred at least 5 other users',
      criteria: {
        referralCount: 5,
        minFlixbits: 1000
      },
      estimatedReach: 780,
      createdAt: new Date('2024-01-19')
    }
  ]);

  // Sample algorithm insights
  const [algorithmInsights, setAlgorithmInsights] = useState<AlgorithmInsight[]>([
    {
      id: 'insight_001',
      title: 'Optimal Timing for Dubai Users',
      description: 'Users in Dubai show 35% higher engagement when notifications are sent between 6-8 PM on weekdays.',
      category: 'timing',
      confidence: 92,
      impact: 'high',
      recommendedAction: 'Schedule notifications for Dubai users between 6-8 PM on weekdays.',
      createdAt: new Date('2024-01-20')
    },
    {
      id: 'insight_002',
      title: 'Location-Based Engagement',
      description: 'Users near shopping malls show 42% higher click-through rates for retail offers.',
      category: 'location',
      confidence: 88,
      impact: 'high',
      recommendedAction: 'Target users within 1km of major shopping malls for retail promotions.',
      createdAt: new Date('2024-01-19')
    },
    {
      id: 'insight_003',
      title: 'Interest Correlation',
      description: '78% of users interested in Food & Dining also engage with Entertainment content.',
      category: 'interest',
      confidence: 85,
      impact: 'medium',
      recommendedAction: 'Cross-promote Entertainment offers to Food & Dining enthusiasts.',
      createdAt: new Date('2024-01-18')
    },
    {
      id: 'insight_004',
      title: 'Behavioral Pattern',
      description: 'Users who have participated in at least 3 tournaments are 65% more likely to engage with game predictions.',
      category: 'behavior',
      confidence: 90,
      impact: 'medium',
      recommendedAction: 'Prioritize game prediction notifications for active tournament participants.',
      createdAt: new Date('2024-01-17')
    },
    {
      id: 'insight_005',
      title: 'Content Optimization',
      description: 'Notifications with emojis in the title have 28% higher open rates across all user segments.',
      category: 'content',
      confidence: 82,
      impact: 'medium',
      recommendedAction: 'Include relevant emojis in notification titles for higher engagement.',
      createdAt: new Date('2024-01-16')
    }
  ]);

  const [newSegment, setNewSegment] = useState<Partial<UserSegment>>({
    name: '',
    description: '',
    criteria: {
      interests: [],
      locations: [],
      userTypes: [],
      activityLevel: 'medium'
    }
  });

  const availableInterests = [
    'Food & Dining',
    'Shopping',
    'Entertainment',
    'Sports',
    'Technology',
    'Travel',
    'Fashion',
    'Health & Fitness',
    'Books & Education',
    'Music & Arts'
  ];

  const availableLocations = [
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Riyadh',
    'Jeddah',
    'Doha',
    'Kuwait City',
    'Manama',
    'Muscat'
  ];

  const handleCreateSegment = () => {
    if (!newSegment.name || !newSegment.description) {
      alert('Please provide a name and description for the segment');
      return;
    }

    const segment: UserSegment = {
      id: `segment_${Date.now()}`,
      name: newSegment.name,
      description: newSegment.description,
      criteria: newSegment.criteria || {},
      estimatedReach: Math.floor(Math.random() * 5000) + 500, // Simulated reach
      createdAt: new Date()
    };

    setUserSegments(prev => [...prev, segment]);
    setShowCreateSegment(false);
    setNewSegment({
      name: '',
      description: '',
      criteria: {
        interests: [],
        locations: [],
        userTypes: [],
        activityLevel: 'medium'
      }
    });

    alert('User segment created successfully!');
  };

  const toggleInterest = (interest: string) => {
    setNewSegment(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        interests: prev.criteria?.interests?.includes(interest)
          ? prev.criteria.interests.filter(i => i !== interest)
          : [...(prev.criteria?.interests || []), interest]
      }
    }));
  };

  const toggleLocation = (location: string) => {
    setNewSegment(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        locations: prev.criteria?.locations?.includes(location)
          ? prev.criteria.locations.filter(l => l !== location)
          : [...(prev.criteria?.locations || []), location]
      }
    }));
  };

  const toggleUserType = (userType: string) => {
    setNewSegment(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        userTypes: prev.criteria?.userTypes?.includes(userType)
          ? prev.criteria.userTypes.filter(t => t !== userType)
          : [...(prev.criteria?.userTypes || []), userType]
      }
    }));
  };

  const runSimulation = () => {
    if (!showSegmentDetails) return;
    
    setIsRunningSimulation(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const result: SimulationResult = {
        segmentId: showSegmentDetails.id,
        segmentName: showSegmentDetails.name,
        estimatedReach: showSegmentDetails.estimatedReach,
        estimatedEngagement: Math.floor(showSegmentDetails.estimatedReach * 0.35), // 35% engagement rate
        estimatedConversions: Math.floor(showSegmentDetails.estimatedReach * 0.35 * 0.25), // 25% conversion of engaged users
        optimalSendTime: '18:30 - 20:30',
        locationHotspots: ['Dubai Mall', 'Mall of Emirates', 'City Centre Deira'],
        contentRecommendations: [
          'Use emojis in title for 28% higher open rates',
          'Include personalized offers for 42% higher conversion',
          'Add urgency ("Limited time") for 35% higher click-through'
        ]
      };
      
      setSimulationResults(result);
      setIsRunningSimulation(false);
    }, 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'timing': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'location': return <MapPin className="w-5 h-5 text-red-500" />;
      case 'interest': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'behavior': return <User className="w-5 h-5 text-purple-500" />;
      case 'content': return <Tag className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">🧠 Smart Notification AI</h1>
            <p className="text-indigo-100">Advanced algorithm for intelligent push notification targeting</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Brain className="w-5 h-5" />
              <span className="font-medium">Algorithm Overview</span>
            </button>
            
            <button
              onClick={() => setActiveTab('segments')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'segments'
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">User Segments</span>
            </button>
            
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'insights'
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              <span className="font-medium">AI Insights</span>
            </button>
            
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'simulation'
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Play className="w-5 h-5" />
              <span className="font-medium">Simulation</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Algorithm Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Algorithm Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Smart Notification Algorithm</h2>
                  <p className="text-gray-600">AI-powered targeting similar to Facebook's suggestion system</p>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </div>
              </div>

              {/* Algorithm Components */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Timing Optimization</h3>
                      <p className="text-sm text-gray-600">Identifies optimal send times</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Analyzes user activity patterns</p>
                    <p>• Respects quiet hours and time zones</p>
                    <p>• Adapts to changing behavior</p>
                    <p>• Prevents notification fatigue</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Weight: {algorithmParams.timingWeight}%</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${algorithmParams.timingWeight}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Location Intelligence</h3>
                      <p className="text-sm text-gray-600">Geo-targeted notifications</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Real-time location tracking</p>
                    <p>• Proximity to relevant businesses</p>
                    <p>• Geofencing capabilities</p>
                    <p>• Historical location patterns</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Weight: {algorithmParams.locationWeight}%</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 rounded-full" 
                        style={{ width: `${algorithmParams.locationWeight}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                    <div className="bg-pink-100 p-3 rounded-lg">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Interest Mapping</h3>
                      <p className="text-sm text-gray-600">Preference-based targeting</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• User interest analysis</p>
                    <p>• Content affinity scoring</p>
                    <p>• Category correlation</p>
                    <p>• Interest strength measurement</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Weight: {algorithmParams.interestWeight}%</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-600 rounded-full" 
                        style={{ width: `${algorithmParams.interestWeight}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Behavioral Analysis</h3>
                      <p className="text-sm text-gray-600">Action-based targeting</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Purchase history analysis</p>
                    <p>• App usage patterns</p>
                    <p>• Engagement scoring</p>
                    <p>• Conversion prediction</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Weight: {algorithmParams.behaviorWeight}%</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-600 rounded-full" 
                        style={{ width: `${algorithmParams.behaviorWeight}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Social Connections</h3>
                      <p className="text-sm text-gray-600">Relationship-based targeting</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Friend/follower analysis</p>
                    <p>• Influencer relationships</p>
                    <p>• Social graph mapping</p>
                    <p>• Group behavior patterns</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Weight: {algorithmParams.socialWeight}%</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-600 rounded-full" 
                        style={{ width: `${algorithmParams.socialWeight}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Tag className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Content Optimization</h3>
                      <p className="text-sm text-gray-600">Message effectiveness</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Title/message optimization</p>
                    <p>• A/B testing automation</p>
                    <p>• Emoji impact analysis</p>
                    <p>• Call-to-action optimization</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Weight: {algorithmParams.contentWeight}%</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full" 
                        style={{ width: `${algorithmParams.contentWeight}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-4">How the Algorithm Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-900 mb-1">Data Collection & Analysis</h4>
                      <p className="text-indigo-800">The algorithm continuously collects and analyzes user data across multiple dimensions: interests, location patterns, app usage, social connections, and engagement history.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-900 mb-1">Multi-factor Scoring</h4>
                      <p className="text-indigo-800">Each potential notification is scored based on timing relevance, location proximity, interest match, behavioral patterns, social connections, and content optimization.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-900 mb-1">Predictive Modeling</h4>
                      <p className="text-indigo-800">Machine learning models predict engagement likelihood for each user-notification pair, optimizing for opens, clicks, and conversions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-900 mb-1">Continuous Learning</h4>
                      <p className="text-indigo-800">The system continuously learns from user interactions, improving targeting accuracy over time and adapting to changing user preferences.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Segments */}
          {activeTab === 'segments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">User Segments</h2>
                <button
                  onClick={() => setShowCreateSegment(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Users className="w-5 h-5" />
                  <span>Create Segment</span>
                </button>
              </div>

              {/* Segments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSegments.map((segment) => (
                  <div key={segment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">{segment.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{segment.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {segment.criteria.interests && segment.criteria.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {segment.criteria.interests.map((interest) => (
                            <span key={interest} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {segment.criteria.locations && segment.criteria.locations.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {segment.criteria.locations.map((location) => (
                            <span key={location} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {location}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {segment.criteria.activityLevel && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          {segment.criteria.activityLevel} activity
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>Reach: {segment.estimatedReach.toLocaleString()} users</span>
                      <span>Created: {segment.createdAt.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => {
                          setShowSegmentDetails(segment);
                          setSimulationResults(null);
                        }}
                        className="flex-1 bg-indigo-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
                      >
                        View Details
                      </button>
                      <button className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">AI-Generated Insights</h2>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search insights..."
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="all">All Categories</option>
                  <option value="timing">Timing</option>
                  <option value="location">Location</option>
                  <option value="interest">Interests</option>
                  <option value="behavior">Behavior</option>
                  <option value="content">Content</option>
                </select>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="all">All Impact Levels</option>
                  <option value="high">High Impact</option>
                  <option value="medium">Medium Impact</option>
                  <option value="low">Low Impact</option>
                </select>
              </div>

              <div className="space-y-4">
                {algorithmInsights.map((insight) => (
                  <div key={insight.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4 rtl:mr-0 rtl:ml-4">
                        {getCategoryIcon(insight.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900">{insight.title}</h3>
                          <span className={`font-medium ${getImpactColor(insight.impact)}`}>
                            {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{insight.description}</p>
                        
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Lightbulb className="w-5 h-5 text-indigo-600" />
                            <p className="text-indigo-800 font-medium">Recommended Action:</p>
                          </div>
                          <p className="text-indigo-700 mt-1">{insight.recommendedAction}</p>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-gray-600">Confidence:</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  insight.confidence > 90 ? 'bg-green-600' :
                                  insight.confidence > 80 ? 'bg-blue-600' :
                                  insight.confidence > 70 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${insight.confidence}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{insight.confidence}%</span>
                          </div>
                          <span className="text-gray-500">Generated: {insight.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulation */}
          {activeTab === 'simulation' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Campaign Simulation</h2>
              
              {!showSegmentDetails ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="mb-4">
                    <Play className="w-16 h-16 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Segment to Simulate</h3>
                  <p className="text-gray-600 mb-4">Choose a user segment from the Segments tab to run a notification campaign simulation.</p>
                  <button
                    onClick={() => setActiveTab('segments')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Go to Segments
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{showSegmentDetails.name}</h3>
                        <p className="text-gray-600">{showSegmentDetails.description}</p>
                      </div>
                      <button
                        onClick={() => setShowSegmentDetails(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">Estimated Reach</p>
                        <p className="text-2xl font-bold text-gray-900">{showSegmentDetails.estimatedReach.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="text-lg font-medium text-gray-900">{showSegmentDetails.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">Last Used</p>
                        <p className="text-lg font-medium text-gray-900">{showSegmentDetails.lastUsed ? showSegmentDetails.lastUsed.toLocaleDateString() : 'Never'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium text-gray-900">Segment Criteria:</h4>
                      <div className="space-y-2">
                        {showSegmentDetails.criteria.interests && showSegmentDetails.criteria.interests.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Interests:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {showSegmentDetails.criteria.interests.map((interest) => (
                                <span key={interest} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {showSegmentDetails.criteria.locations && showSegmentDetails.criteria.locations.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Locations:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {showSegmentDetails.criteria.locations.map((location) => (
                                <span key={location} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {location}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {showSegmentDetails.criteria.userTypes && showSegmentDetails.criteria.userTypes.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">User Types:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {showSegmentDetails.criteria.userTypes.map((type) => (
                                <span key={type} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs capitalize">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {showSegmentDetails.criteria.activityLevel && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Activity Level:</span>
                            <span className="ml-2 rtl:ml-0 rtl:mr-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs capitalize">
                              {showSegmentDetails.criteria.activityLevel}
                            </span>
                          </div>
                        )}
                        
                        {showSegmentDetails.criteria.minFlixbits && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Minimum Flixbits:</span>
                            <span className="ml-2 rtl:ml-0 rtl:mr-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                              {showSegmentDetails.criteria.minFlixbits} FB
                            </span>
                          </div>
                        )}
                        
                        {showSegmentDetails.criteria.referralCount && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Minimum Referrals:</span>
                            <span className="ml-2 rtl:ml-0 rtl:mr-2 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                              {showSegmentDetails.criteria.referralCount}+ referrals
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        onClick={runSimulation}
                        disabled={isRunningSimulation}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        {isRunningSimulation ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Running Simulation...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            <span>Run Notification Simulation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Simulation Results */}
                  {simulationResults && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-indigo-900 mb-4">Simulation Results</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Estimated Reach</p>
                            <p className="text-3xl font-bold text-indigo-600">{simulationResults.estimatedReach.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Total users in segment</p>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Estimated Engagement</p>
                            <p className="text-3xl font-bold text-green-600">{simulationResults.estimatedEngagement.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{Math.round((simulationResults.estimatedEngagement / simulationResults.estimatedReach) * 100)}% of users</p>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Estimated Conversions</p>
                            <p className="text-3xl font-bold text-purple-600">{simulationResults.estimatedConversions.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{Math.round((simulationResults.estimatedConversions / simulationResults.estimatedEngagement) * 100)}% of engaged users</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <Clock className="w-5 h-5 text-indigo-600 mr-2 rtl:mr-0 rtl:ml-2" />
                            Optimal Send Time
                          </h4>
                          <p className="text-lg font-medium text-indigo-600 mb-2">{simulationResults.optimalSendTime}</p>
                          <p className="text-sm text-gray-600">Based on historical engagement patterns for this segment</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <MapPin className="w-5 h-5 text-indigo-600 mr-2 rtl:mr-0 rtl:ml-2" />
                            Location Hotspots
                          </h4>
                          <div className="space-y-2">
                            {simulationResults.locationHotspots.map((location, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2 rtl:mr-0 rtl:ml-2"></div>
                                <span className="text-gray-700">{location}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <Lightbulb className="w-5 h-5 text-indigo-600 mr-2 rtl:mr-0 rtl:ml-2" />
                          Content Recommendations
                        </h4>
                        <div className="space-y-2">
                          {simulationResults.contentRecommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-xs text-indigo-600 font-bold mr-2 rtl:mr-0 rtl:ml-2 mt-0.5">
                                {index + 1}
                              </div>
                              <span className="text-gray-700">{recommendation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-center space-x-4 rtl:space-x-reverse">
                        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                          Create Campaign with These Settings
                        </button>
                        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                          Export Results
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Algorithm Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Algorithm Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weighting Factors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Factor Weights</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-700">Timing Weight</label>
                        <span className="text-sm text-gray-600">{algorithmParams.timingWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={algorithmParams.timingWeight}
                        onChange={(e) => setAlgorithmParams(prev => ({ ...prev, timingWeight: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-700">Location Weight</label>
                        <span className="text-sm text-gray-600">{algorithmParams.locationWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={algorithmParams.locationWeight}
                        onChange={(e) => setAlgorithmParams(prev => ({ ...prev, locationWeight: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-700">Interest Weight</label>
                        <span className="text-sm text-gray-600">{algorithmParams.interestWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={algorithmParams.interestWeight}
                        onChange={(e) => setAlgorithmParams(prev => ({ ...prev, interestWeight: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-700">Behavior Weight</label>
                        <span className="text-sm text-gray-600">{algorithmParams.behaviorWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={algorithmParams.behaviorWeight}
                        onChange={(e) => setAlgorithmParams(prev => ({ ...prev, behaviorWeight: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-700">Social Weight</label>
                        <span className="text-sm text-gray-600">{algorithmParams.socialWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={algorithmParams.socialWeight}
                        onChange={(e) => setAlgorithmParams(prev => ({ ...prev, socialWeight: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-700">Content Weight</label>
                        <span className="text-sm text-gray-600">{algorithmParams.contentWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={algorithmParams.contentWeight}
                        onChange={(e) => setAlgorithmParams(prev => ({ ...prev, contentWeight: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Limits */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Limits</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Notifications Per Day
                      </label>
                      <input
                        type="number"
                        value={algorithmParams.maxNotificationsPerDay}
                        onChange={(e) => setAlgorithmParams(prev => ({ ...prev, maxNotificationsPerDay: parseInt(e.target.value) }))}
                        min="1"
                        max="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Engagement Threshold (%)
                      </label>
                      <input
                        type="number"
                        value={algorithmParams.engagementThreshold}
                        onChange={(e) => setAlgorithmParams(prev => ({ ...prev, engagementThreshold: parseInt(e.target.value) }))}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum predicted engagement score to send notification</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quiet Hours Start
                        </label>
                        <input
                          type="time"
                          value={algorithmParams.quietHoursStart}
                          onChange={(e) => setAlgorithmParams(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quiet Hours End
                        </label>
                        <input
                          type="time"
                          value={algorithmParams.quietHoursEnd}
                          onChange={(e) => setAlgorithmParams(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Location Accuracy (meters)
                      </label>
                      <input
                        type="number"
                        value={algorithmParams.minLocationAccuracy}
                        onChange={(e) => setAlgorithmParams(prev => ({ ...prev, minLocationAccuracy: parseInt(e.target.value) }))}
                        min="100"
                        max="5000"
                        step="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enabled Factors */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enabled Factors</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <label className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        algorithmParams.enabledFactors.timing ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Clock className={`w-6 h-6 ${
                          algorithmParams.enabledFactors.timing ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Timing</span>
                      <input
                        type="checkbox"
                        checked={algorithmParams.enabledFactors.timing}
                        onChange={(e) => setAlgorithmParams(prev => ({
                          ...prev,
                          enabledFactors: {
                            ...prev.enabledFactors,
                            timing: e.target.checked
                          }
                        }))}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full ${
                        algorithmParams.enabledFactors.timing ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          algorithmParams.enabledFactors.timing ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <label className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        algorithmParams.enabledFactors.location ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <MapPin className={`w-6 h-6 ${
                          algorithmParams.enabledFactors.location ? 'text-red-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Location</span>
                      <input
                        type="checkbox"
                        checked={algorithmParams.enabledFactors.location}
                        onChange={(e) => setAlgorithmParams(prev => ({
                          ...prev,
                          enabledFactors: {
                            ...prev.enabledFactors,
                            location: e.target.checked
                          }
                        }))}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full ${
                        algorithmParams.enabledFactors.location ? 'bg-red-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          algorithmParams.enabledFactors.location ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <label className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        algorithmParams.enabledFactors.interests ? 'bg-pink-100' : 'bg-gray-100'
                      }`}>
                        <Heart className={`w-6 h-6 ${
                          algorithmParams.enabledFactors.interests ? 'text-pink-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Interests</span>
                      <input
                        type="checkbox"
                        checked={algorithmParams.enabledFactors.interests}
                        onChange={(e) => setAlgorithmParams(prev => ({
                          ...prev,
                          enabledFactors: {
                            ...prev.enabledFactors,
                            interests: e.target.checked
                          }
                        }))}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full ${
                        algorithmParams.enabledFactors.interests ? 'bg-pink-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          algorithmParams.enabledFactors.interests ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <label className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        algorithmParams.enabledFactors.behavior ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <User className={`w-6 h-6 ${
                          algorithmParams.enabledFactors.behavior ? 'text-purple-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Behavior</span>
                      <input
                        type="checkbox"
                        checked={algorithmParams.enabledFactors.behavior}
                        onChange={(e) => setAlgorithmParams(prev => ({
                          ...prev,
                          enabledFactors: {
                            ...prev.enabledFactors,
                            behavior: e.target.checked
                          }
                        }))}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full ${
                        algorithmParams.enabledFactors.behavior ? 'bg-purple-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          algorithmParams.enabledFactors.behavior ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <label className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        algorithmParams.enabledFactors.social ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <Users className={`w-6 h-6 ${
                          algorithmParams.enabledFactors.social ? 'text-yellow-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Social</span>
                      <input
                        type="checkbox"
                        checked={algorithmParams.enabledFactors.social}
                        onChange={(e) => setAlgorithmParams(prev => ({
                          ...prev,
                          enabledFactors: {
                            ...prev.enabledFactors,
                            social: e.target.checked
                          }
                        }))}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full ${
                        algorithmParams.enabledFactors.social ? 'bg-yellow-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          algorithmParams.enabledFactors.social ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <label className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        algorithmParams.enabledFactors.content ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Tag className={`w-6 h-6 ${
                          algorithmParams.enabledFactors.content ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Content</span>
                      <input
                        type="checkbox"
                        checked={algorithmParams.enabledFactors.content}
                        onChange={(e) => setAlgorithmParams(prev => ({
                          ...prev,
                          enabledFactors: {
                            ...prev.enabledFactors,
                            content: e.target.checked
                          }
                        }))}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full ${
                        algorithmParams.enabledFactors.content ? 'bg-green-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          algorithmParams.enabledFactors.content ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Settings */}
              <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Reset to Defaults
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Segment Modal */}
      {showCreateSegment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create User Segment</h2>
                <button
                  onClick={() => setShowCreateSegment(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segment Name *
                  </label>
                  <input
                    type="text"
                    value={newSegment.name}
                    onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Active Food Enthusiasts"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newSegment.description}
                    onChange={(e) => setNewSegment(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe this user segment"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          newSegment.criteria?.interests?.includes(interest)
                            ? 'bg-pink-500 text-white border-pink-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locations
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableLocations.map((location) => (
                      <button
                        key={location}
                        type="button"
                        onClick={() => toggleLocation(location)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          newSegment.criteria?.locations?.includes(location)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['user', 'seller', 'influencer'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleUserType(type)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          newSegment.criteria?.userTypes?.includes(type)
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Level
                  </label>
                  <select
                    value={newSegment.criteria?.activityLevel || 'medium'}
                    onChange={(e) => setNewSegment(prev => ({
                      ...prev,
                      criteria: {
                        ...prev.criteria,
                        activityLevel: e.target.value as 'low' | 'medium' | 'high'
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="low">Low Activity</option>
                    <option value="medium">Medium Activity</option>
                    <option value="high">High Activity</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Flixbits
                    </label>
                    <input
                      type="number"
                      value={newSegment.criteria?.minFlixbits || ''}
                      onChange={(e) => setNewSegment(prev => ({
                        ...prev,
                        criteria: {
                          ...prev.criteria,
                          minFlixbits: parseInt(e.target.value) || undefined
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., 500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Referrals
                    </label>
                    <input
                      type="number"
                      value={newSegment.criteria?.referralCount || ''}
                      onChange={(e) => setNewSegment(prev => ({
                        ...prev,
                        criteria: {
                          ...prev.criteria,
                          referralCount: parseInt(e.target.value) || undefined
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateSegment(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSegment}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
                  >
                    Create Segment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationAlgorithm;