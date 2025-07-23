import { useState, useCallback } from 'react';
import { VoiceCommand, VoiceResponse, VoiceAction, LocationResult } from '../types';
import { processNaturalLanguage, generateResponse } from '../utils/nlp';
import { findNearbyPlaces } from '../utils/locationServices';

export const useVoiceCommands = (userLocation?: { lat: number; lng: number }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [lastResponse, setLastResponse] = useState<VoiceResponse | null>(null);

  const processCommand = useCallback(async (transcript: string, confidence: number): Promise<VoiceResponse> => {
    setIsProcessing(true);
    
    try {
      // Process natural language to extract intent and parameters
      const nlpResult = processNaturalLanguage(transcript);
      
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
      
      // Generate response based on intent
      let response: VoiceResponse;
      
      switch (nlpResult.intent) {
        case 'search':
          response = await handleSearchCommand(command);
          break;
        case 'navigation':
          response = await handleNavigationCommand(command);
          break;
        case 'notification':
          response = await handleNotificationCommand(command);
          break;
        case 'reminder':
          response = await handleReminderCommand(command);
          break;
        case 'query':
          response = await handleQueryCommand(command);
          break;
        case 'control':
          response = await handleControlCommand(command);
          break;
        default:
          response = generateResponse('I didn\'t understand that command. Can you try rephrasing?');
      }
      
      setLastResponse(response);
      return response;
      
    } catch (error) {
      const errorResponse = generateResponse('Sorry, I encountered an error processing your command.');
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsProcessing(false);
    }
  }, [userLocation]);

  const handleSearchCommand = async (command: VoiceCommand): Promise<VoiceResponse> => {
    const { category, location, type } = command.parameters;
    
    if (category === 'restaurants' || category === 'food') {
      if (!userLocation) {
        return generateResponse('I need your location to find nearby restaurants. Please enable location services.');
      }
      
      const places = await findNearbyPlaces(userLocation, 'restaurant', 2000); // 2km radius
      const placesWithOffers = places.filter(place => place.offers && place.offers.length > 0);
      
      if (placesWithOffers.length === 0) {
        return generateResponse('I couldn\'t find any restaurants with offers nearby. Would you like me to show all restaurants instead?');
      }
      
      const actions: VoiceAction[] = placesWithOffers.slice(0, 3).map(place => ({
        type: 'open_map',
        data: { 
          lat: place.coordinates.lat, 
          lng: place.coordinates.lng,
          name: place.name,
          address: place.address
        },
        label: `Navigate to ${place.name}`
      }));
      
      return {
        id: `resp_${Date.now()}`,
        text: `I found ${placesWithOffers.length} restaurants with offers nearby. The closest is ${placesWithOffers[0].name} with ${placesWithOffers[0].offers![0].discount}% off, about ${Math.round(placesWithOffers[0].distance)}m away.`,
        actions,
        followUpQuestions: [
          'Show me the menu',
          'Get directions',
          'What are the opening hours?'
        ],
        timestamp: new Date()
      };
    }
    
    return generateResponse(`Searching for ${category || 'items'} in your area...`);
  };

  const handleNavigationCommand = async (command: VoiceCommand): Promise<VoiceResponse> => {
    const { destination, type } = command.parameters;
    
    if (!userLocation) {
      return generateResponse('I need your location to provide navigation. Please enable location services.');
    }
    
    // Find the destination
    const places = await findNearbyPlaces(userLocation, type || 'any', 5000);
    const targetPlace = places.find(place => 
      place.name.toLowerCase().includes(destination.toLowerCase())
    );
    
    if (!targetPlace) {
      return generateResponse(`I couldn't find "${destination}" nearby. Would you like me to search for something similar?`);
    }
    
    const actions: VoiceAction[] = [{
      type: 'open_map',
      data: {
        lat: targetPlace.coordinates.lat,
        lng: targetPlace.coordinates.lng,
        name: targetPlace.name,
        address: targetPlace.address
      },
      label: `Navigate to ${targetPlace.name}`
    }];
    
    return {
      id: `resp_${Date.now()}`,
      text: `I found ${targetPlace.name} at ${targetPlace.address}. It's about ${Math.round(targetPlace.distance)}m away. Would you like me to open directions?`,
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