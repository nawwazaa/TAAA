import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  Trophy, 
  Users, 
  ThumbsUp, 
  ThumbsDown, 
  Play,
  Upload,
  Link,
  X,
  Settings,
  Star,
  Eye,
  Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface VideoEntry {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  creator: string;
  creatorId: string;
  likes: number;
  dislikes: number;
  views: number;
  submittedAt: Date;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'other';
}

interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  prize: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'active' | 'ended';
  category: string;
  rules: string[];
}

const VideoContest: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'browse' | 'submit' | 'manage'>('browse');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCreateContestModal, setShowCreateContestModal] = useState(false);
  
  const [videoSubmission, setVideoSubmission] = useState({
    title: '',
    description: '',
    videoUrl: '',
    platform: 'youtube' as 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'other'
  });

  const [newContest, setNewContest] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    prize: '',
    maxParticipants: '',
    category: '',
    rules: ['']
  });

  const currentContest: Contest = {
    id: 'contest1',
    title: 'Best Local Business Showcase',
    description: 'Show off your favorite local business and win amazing prizes!',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-25'),
    prize: '10,000 Flixbits + Featured Promotion',
    maxParticipants: 100,
    currentParticipants: 23,
    status: 'active',
    category: 'Business',
    rules: [
      'Video must be original content',
      'Maximum duration: 60 seconds',
      'Must feature a local business',
      'No inappropriate content',
      'One submission per user'
    ]
  };

  const videoEntries: VideoEntry[] = [
    {
      id: '1',
      title: 'Mario\'s Pizza - Best in Town!',
      description: 'Amazing authentic Italian pizza made with love',
      videoUrl: 'https://youtube.com/watch?v=example1',
      thumbnail: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      creator: 'FoodLover23',
      creatorId: 'user123',
      likes: 89,
      dislikes: 5,
      views: 1250,
      submittedAt: new Date('2024-01-12'),
      platform: 'youtube'
    },
    {
      id: '2',
      title: 'TechWorld - Latest Gadgets Review',
      description: 'Check out the coolest tech gadgets at TechWorld store',
      videoUrl: 'https://tiktok.com/@user/video/example2',
      thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      creator: 'TechReviewer',
      creatorId: 'user456',
      likes: 156,
      dislikes: 12,
      views: 2100,
      submittedAt: new Date('2024-01-13'),
      platform: 'tiktok'
    },
    {
      id: '3',
      title: 'StyleHub Fashion Store Tour',
      description: 'Discover the latest fashion trends at StyleHub',
      videoUrl: 'https://instagram.com/reel/example3',
      thumbnail: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
      creator: 'FashionGuru',
      creatorId: 'user789',
      likes: 203,
      dislikes: 8,
      views: 3450,
      submittedAt: new Date('2024-01-14'),
      platform: 'instagram'
    }
  ];

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate video URL
    if (!videoSubmission.videoUrl || !videoSubmission.title) {
      alert('Please fill in all required fields');
      return;
    }

    // Award Flixbits for participation
    const participationBonus = 100;
    updateUser({
      flixbits: (user?.flixbits || 0) + participationBonus
    });

    alert(`Video submitted successfully! You earned ${participationBonus} Flixbits for participating!`);
    
    setShowSubmitModal(false);
    setVideoSubmission({
      title: '',
      description: '',
      videoUrl: '',
      platform: 'youtube'
    });
  };

  const handleCreateContest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContest.title || !newContest.startDate || !newContest.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    alert('Contest created successfully! It will be reviewed and published soon.');
    
    setShowCreateContestModal(false);
    setNewContest({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      prize: '',
      maxParticipants: '',
      category: '',
      rules: ['']
    });
  };

  const handleVote = (videoId: string, voteType: 'like' | 'dislike') => {
    // Award Flixbits for voting
    const voteBonus = 25;
    updateUser({
      flixbits: (user?.flixbits || 0) + voteBonus
    });

    alert(`Vote recorded! You earned ${voteBonus} Flixbits for rating this video.`);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return '📺';
      case 'tiktok':
        return '🎵';
      case 'instagram':
        return '📷';
      case 'facebook':
        return '👥';
      default:
        return '🎬';
    }
  };

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} days, ${hours} hours`;
    }
    return `${hours} hours`;
  };

  const addRule = () => {
    setNewContest(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const updateRule = (index: number, value: string) => {
    setNewContest(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const removeRule = (index: number) => {
    setNewContest(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Video Contest</h1>
        <p className="text-purple-100">Submit videos, rate others, and win amazing prizes!</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'browse'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Video className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Browse Videos</span>
            </button>
            
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'submit'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base">Submit Video</span>
            </button>
            
            {(user?.userType === 'seller' || user?.userType === 'influencer' || user?.email === 'admin@flixmarket.com') && (
              <button
                onClick={() => setActiveTab('manage')}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'manage'
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium text-sm md:text-base">Manage Contests</span>
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* Current Contest Info */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{currentContest.title}</h3>
                    <p className="text-purple-100 mb-3">{currentContest.description}</p>
                  </div>
                  <div className="text-right rtl:text-left">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <Trophy className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{currentContest.prize}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{getTimeRemaining(currentContest.endDate)}</p>
                    <p className="text-sm text-purple-200">Time Remaining</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentContest.currentParticipants}</p>
                    <p className="text-sm text-purple-200">Participants</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentContest.maxParticipants}</p>
                    <p className="text-sm text-purple-200">Max Entries</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentContest.category}</p>
                    <p className="text-sm text-purple-200">Category</p>
                  </div>
                </div>
              </div>

              {/* Video Entries */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoEntries.map((video) => (
                  <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all">
                          <Play className="w-8 h-8 text-white" />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {getPlatformIcon(video.platform)} {video.platform}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>by {video.creator}</span>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Eye className="w-4 h-4" />
                          <span>{video.views.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => handleVote(video.id, 'like')}
                            className="flex items-center space-x-1 rtl:space-x-reverse bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{video.likes}</span>
                          </button>
                          <button
                            onClick={() => handleVote(video.id, 'dislike')}
                            className="flex items-center space-x-1 rtl:space-x-reverse bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm transition-colors"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span>{video.dislikes}</span>
                          </button>
                        </div>
                        
                        <button className="text-gray-500 hover:text-gray-700 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'submit' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Your Video</h2>
                <p className="text-gray-600 mb-6">Share your video from any social platform and compete for amazing prizes!</p>
                
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Submit Video</span>
                </button>
              </div>

              {/* Contest Rules */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Contest Rules</h3>
                <ul className="space-y-2 text-blue-800">
                  {currentContest.rules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-2 rtl:space-x-reverse">
                      <Star className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supported Platforms */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Supported Platforms</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { name: 'YouTube', icon: '📺', color: 'red' },
                    { name: 'TikTok', icon: '🎵', color: 'black' },
                    { name: 'Instagram', icon: '📷', color: 'pink' },
                    { name: 'Facebook', icon: '👥', color: 'blue' },
                    { name: 'Other', icon: '🎬', color: 'gray' }
                  ].map((platform) => (
                    <div key={platform.name} className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-2xl mb-2">{platform.icon}</div>
                      <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Manage Contests</h2>
                <button
                  onClick={() => setShowCreateContestModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Contest</span>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Current Contest</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <p className="text-gray-900">{currentContest.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                        {currentContest.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <p className="text-gray-900">{currentContest.startDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <p className="text-gray-900">{currentContest.endDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Participants</label>
                      <p className="text-gray-900">{currentContest.currentParticipants} / {currentContest.maxParticipants}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prize</label>
                      <p className="text-gray-900">{currentContest.prize}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Video Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Submit Your Video</h2>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    value={videoSubmission.title}
                    onChange={(e) => setVideoSubmission(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={videoSubmission.description}
                    onChange={(e) => setVideoSubmission(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe your video"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={videoSubmission.platform}
                    onChange={(e) => setVideoSubmission(prev => ({ ...prev, platform: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    value={videoSubmission.videoUrl}
                    onChange={(e) => setVideoSubmission(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the link to your video from any social platform
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Reward:</strong> Earn 100 Flixbits for submitting your video!
                  </p>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    Submit Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Contest Modal */}
      {showCreateContestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Contest</h2>
                <button
                  onClick={() => setShowCreateContestModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateContest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contest Title *
                    </label>
                    <input
                      type="text"
                      value={newContest.title}
                      onChange={(e) => setNewContest(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newContest.category}
                      onChange={(e) => setNewContest(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Business, Food, Tech"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newContest.description}
                    onChange={(e) => setNewContest(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={newContest.startDate}
                      onChange={(e) => setNewContest(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={newContest.endDate}
                      onChange={(e) => setNewContest(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prize
                    </label>
                    <input
                      type="text"
                      value={newContest.prize}
                      onChange={(e) => setNewContest(prev => ({ ...prev, prize: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 10,000 Flixbits"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={newContest.maxParticipants}
                      onChange={(e) => setNewContest(prev => ({ ...prev, maxParticipants: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contest Rules
                  </label>
                  {newContest.rules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateRule(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={`Rule ${index + 1}`}
                      />
                      {newContest.rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRule(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRule}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + Add Rule
                  </button>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateContestModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    Create Contest
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

export default VideoContest;