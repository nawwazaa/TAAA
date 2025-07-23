import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  QrCode,
  Clock,
  Star,
  Gift,
  Settings,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useDrawEvents } from '../hooks/useDrawEvents';
import { DrawEvent, DrawPrize } from '../types';
import { getStatusColor, formatTimeRemaining, exportWinners } from '../utils/helpers';

const EventDrawManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const { events, loading, createEvent, updateEvent } = useDrawEvents();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DrawEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: {
      name: '',
      address: '',
      city: '',
      verificationRadius: 100
    },
    eventDate: '',
    startTime: '09:00',
    endTime: '17:00',
    maxAttendees: 100,
    prizes: [] as DrawPrize[],
    drawSettings: {
      drawDate: '',
      isAutomatic: false,
      requiresApproval: true,
      allowMultipleWins: false
    }
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.eventDate || !newEvent.location.name) {
      alert('Please fill in all required fields');
      return;
    }

    const eventData = {
      ...newEvent,
      creatorId: user?.id,
      creatorName: user?.name,
      creatorType: user?.userType as 'influencer' | 'seller',
      eventDate: new Date(newEvent.eventDate),
      location: {
        ...newEvent.location,
        coordinates: { lat: 25.2048, lng: 55.2708 } // Default Dubai coordinates
      },
      drawSettings: {
        ...newEvent.drawSettings,
        drawDate: new Date(newEvent.drawSettings.drawDate)
      }
    };

    createEvent(eventData);
    setShowCreateModal(false);
    
    // Reset form
    setNewEvent({
      title: '',
      description: '',
      location: { name: '', address: '', city: '', verificationRadius: 100 },
      eventDate: '',
      startTime: '09:00',
      endTime: '17:00',
      maxAttendees: 100,
      prizes: [],
      drawSettings: {
        drawDate: '',
        isAutomatic: false,
        requiresApproval: true,
        allowMultipleWins: false
      }
    });

    alert('Draw event created successfully!');
  };

  const addPrize = () => {
    const newPrize: DrawPrize = {
      id: `prize_${Date.now()}`,
      title: '',
      description: '',
      type: 'flixbits',
      value: 0,
      quantity: 1,
      claimInstructions: '',
      isActive: true
    };
    
    setNewEvent(prev => ({
      ...prev,
      prizes: [...prev.prizes, newPrize]
    }));
  };

  const updatePrize = (index: number, field: keyof DrawPrize, value: any) => {
    setNewEvent(prev => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) => 
        i === index ? { ...prize, [field]: value } : prize
      )
    }));
  };

  const removePrize = (index: number) => {
    setNewEvent(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading draw events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🎲 Draw Events Manager</h2>
          <p className="text-gray-600">Create and manage prize draw events with QR code verification</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="w-5 h-5" />
          <span>Create Draw Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                <span>{event.eventDate.toLocaleDateString()} • {event.startTime} - {event.endTime}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                <span>{event.location.name}, {event.location.city}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                <span>{event.currentAttendees} / {event.maxAttendees} attendees</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Trophy className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                <span>{event.prizes.length} prizes • {event.winners.length} winners</span>
              </div>
              
              {event.status === 'active' && (
                <div className="flex items-center text-sm text-orange-600">
                  <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  <span>Ends in: {formatTimeRemaining(event.qrCode.expiresAt)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">{event.averageRating.toFixed(1)} ({event.ratings.length})</span>
              </div>
              
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventDetails(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="text-green-600 hover:text-green-800 p-1"
                  title="Edit Event"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Draw Event</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateEvent} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                    <input
                      type="number"
                      value={newEvent.maxAttendees}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 100 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
                    <input
                      type="text"
                      value={newEvent.location.name}
                      onChange={(e) => setNewEvent(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, name: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newEvent.location.city}
                      onChange={(e) => setNewEvent(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, city: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newEvent.location.address}
                      onChange={(e) => setNewEvent(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, address: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Radius (meters)</label>
                    <input
                      type="number"
                      value={newEvent.location.verificationRadius}
                      onChange={(e) => setNewEvent(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, verificationRadius: parseInt(e.target.value) || 100 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="10"
                      max="1000"
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                    <input
                      type="date"
                      value={newEvent.eventDate}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Prizes Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Prizes</h3>
                    <button
                      type="button"
                      onClick={addPrize}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors"
                    >
                      Add Prize
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {newEvent.prizes.map((prize, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prize Title</label>
                            <input
                              type="text"
                              value={prize.title}
                              onChange={(e) => updatePrize(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={prize.type}
                              onChange={(e) => updatePrize(index, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="flixbits">🪙 Flixbits</option>
                              <option value="physical">📦 Physical Item</option>
                              <option value="voucher">🎟️ Voucher</option>
                              <option value="service">🛠️ Service</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                            <input
                              type="number"
                              value={prize.value}
                              onChange={(e) => updatePrize(index, 'value', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              min="0"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Winners</label>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <input
                                type="number"
                                value={prize.quantity}
                                onChange={(e) => updatePrize(index, 'quantity', parseInt(e.target.value) || 1)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                min="1"
                              />
                              <button
                                type="button"
                                onClick={() => removePrize(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Claim Instructions</label>
                          <textarea
                            value={prize.claimInstructions}
                            onChange={(e) => updatePrize(index, 'claimInstructions', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={2}
                            placeholder="Instructions for winners on how to claim this prize"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Draw Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Draw Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Draw Date & Time</label>
                      <input
                        type="datetime-local"
                        value={newEvent.drawSettings.drawDate}
                        onChange={(e) => setNewEvent(prev => ({ 
                          ...prev, 
                          drawSettings: { ...prev.drawSettings, drawDate: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newEvent.drawSettings.isAutomatic}
                          onChange={(e) => setNewEvent(prev => ({ 
                            ...prev, 
                            drawSettings: { ...prev.drawSettings, isAutomatic: e.target.checked }
                          }))}
                          className="mr-2 rtl:mr-0 rtl:ml-2"
                        />
                        <span className="text-sm text-gray-700">Automatic Draw</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newEvent.drawSettings.allowMultipleWins}
                          onChange={(e) => setNewEvent(prev => ({ 
                            ...prev, 
                            drawSettings: { ...prev.drawSettings, allowMultipleWins: e.target.checked }
                          }))}
                          className="mr-2 rtl:mr-0 rtl:ml-2"
                        />
                        <span className="text-sm text-gray-700">Allow Multiple Wins</span>
                      </label>
                    </div>
                  </div>
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
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900">{selectedEvent.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900">{selectedEvent.location.name}</p>
                      <p className="text-gray-600 text-sm">{selectedEvent.location.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                      <p className="text-gray-900">{selectedEvent.eventDate.toLocaleDateString()}</p>
                      <p className="text-gray-600 text-sm">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{selectedEvent.currentAttendees}</p>
                      <p className="text-sm text-blue-800">Attendees</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{selectedEvent.prizes.length}</p>
                      <p className="text-sm text-green-800">Prizes</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{selectedEvent.winners.length}</p>
                      <p className="text-sm text-purple-800">Winners</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{selectedEvent.averageRating.toFixed(1)}</p>
                      <p className="text-sm text-yellow-800">Rating</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prizes */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prizes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedEvent.prizes.map((prize) => (
                    <div key={prize.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{prize.title}</h4>
                      <p className="text-gray-600 text-sm">{prize.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">{prize.quantity} winner(s)</span>
                        <span className="font-semibold text-purple-600">{prize.value} {prize.type === 'flixbits' ? 'FB' : 'value'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedEvent.winners.length > 0 && (
                  <button
                    onClick={() => exportWinners(selectedEvent.winners, selectedEvent.title)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Winners</span>
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

export default EventDrawManager;