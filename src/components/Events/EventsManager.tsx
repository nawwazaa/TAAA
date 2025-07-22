import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Heart,
  Share2,
  Ticket,
  DollarSign,
  User,
  X,
  CheckCircle,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  category: string;
  price: number;
  maxAttendees: number;
  currentAttendees: number;
  createdBy: string;
  creatorName: string;
  creatorType: 'influencer' | 'seller' | 'user';
  image: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled';
  isPublic: boolean;
  requiresApproval: boolean;
  attendees: string[];
}

const EventsManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'browse' | 'my-events' | 'create'>('browse');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: {
      address: '',
      city: '',
    },
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    category: 'entertainment',
    price: 0,
    maxAttendees: 50,
    isPublic: true,
    requiresApproval: false,
    tags: ['']
  });

  const categories = [
    'all',
    'entertainment',
    'food',
    'shopping',
    'sports',
    'technology',
    'fashion',
    'health',
    'education',
    'networking'
  ];

  const sampleEvents: Event[] = [
    {
      id: 'event1',
      title: 'Fashion Week Dubai - Exclusive Preview',
      description: 'Join us for an exclusive preview of the latest fashion trends. Meet top designers, see runway shows, and get early access to new collections.',
      location: {
        address: 'Dubai Mall Fashion Avenue',
        city: 'Dubai',
        coordinates: { lat: 25.1972, lng: 55.2744 }
      },
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-15'),
      startTime: '18:00',
      endTime: '22:00',
      category: 'fashion',
      price: 150,
      maxAttendees: 100,
      currentAttendees: 67,
      createdBy: 'influencer1',
      creatorName: 'Sarah Fashion',
      creatorType: 'influencer',
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['fashion', 'exclusive', 'networking'],
      status: 'upcoming',
      isPublic: true,
      requiresApproval: true,
      attendees: []
    },
    {
      id: 'event2',
      title: 'Tech Startup Networking Night',
      description: 'Connect with entrepreneurs, investors, and tech enthusiasts. Pitch your ideas, find co-founders, and discover the latest innovations.',
      location: {
        address: 'Dubai Internet City',
        city: 'Dubai',
        coordinates: { lat: 25.0955, lng: 55.1673 }
      },
      startDate: new Date('2024-02-20'),
      endDate: new Date('2024-02-20'),
      startTime: '19:00',
      endTime: '23:00',
      category: 'technology',
      price: 0,
      maxAttendees: 200,
      currentAttendees: 134,
      createdBy: 'influencer2',
      creatorName: 'Tech Guru Mike',
      creatorType: 'influencer',
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['technology', 'networking', 'startup'],
      status: 'upcoming',
      isPublic: true,
      requiresApproval: false,
      attendees: []
    },
    {
      id: 'event3',
      title: 'Gourmet Food Festival',
      description: 'Taste amazing dishes from top chefs, learn cooking techniques, and enjoy live music. A perfect evening for food lovers!',
      location: {
        address: 'JBR Beach',
        city: 'Dubai',
        coordinates: { lat: 25.0657, lng: 55.1364 }
      },
      startDate: new Date('2024-02-25'),
      endDate: new Date('2024-02-26'),
      startTime: '16:00',
      endTime: '22:00',
      category: 'food',
      price: 75,
      maxAttendees: 300,
      currentAttendees: 89,
      createdBy: 'seller1',
      creatorName: 'Chef Antonio',
      creatorType: 'seller',
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['food', 'festival', 'music'],
      status: 'upcoming',
      isPublic: true,
      requiresApproval: false,
      attendees: []
    },
    {
      id: 'event4',
      title: 'Fitness Bootcamp Challenge',
      description: 'Join our intensive fitness bootcamp! Professional trainers, group workouts, and healthy lifestyle tips. All fitness levels welcome.',
      location: {
        address: 'Al Barsha Park',
        city: 'Dubai',
        coordinates: { lat: 25.1048, lng: 55.1962 }
      },
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-01'),
      startTime: '06:00',
      endTime: '08:00',
      category: 'health',
      price: 25,
      maxAttendees: 50,
      currentAttendees: 23,
      createdBy: 'influencer3',
      creatorName: 'Fitness Queen',
      creatorType: 'influencer',
      image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['fitness', 'health', 'outdoor'],
      status: 'upcoming',
      isPublic: true,
      requiresApproval: false,
      attendees: []
    }
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Award Flixbits for creating event
    const creationBonus = 200;
    updateUser({
      flixbits: (user?.flixbits || 0) + creationBonus
    });

    alert(`Event created successfully! You earned ${creationBonus} Flixbits for creating an event!`);
    
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      description: '',
      location: { address: '', city: '' },
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      category: 'entertainment',
      price: 0,
      maxAttendees: 50,
      isPublic: true,
      requiresApproval: false,
      tags: ['']
    });
  };

  const handleJoinEvent = (eventId: string, price: number) => {
    if (price > 0 && (user?.flixbits || 0) < price) {
      alert('Insufficient Flixbits to join this event');
      return;
    }

    if (price > 0) {
      updateUser({
        flixbits: (user?.flixbits || 0) - price
      });
    }

    setJoinedEvents(prev => [...prev, eventId]);
    alert(`Successfully joined the event! ${price > 0 ? `${price} Flixbits deducted.` : 'Free event!'}`);
  };

  const filteredEvents = sampleEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCreatorIcon = (creatorType: string) => {
    switch (creatorType) {
      case 'influencer': return <Star className="w-4 h-4 text-purple-500" />;
      case 'seller': return <DollarSign className="w-4 h-4 text-green-500" />;
      default: return <User className="w-4 h-4 text-blue-500" />;
    }
  };

  const addTag = () => {
    setNewEvent(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const updateTag = (index: number, value: string) => {
    setNewEvent(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const removeTag = (index: number) => {
    setNewEvent(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Events</h1>
        <p className="text-pink-100">Discover amazing events created by influencers and sellers</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'browse'
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Browse Events</span>
            </button>
            
            <button
              onClick={() => setActiveTab('my-events')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'my-events'
                  ? 'border-pink-500 text-pink-600 bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Ticket className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">My Events</span>
            </button>
            
            {(user?.userType === 'influencer' || user?.userType === 'seller') && (
              <button
                onClick={() => setActiveTab('create')}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'create'
                    ? 'border-pink-500 text-pink-600 bg-pink-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium text-sm md:text-base">Create Event</span>
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
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
                    placeholder="Search events..."
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="absolute top-2 left-2">
                        {event.price > 0 ? (
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {event.price} Flixbits
                          </span>
                        ) : (
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                            FREE
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-bold text-sm md:text-base text-gray-900 mb-2 line-clamp-2">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{event.startDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{event.location.address}, {event.location.city}</span>
                        </div>
                        <div className="flex items-center">
                          {getCreatorIcon(event.creatorType)}
                          <span className="ml-2 rtl:ml-0 rtl:mr-2">{event.creatorName}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setShowEventDetails(event)}
                          className="text-pink-600 hover:text-pink-700 font-medium text-xs md:text-sm"
                        >
                          View Details
                        </button>
                        
                        {joinedEvents.includes(event.id) ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            ✓ Joined
                          </span>
                        ) : (
                          <button
                            onClick={() => handleJoinEvent(event.id, event.price)}
                            disabled={event.currentAttendees >= event.maxAttendees}
                            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-2 rounded-lg text-xs md:text-sm font-medium hover:from-pink-600 hover:to-rose-600 transition-colors disabled:opacity-50"
                          >
                            <span className="hidden sm:inline">{event.price > 0 ? `Join (${event.price} Flixbits)` : 'Join Free'}</span>
                            <span className="sm:hidden">{event.price > 0 ? `${event.price} FB` : 'Free'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'my-events' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">My Joined Events</h2>
              
              {joinedEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Joined Yet</h3>
                  <p className="text-gray-600 mb-4">Browse events and join the ones you're interested in!</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-colors"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sampleEvents
                    .filter(event => joinedEvents.includes(event.id))
                    .map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">{event.title}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            <span>{event.startDate.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            <span>{event.location.address}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            ✓ Registered
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-700 hover:to-rose-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Event</span>
                </button>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-pink-800 mb-4">Event Creation Benefits</h3>
                <div className="space-y-2 text-pink-700">
                  <p>• Earn 200 Flixbits for creating an event</p>
                  <p>• Build your follower base and engagement</p>
                  <p>• Monetize your events with ticket sales</p>
                  <p>• Connect with your audience in person</p>
                  <p>• Promote your brand and services</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={showEventDetails.image} 
                alt={showEventDetails.title}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={() => setShowEventDetails(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{showEventDetails.title}</h2>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(showEventDetails.status)}`}>
                  {showEventDetails.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{showEventDetails.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">{showEventDetails.startDate.toLocaleDateString()} - {showEventDetails.endDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-gray-600">{showEventDetails.startTime} - {showEventDetails.endTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{showEventDetails.location.address}, {showEventDetails.location.city}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-gray-600">{showEventDetails.price > 0 ? `${showEventDetails.price} Flixbits` : 'Free'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Attendees</p>
                      <p className="text-gray-600">{showEventDetails.currentAttendees}/{showEventDetails.maxAttendees}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {getCreatorIcon(showEventDetails.creatorType)}
                    <div className="ml-3 rtl:ml-0 rtl:mr-3">
                      <p className="font-medium">Created by</p>
                      <p className="text-gray-600">{showEventDetails.creatorName}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {showEventDetails.tags.map((tag, index) => (
                  <span key={index} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <button className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-gray-800">
                    <Heart className="w-5 h-5" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-gray-800">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
                
                {joinedEvents.includes(showEventDetails.id) ? (
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                    ✓ Already Joined
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      handleJoinEvent(showEventDetails.id, showEventDetails.price);
                      setShowEventDetails(null);
                    }}
                    disabled={showEventDetails.currentAttendees >= showEventDetails.maxAttendees}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-colors disabled:opacity-50"
                  >
                    {showEventDetails.price > 0 ? `Join Event (${showEventDetails.price} Flixbits)` : 'Join Free Event'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={newEvent.location.address}
                      onChange={(e) => setNewEvent(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, address: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={newEvent.location.city}
                      onChange={(e) => setNewEvent(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, city: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (Flixbits)
                    </label>
                    <input
                      type="number"
                      value={newEvent.price}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Attendees
                    </label>
                    <input
                      type="number"
                      value={newEvent.maxAttendees}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 50 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  {newEvent.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder={`Tag ${index + 1}`}
                      />
                      {newEvent.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTag}
                    className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                  >
                    + Add Tag
                  </button>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newEvent.isPublic}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="mr-2 rtl:mr-0 rtl:ml-2"
                    />
                    <span className="text-sm text-gray-700">Public Event</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newEvent.requiresApproval}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, requiresApproval: e.target.checked }))}
                      className="mr-2 rtl:mr-0 rtl:ml-2"
                    />
                    <span className="text-sm text-gray-700">Requires Approval</span>
                  </label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Reward:</strong> Earn 200 Flixbits for creating an event!
                  </p>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-colors"
                  >
                    Create Event
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

export default EventsManager;