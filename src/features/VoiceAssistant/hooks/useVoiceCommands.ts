import { useState, useCallback } from 'react';
import { VoiceCommand, VoiceResponse, VoiceAction, LocationResult } from '../types';
import { processNaturalLanguage, generateResponse } from '../utils/nlp';
import { findNearbyPlaces, openGoogleMapsSearch } from '../utils/locationServices';

export const useVoiceCommands = (userLocation?: { lat: number; lng: number }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [lastResponse, setLastResponse] = useState<VoiceResponse | null>(null);

  const processCommand = useCallback(async (transcript: string, confidence: number): Promise<VoiceResponse> => {
    console.log('🧠 Processing command:', transcript, 'with confidence:', confidence);
    setIsProcessing(true);
    
    try {
      // Process natural language to extract intent and parameters
      const nlpResult = processNaturalLanguage(transcript);
      console.log('🔍 NLP Result:', nlpResult);
      
      const command: VoiceCommand = {
        id: `cmd_${Date.now()}`,
        command: transcript,
        intent: nlpResult.intent,
        parameters: nlpResult.parameters,
        confidence,
        timestamp: new Date(),
        userId: 'current_user'
      };
      
      setLastCommand(command);
      console.log('📋 Created command:', command);
      
      // Generate response based on intent
      let response: VoiceResponse;
      
      switch (nlpResult.intent) {
        case 'search':
          console.log('🔍 Handling search command...');
          response = await handleSearchCommand(command);
          break;
        case 'navigation':
          console.log('🧭 Handling navigation command...');
          response = await handleNavigationCommand(command);
          break;
        case 'notification':
          console.log('🔔 Handling notification command...');
          response = await handleNotificationCommand(command);
          break;
        case 'reminder':
          console.log('⏰ Handling reminder command...');
          response = await handleReminderCommand(command);
          break;
        case 'query':
          console.log('❓ Handling query command...');
          response = await handleQueryCommand(command);
          break;
        case 'control':
          console.log('🎮 Handling control command...');
          response = await handleControlCommand(command);
          break;
        default:
          console.log('❌ Unknown intent, using default response');
          response = generateResponse('I didn\'t understand that command. Can you try rephrasing?');
      }
      
      console.log('✅ Generated response:', response);
      setLastResponse(response);
      return response;
      
    } catch (error) {
      console.error('❌ Error processing command:', error);
      const errorResponse = generateResponse('Sorry, I encountered an error processing your command.');
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsProcessing(false);
    }
  }, [userLocation]);

  const handleSearchCommand = async (command: VoiceCommand): Promise<VoiceResponse> => {
    const { category, location, type, hasOffers } = command.parameters;
    
    // Handle stores/shops
    if (category === 'stores' || command.command.toLowerCase().includes('store') || command.command.toLowerCase().includes('shop')) {
      if (!userLocation) {
        return generateResponse('I need your location to find nearby stores. Please enable location services.');
      }
      
      const places = await findNearbyPlaces(userLocation, 'store', 2000); // 2km radius
      const placesWithOffers = places.filter(place => place.offers && place.offers.length > 0);
      
      if (places.length === 0) {
        return generateResponse('I couldn\'t find any stores in your area. Try expanding your search radius or check your location settings.');
      }
      
      // Prioritize places with offers, but show all if no offers
      const displayPlaces = placesWithOffers.length > 0 ? placesWithOffers : places;
      
      const actions: VoiceAction[] = displayPlaces.slice(0, 3).map(place => ({
        type: 'open_map',
        data: { 
          lat: place.coordinates.lat, 
          lng: place.coordinates.lng,
          name: place.name,
          address: place.address
        },
        label: `Navigate to ${place.name}`
      }));
      
      let responseText = '';
      if (placesWithOffers.length > 0) {
        const closest = placesWithOffers[0];
        responseText = `I found ${placesWithOffers.length} stores with offers nearby. The closest is ${closest.name} with ${closest.offers![0].discount}% off, about ${Math.round(closest.distance)} meters away.`;
      } else {
        const closest = places[0];
        responseText = `I found ${places.length} stores nearby. The closest is ${closest.name}, about ${Math.round(closest.distance)} meters away. No current offers available.`;
      }
      
      return {
        id: `resp_${Date.now()}`,
        text: responseText,
        actions,
        followUpQuestions: [
          'Show me more details',
          'Get directions',
          'What are the opening hours?'
        ],
        timestamp: new Date()
      };
    }
    
    // Handle restaurants/food
    if (category === 'restaurants' || category === 'food' || command.command.toLowerCase().includes('restaurant') || command.command.toLowerCase().includes('food')) {
      if (!userLocation) {
        return generateResponse('I need your location to find nearby restaurants. Please enable location services.');
      }
      
      const places = await findNearbyPlaces(userLocation, 'restaurant', 2000);
      const placesWithOffers = places.filter(place => place.offers && place.offers.length > 0);
      
      if (places.length === 0) {
        return generateResponse('I couldn\'t find any restaurants in your area. Try expanding your search radius.');
      }
      
      const displayPlaces = placesWithOffers.length > 0 ? placesWithOffers : places;
      
      const actions: VoiceAction[] = displayPlaces.slice(0, 3).map(place => ({
        type: 'open_map',
        data: { 
          lat: place.coordinates.lat, 
          lng: place.coordinates.lng,
          name: place.name,
          address: place.address
        },
        label: `Navigate to ${place.name}`
      }));
      
      let responseText = '';
      if (placesWithOffers.length > 0) {
        const closest = placesWithOffers[0];
        responseText = `I found ${placesWithOffers.length} restaurants with offers nearby. The closest is ${closest.name} with ${closest.offers![0].discount}% off, about ${Math.round(closest.distance)} meters away.`;
      } else {
        const closest = places[0];
        responseText = `I found ${places.length} restaurants nearby. The closest is ${closest.name}, about ${Math.round(closest.distance)} meters away.`;
      }
      
      return {
        id: `resp_${Date.now()}`,
        text: responseText,
        actions,
        followUpQuestions: [
          'Show me the menu',
          'Get directions',
          'What are the opening hours?'
        ],
        timestamp: new Date()
      };
    }
    
    // Generic search
    if (!userLocation) {
      return generateResponse('I need your location to search for nearby places. Please enable location services.');
    }
    
    const places = await findNearbyPlaces(userLocation, 'any', 2000);
    
    if (places.length === 0) {
      return generateResponse('I couldn\'t find any places matching your search in your area.');
    }
    
    const closest = places[0];
    const actions: VoiceAction[] = [{
      type: 'open_map',
      data: { 
        lat: closest.coordinates.lat, 
        lng: closest.coordinates.lng,
        name: closest.name,
        address: closest.address
      },
      label: `Navigate to ${closest.name}`
    }];
    
    return {
      id: `resp_${Date.now()}`,
      text: `I found ${places.length} places nearby. The closest is ${closest.name}, about ${Math.round(closest.distance)} meters away.`,
      actions,
      timestamp: new Date()
    };
  };

  const handleNavigationCommand = async (command: VoiceCommand): Promise<VoiceResponse> => {
    const { destination, type } = command.parameters;
    
    console.log('🧭 Navigation command - destination:', destination);
    
    if (!destination) {
      return generateResponse('Where would you like me to take you?');
    }
    
    // For specific destinations like "airport", "mall", etc., open Google Maps directly
    const actions: VoiceAction[] = [{
      type: 'open_map',
      data: {
        destination: destination,
        searchQuery: destination,
        userLocation: userLocation
      },
      label: `Get directions to ${destination}`
    }];
    
    // Auto-execute the map opening
    setTimeout(() => {
      console.log('🗺️ Auto-opening Google Maps for:', destination);
      openGoogleMapsSearch(destination, userLocation);
    }, 1000);
    
    return {
      id: `resp_${Date.now()}`,
      text: `Opening Google Maps with directions to ${destination}. Please wait a moment.`,
      actions,
      timestamp: new Date()
    };
  };

  const handleNotificationCommand = async (command: VoiceCommand): Promise<VoiceResponse> => {
    // This would integrate with the notification system
    return generateResponse('Reading your latest notifications...');
  };

  const handleReminderCommand = async (command: VoiceCommand): Promise<VoiceResponse> => {
    const { task, time, date } = command.parameters;
    
    if (!task) {
      return generateResponse('What would you like me to remind you about?');
    }
    
    // Create reminder logic here
    const actions: VoiceAction[] = [{
      type: 'set_reminder',
      data: { task, time, date },
      label: 'Set Reminder'
    }];
    
    return {
      id: `resp_${Date.now()}`,
      text: `I'll remind you to ${task}${time ? ` at ${time}` : ''}${date ? ` on ${date}` : ''}.`,
      actions,
      timestamp: new Date()
    };
  };

  const handleQueryCommand = async (command: VoiceCommand): Promise<VoiceResponse> => {
    const { question, topic } = command.parameters;
    
    // Handle common queries about the app
    if (topic === 'flixbits' || question.includes('flixbits')) {
      return generateResponse('Flixbits are FlixMarket\'s digital currency. You can earn them by scanning QR codes, participating in contests, and referring friends. You can spend them on rewards or exchange them for real money.');
    }
    
    if (topic === 'offers' || question.includes('offers')) {
      return generateResponse('You can find offers by browsing the marketplace, scanning QR codes at participating stores, or checking your personalized recommendations based on your interests.');
    }
    
    return generateResponse('I can help you with FlixMarket features, finding nearby offers, setting reminders, and reading notifications. What would you like to know?');
  };

  const handleControlCommand = async (command: VoiceCommand): Promise<VoiceResponse> => {
    const { action, target } = command.parameters;
    
    // Handle app control commands
    if (action === 'open' && target) {
      const actions: VoiceAction[] = [{
        type: 'navigate',
        data: { page: target },
        label: `Open ${target}`
      }];
      
      return {
        id: `resp_${Date.now()}`,
        text: `Opening ${target} for you.`,
        actions,
        timestamp: new Date()
      };
    }
    
    return generateResponse('I can help you navigate the app. Try saying "open wallet" or "show my profile".');
  };

  return {
    processCommand,
    isProcessing,
    lastCommand,
    lastResponse
  };
};