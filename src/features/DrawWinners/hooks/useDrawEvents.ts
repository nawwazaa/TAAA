import { useState, useEffect } from 'react';
import { DrawEvent, DrawFilters } from '../types';
import { generateSampleDrawEvents } from '../utils/sampleData';

export const useDrawEvents = () => {
  const [events, setEvents] = useState<DrawEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DrawFilters>({
    status: 'all',
    creatorType: 'all',
    dateRange: { start: '', end: '' },
    location: '',
    searchQuery: ''
  });

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        // In real app, this would be an API call
        const sampleEvents = generateSampleDrawEvents();
        setEvents(sampleEvents);
      } catch (error) {
        console.error('Error loading draw events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const createEvent = (eventData: Partial<DrawEvent>) => {
    const newEvent: DrawEvent = {
      id: `draw_event_${Date.now()}`,
      title: eventData.title || '',
      description: eventData.description || '',
      creatorId: eventData.creatorId || '',
      creatorName: eventData.creatorName || '',
      creatorType: eventData.creatorType || 'influencer',
      location: eventData.location || {
        name: '',
        address: '',
        city: '',
        coordinates: { lat: 0, lng: 0 },
        verificationRadius: 100
      },
      eventDate: eventData.eventDate || new Date(),
      startTime: eventData.startTime || '09:00',
      endTime: eventData.endTime || '17:00',
      qrCode: {
        id: `qr_${Date.now()}`,
        data: JSON.stringify({ eventId: `draw_event_${Date.now()}`, type: 'draw_event' }),
        imageUrl: `data:image/svg+xml;base64,${btoa('<svg>QR Code</svg>')}`,
        expiresAt: eventData.qrCode?.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
        isActive: true,
        scanLimit: 1
      },
      prizes: eventData.prizes || [],
      maxAttendees: eventData.maxAttendees || 100,
      currentAttendees: 0,
      attendees: [],
      winners: [],
      status: 'draft',
      drawSettings: eventData.drawSettings || {
        drawDate: new Date(),
        isAutomatic: false,
        requiresApproval: true,
        allowMultipleWins: false
      },
      ratings: [],
      averageRating: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (eventId: string, updates: Partial<DrawEvent>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, ...updates, updatedAt: new Date() }
          : event
      )
    );
  };

  const filteredEvents = events.filter(event => {
    if (filters.status !== 'all' && event.status !== filters.status) return false;
    if (filters.creatorType !== 'all' && event.creatorType !== filters.creatorType) return false;
    if (filters.location && !event.location.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return event.title.toLowerCase().includes(query) ||
             event.description.toLowerCase().includes(query) ||
             event.creatorName.toLowerCase().includes(query);
    }
    return true;
  });

  return {
    events: filteredEvents,
    allEvents: events,
    loading,
    filters,
    setFilters,
    createEvent,
    updateEvent
  };
};