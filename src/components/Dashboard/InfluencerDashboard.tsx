import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Video, 
  Calendar, 
  Users, 
  BarChart3, 
  Star,
  Trophy,
  Gift,
  Eye,
  Heart,
  Share2,
  Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const InfluencerDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';

  const [activeEvents, setActiveEvents] = useState([
    {
      id: 1,
      title: 'Fashion Week Dubai Preview',
      type: 'event',
      attendees: 67,
      maxAttendees: 100,
      startDate: '2024-02-15',
      status: 'active'
    },
    {
      id: 2,
      title: 'Best Local Business Video Contest',
      type: 'contest',
      submissions: 23,
      maxSubmissions: 50,
      endDate: '2024-01-25',
      status: 'active'
    }
  ]);

  const [stats] = useState({
    totalFollowers: 2450,
    totalEvents: 15,
    totalContests: 8,
    totalEarnings: 12500,
    monthlyViews: 45600,
    engagementRate: 8.7
  });

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Influencer Dashboard</h1>
          <p className="text-gray-600">Manage your content, events, and audience engagement</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse">
            <Calendar className="w-5 h-5" />
            <span>Create Event</span>
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse">
            <Video className="w-5 h-5" />
            <span>New Contest</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Followers</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.totalFollowers.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 md:p-3 rounded-lg">
              <Users className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Events</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-2 md:p-3 rounded-lg">
              <Calendar className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Contests</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.totalContests}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 md:p-3 rounded-lg">
              <Trophy className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Earnings</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 md:p-3 rounded-lg">
              <Gift className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Monthly Views</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.monthlyViews.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 md:p-3 rounded-lg">
              <Eye className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Engagement</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.engagementRate}%</p>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 md:p-3 rounded-lg">
              <Heart className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Events & Contests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Star className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-purple-500" />
          Active Events & Contests
        </h2>
        <div className="space-y-4">
          {activeEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">{event.type}</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium capitalize">
                  {event.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                {event.type === 'event' ? (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{event.attendees}</p>
                      <p className="text-sm text-gray-600">Attendees</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{event.maxAttendees}</p>
                      <p className="text-sm text-gray-600">Max Capacity</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-bold text-gray-900">{event.startDate}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{event.submissions}</p>
                      <p className="text-sm text-gray-600">Submissions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{event.maxSubmissions}</p>
                      <p className="text-sm text-gray-600">Max Entries</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-bold text-gray-900">{event.endDate}</p>
                    </div>
                  </>
                )}
                <div className="text-center">
                  <div className="flex space-x-2 rtl:space-x-reverse justify-center">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                      Manage
                    </button>
                    <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors">
                      Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Content Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Fashion Tips Video</p>
                  <p className="text-sm text-gray-600">2 days ago</p>
                </div>
              </div>
              <div className="text-right rtl:text-left">
                <p className="font-bold text-gray-900">1.2K views</p>
                <p className="text-sm text-green-600">+15% engagement</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Style Workshop Event</p>
                  <p className="text-sm text-gray-600">1 week ago</p>
                </div>
              </div>
              <div className="text-right rtl:text-left">
                <p className="font-bold text-gray-900">89 attendees</p>
                <p className="text-sm text-blue-600">4.8★ rating</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Audience Insights</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Fashion Enthusiasts</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Shopping Lovers</span>
                <span className="text-sm font-medium">32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Tech Enthusiasts</span>
                <span className="text-sm font-medium">23%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors">
            <div className="text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">Create Event</div>
              <div className="text-sm opacity-90">Host new event</div>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
            <div className="text-center">
              <Video className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">Video Contest</div>
              <div className="text-sm opacity-90">Start contest</div>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-colors">
            <div className="text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">Prize Draw</div>
              <div className="text-sm opacity-90">Create draw</div>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-colors">
            <div className="text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">Analytics</div>
              <div className="text-sm opacity-90">View insights</div>
            </div>
          </button>
        </div>
      </div>

      {/* Content Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Content Schedule</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Fashion Trends 2024</p>
                <p className="text-sm text-gray-600">Video Content • Tomorrow 3:00 PM</p>
              </div>
            </div>
            <button className="text-purple-600 hover:text-purple-800 font-medium">
              Edit
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Style Workshop</p>
                <p className="text-sm text-gray-600">Live Event • Feb 20, 7:00 PM</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;