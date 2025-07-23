import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MapPin, 
  MessageCircle,
  Settings,
  Zap,
  Brain,
  Navigation,
  Bell
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { VoiceSettings, VoiceAction } from '../types';
import { openGoogleMaps, openGoogleMapsSearch, getCurrentLocation } from '../utils/locationServices';

const VoiceInterface: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    isEnabled: true,
    voiceType: 'female',
    language: i18n.language as 'en' | 'ar',
    speed: 1.0,
    volume: 0.8,
    wakeWord: 'hey_flix',
    readNotifications: true,
    locationServices: true,
    personalizedResponses: true,
    voiceShortcuts: []
  });
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isManualListening, setIsManualListening] = useState(false);
  const [isWakeWordListening, setIsWakeWordListening] = useState(false);
  
  const { 
    isListening, 
    isSupported, 
    transcript, 
    confidence, 
    error: speechError,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition(voiceSettings);
  
  const { processCommand, isProcessing, lastResponse } = useVoiceCommands(userLocation || undefined);
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech(voiceSettings);

  // Get user location on component mount
  useEffect(() => {
    if (voiceSettings.locationServices) {
      getCurrentLocation()
        .then(location => setUserLocation(location))
        .catch(error => console.warn('Could not get location:', error));
    }
  }, [voiceSettings.locationServices]);

  // Auto-start wake word listening when component mounts
  useEffect(() => {
    if (voiceSettings.isEnabled && isSupported) {
      setIsWakeWordListening(true);
      startListening();
    }
  }, [voiceSettings.isEnabled, isSupported, startListening]);

  // Listen for wake words in transcript
  useEffect(() => {
    if (transcript && isWakeWordListening && !isManualListening) {
      const lowerTranscript = transcript.toLowerCase();
      const wakeWords = ['hey flix', 'flix assistant'];
      
      for (const wakeWord of wakeWords) {
        if (lowerTranscript.includes(wakeWord)) {
          console.log('🎯 Wake word detected:', wakeWord);
          
          // Extract command after wake word
          const commandStart = lowerTranscript.indexOf(wakeWord) + wakeWord.length;
          const command = transcript.substring(commandStart).trim();
          
          if (command) {
            console.log('🚀 Processing wake word command:', command);
            
            // Process the command
            processCommand(command, confidence).then(response => {
              if (response.text) {
                speak(response.text);
              }
              if (response.actions) {
                response.actions.forEach(action => executeAction(action));
              }
            });
            
            resetTranscript();
          }
          break;
        }
      }
    }
  }, [transcript, isWakeWordListening, isManualListening, confidence, processCommand, speak, resetTranscript]);

  // Listen for voice commands
  useEffect(() => {
    const handleVoiceCommand = async (event: CustomEvent) => {
      const { command, confidence } = event.detail;
      
      if (command && confidence > 0.5) {
        console.log('🎯 Processing voice command:', command);
        
        // Stop listening when we get a command
        if (isManualListening) {
          stopListening();
          setIsManualListening(false);
        }
        
        resetTranscript();
        const response = await processCommand(command, confidence);
        
        console.log('📝 Generated response:', response);
        
        if (response.text) {
          console.log('Speaking response:', response.text);
          speak(response.text);
        }
        
        // Execute all actions including open_map
        if (response.actions) {
          response.actions.forEach(action => {
            executeAction(action);
          });
        }
      }
    };

    window.addEventListener('voice-command', handleVoiceCommand as EventListener);
    return () => window.removeEventListener('voice-command', handleVoiceCommand as EventListener);
  }, [processCommand, speak, resetTranscript, isManualListening, stopListening]);

  const executeAction = (action: VoiceAction) => {
    console.log('🎯 Executing action:', action.type, action.data);
    
    switch (action.type) {
      case 'open_map':
        console.log('🗺️ Executing map action:', action.data);
        
        try {
          // Handle different types of map data
          if (action.data.destination || action.data.searchQuery) {
            const destination = action.data.destination || action.data.searchQuery;
            console.log('🎯 Destination:', destination);
            
            // Use the most reliable Google Maps URL format to avoid KML/KMZ errors
            let mapsUrl = '';
            
            if (userLocation) {
              // Create directions URL - this is the most reliable format
              mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
            } else {
              // Create search URL using the Maps API format
              mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
            }
            
            console.log('🔗 Using Google Maps API URL:', mapsUrl);
            
            // Open Google Maps
            const newWindow = window.open(mapsUrl, '_blank');
            
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
              console.log('⚠️ Popup blocked, opening in same window...');
              window.location.href = mapsUrl;
            } else {
              console.log('✅ Successfully opened Google Maps in new tab');
            }
            
          } else if (action.data.lat && action.data.lng) {
            // Handle coordinate-based navigation
            const { lat, lng, name, address } = action.data;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            console.log('📍 Opening coordinates:', lat, lng);
            console.log('🔗 Coordinates URL:', mapsUrl);
            
            // Try to open in new window first, fallback to same window
            const newWindow = window.open(mapsUrl, '_blank');
            
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
              console.log('⚠️ Popup blocked, trying same window...');
              window.location.href = mapsUrl;
            } else {
              console.log('✅ Successfully opened Google Maps in new tab');
            }
          } else {
            console.error('❌ No valid map data provided:', action.data);
          }
        } catch (error) {
          console.error('❌ Failed to open Google Maps:', error);
          alert(`Unable to open Google Maps: ${error.message}. Please try manually searching for the destination.`);
        }
        break;
        
      case 'navigate':
        console.log('🧭 Navigating to page:', action.data.page);
        if (action.data.page) {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: action.data.page }));
        }
        break;
        
      case 'set_reminder':
        console.log('⏰ Setting reminder:', action.data);
        alert(`Reminder set: ${action.data.task}`);
        break;
        
      default:
        console.log('❓ Unknown action type:', action.type, action.data);
    }
  };

  const handleManualListening = () => {
    if (isManualListening) {
      stopListening();
      setIsManualListening(false);
    } else {
      startListening();
      setIsManualListening(true);
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
  };

  if (!isSupported) {
    return (
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-2">Voice Assistant Not Supported</h2>
          <p>Your browser doesn't support voice recognition. Please use Chrome, Safari, or Edge for the best experience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Voice Control Panel */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">🎤 FlixAssistant Voice Control</h2>
            <p className="text-purple-100">
              {isWakeWordListening ? 'Listening for "Hey Flix"...' : 'Voice assistant is ready'}
            </p>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {isListening && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Listening...</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span className="text-sm">Speaking...</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleManualListening}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isManualListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isManualListening ? <MicOff className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" /> : <Mic className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />}
              {isManualListening ? 'Stop Manual Mode' : 'Manual Listen'}
            </button>
            
            <button
              onClick={() => {
                if (isWakeWordListening) {
                  stopListening();
                  setIsWakeWordListening(false);
                } else {
                  setIsWakeWordListening(true);
                  startListening();
                }
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isWakeWordListening
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isWakeWordListening ? 'Disable Wake Word' : 'Enable Wake Word'}
            </button>
            
            <button
              onClick={() => speak('Hello! This is FlixAssistant. I can help you find nearby restaurants, read notifications, and control the app with voice commands.')}
              disabled={isSpeaking}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Volume2 className="w-5 h-5" />
              <span>Test Voice</span>
            </button>
            
            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
              >
                <VolumeX className="w-5 h-5" />
                <span>Stop Speaking</span>
              </button>
            )}
          </div>
          
          {transcript && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-blue-800 mb-2">You said:</h4>
              <p className="text-blue-700">"{transcript}"</p>
              <p className="text-blue-600 text-sm mt-1">Confidence: {Math.round(confidence * 100)}%</p>
            </div>
          )}
          
          {lastResponse && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-green-800 mb-2">FlixAssistant:</h4>
              <p className="text-green-700">"{lastResponse.text}"</p>
              
              {lastResponse.actions && lastResponse.actions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {lastResponse.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => executeAction(action)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors mr-2 rtl:mr-0 rtl:ml-2"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
              
              {lastResponse.followUpQuestions && (
                <div className="mt-3">
                  <p className="text-green-600 text-sm font-medium mb-2">You can also ask:</p>
                  <div className="space-y-1">
                    {lastResponse.followUpQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => processCommand(question, 1.0)}
                        className="block text-green-600 hover:text-green-800 text-sm underline"
                      >
                        "{question}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {speechError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">Error: {speechError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Commands */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🚀 Voice Commands (Say "Hey Flix" first)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Navigation className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-blue-500" />
              Location & Navigation
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• "Hey Flix, find nearby restaurants with offers"</p>
              <p>• "Where is the closest mall?"</p>
              <p>• "Take me to Dubai Mall"</p>
              <p>• "Show me gas stations nearby"</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Bell className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-green-500" />
              Notifications & Reminders
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• "Read my notifications"</p>
              <p>• "Remind me to buy groceries at 6 PM"</p>
              <p>• "What are my latest messages?"</p>
              <p>• "Set a reminder for tomorrow"</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Zap className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-purple-500" />
              App Control
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• "Open my wallet"</p>
              <p>• "Show my profile"</p>
              <p>• "Go to tournaments"</p>
              <p>• "Open QR scanner"</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Brain className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-orange-500" />
              Information
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• "What are Flixbits?"</p>
              <p>• "How do I earn more points?"</p>
              <p>• "Show me current offers"</p>
              <p>• "What's my balance?"</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-800 mb-2">🗺️ Google Maps Integration</h4>
          <div className="space-y-1 text-blue-700 text-sm">
            <p>• "Hey Flix, take me to the airport" → Automatically opens Google Maps with directions</p>
            <p>• "Navigate to Dubai Mall" → Direct navigation to destination</p>
            <p>• "Where is the nearest hospital?" → Opens map search instantly</p>
            <p>• <strong>No popup blockers!</strong> Maps open directly in same tab</p>
          </div>
        </div>
      </div>

      {/* Voice Settings Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">⚙️ Voice Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Voice Assistant</span>
              <input 
                type="checkbox" 
                checked={voiceSettings.isEnabled}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, isEnabled: e.target.checked }))}
                className="toggle" 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Read Notifications</span>
              <input 
                type="checkbox" 
                checked={voiceSettings.readNotifications}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, readNotifications: e.target.checked }))}
                className="toggle" 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Location Services</span>
              <input 
                type="checkbox" 
                checked={voiceSettings.locationServices}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, locationServices: e.target.checked }))}
                className="toggle" 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wake Word</label>
              <select
                value={voiceSettings.wakeWord}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, wakeWord: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="hey_flix">Hey Flix</option>
                <option value="flix_assistant">Flix Assistant</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voice Type</label>
              <select
                value={voiceSettings.voiceType}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, voiceType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="female">Female Voice</option>
                <option value="male">Male Voice</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speech Speed</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.speed}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Slow</span>
                <span>{voiceSettings.speed}x</span>
                <span>Fast</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">🤖 Assistant Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className={`w-3 h-3 rounded-full ${voiceSettings.isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-blue-700">Voice: {voiceSettings.isEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className={`w-3 h-3 rounded-full ${userLocation ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-blue-700">Location: {userLocation ? 'Available' : 'Requesting...'}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className={`w-3 h-3 rounded-full ${isSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-blue-700">Browser: {isSupported ? 'Supported' : 'Not Supported'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;