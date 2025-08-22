import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Trophy, 
  QrCode, 
  Users, 
  Settings, 
  Star,
  Calendar,
  Gift
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import EventDrawManager from './components/EventDrawManager';
import AttendeeScanner from './components/AttendeeScanner';
import WinnerSelection from './components/WinnerSelection';
import { useDrawEvents } from './hooks/useDrawEvents';

const DrawWinnersSystem: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'events' | 'scanner' | 'winners' | 'ratings'>('events');
  const { events } = useDrawEvents();
  
  // Find active event for scanner
  const activeEvent = events.find(event => event.status === 'active');

  const handleAttendeeAdded = (attendee: any) => {
    // In real app, this would update the event in the backend
    console.log('New attendee added:', attendee);
  };

  const handleWinnersSelected = (winners: any[]) => {
    // In real app, this would update the event with winners
    console.log('Winners selected:', winners);
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🎲 Draw Winners System</h1>
        <p className="text-purple-100">Complete prize draw management with QR code verification and location-based attendance</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('events')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'events'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Manage Events</span>
              <span className="responsive-tab-text-short font-medium">Manage Events</span>
            </button>
            
            <button
              onClick={() => setActiveTab('scanner')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'scanner'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <QrCode className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Scan QR Code</span>
              <span className="responsive-tab-text-short font-medium">Scan QR Code</span>
            </button>
            
            <button
              onClick={() => setActiveTab('winners')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'winners'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Trophy className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Select Winners</span>
              <span className="responsive-tab-text-short font-medium">Select Winners</span>
            </button>
            
            <button
              onClick={() => setActiveTab('ratings')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'ratings'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Star className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Rate Events</span>
              <span className="responsive-tab-text-short font-medium">Rate Events</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'events' && <EventDrawManager />}
          
          {activeTab === 'scanner' && (
            <div>
              {activeEvent ? (
                <AttendeeScanner 
                  event={activeEvent} 
                  onAttendeeAdded={handleAttendeeAdded}
                />
              ) : (
                <div className="text-center py-12">
                  <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Events</h3>
                  <p className="text-gray-600 mb-4">There are no active draw events to scan QR codes for.</p>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'winners' && (
            <div>
              {activeEvent ? (
                <WinnerSelection 
                  event={activeEvent} 
                  onWinnersSelected={handleWinnersSelected}
                />
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Events</h3>
                  <p className="text-gray-600 mb-4">There are no active events to conduct winner selection for.</p>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'ratings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">⭐ Event Ratings</h2>
              
              {events.filter(event => event.status === 'ended').length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Events</h3>
                  <p className="text-gray-600">Event ratings will appear here after events are completed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.filter(event => event.status === 'ended').map((event) => (
                    <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                          <p className="text-gray-600">{event.eventDate.toLocaleDateString()}</p>
                        </div>
                        <div className="text-right rtl:text-left">
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="font-bold text-gray-900">{event.averageRating.toFixed(1)}</span>
                          </div>
                          <p className="text-sm text-gray-500">{event.ratings.length} ratings</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {event.ratings.slice(0, 3).map((rating) => (
                          <div key={rating.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-900">{rating.userName}</span>
                              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= rating.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {rating.comment && (
                              <p className="text-gray-600 text-sm">{rating.comment}</p>
                            )}
                          </div>
                        ))}
                        
                        {event.ratings.length > 3 && (
                          <p className="text-center text-gray-500 text-sm">
                            +{event.ratings.length - 3} more ratings
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* System Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">🚀 System Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-900 flex items-center">
              <QrCode className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              QR Code Security
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Location-based verification</li>
              <li>• Time-limited QR codes</li>
              <li>• One-time scan per person</li>
              <li>• Anti-fraud protection</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-900 flex items-center">
              <Trophy className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              Fair Draw System
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Cryptographically secure random selection</li>
              <li>• Transparent process</li>
              <li>• Automatic winner notification</li>
              <li>• Claim code generation</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-900 flex items-center">
              <Star className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              Quality Assurance
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Event creator ratings</li>
              <li>• Attendee feedback system</li>
              <li>• Prize claim tracking</li>
              <li>• Performance analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawWinnersSystem;