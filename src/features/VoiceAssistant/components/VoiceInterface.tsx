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
import { openGoogleMaps, getCurrentLocation } from '../utils/locationServices';

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

  // Listen for voice commands
  useEffect(() => {
    const handleVoiceCommand = async (event: CustomEvent) => {
      const { command, confidence } = event.detail;
      
      if (command && confidence > 0.5) {
        resetTranscript();
        const response = await processCommand(command, confidence);
        
        if (response.text) {
          speak(response.text);
        }
        
        // Execute actions
        if (response.actions) {
          response.actions.forEach(action => executeAction(action));
        }
      }
    };

    window.addEventListener('voice-command', handleVoiceCommand as EventListener);
    return () => window.removeEventListener('voice-command', handleVoiceCommand as EventListener);
  }, [processCommand, speak, resetTranscript]);

  const executeAction = (action: VoiceAction) => {
    switch (action.type) {
      case 'open_map':
        openGoogleMaps(action.data);
        break;
      case 'navigate':
        if (action.data.page) {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: action.data.page }));
        }
        break;
      case 'set_reminder':
        // Integrate with reminder system
        console.log('Setting reminder:', action.data);
        break;
      default:
        console.log('Unknown action:', action);
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
          <h1 className="text-2xl font-bold mb-2">🎤 Voice Assistant</h1>
          <p className="text-red-100">Voice recognition is not supported in your browser</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🎤 FlixAssistant</h1>
        <p className="text-purple-100">Your personal AI assistant for FlixMarket</p>
      </div>

      {/* Voice Control Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="mb-6">
            <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                : isSpeaking
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse'
                : 'bg-gradient-to-r from-gray-400 to-gray-500'
            }`}>
              {isListening ? (
                <Mic className="w-16 h-16 text-white" />
              ) : isSpeaking ? (
                <Volume2 className="w-16 h-16 text-white" />
              ) : (
                <MicOff className="w-16 h-16 text-white" />
              )}
            </div>
            
            <div className="mt-4">
              {isListening && (
                <div className="text-red-600 font-bold text-lg">🎤 Listening...</div>
              )}
              {isSpeaking && (
                <div className="text-blue-600 font-bold text-lg">🔊 Speaking...</div>
              )}
              {isProcessing && (
                <div className="text-purple-600 font-bold text-lg">🧠 Processing...</div>
              )}
              {!isListening && !isSpeaking && !isProcessing && (
                <div className="text-gray-600 text-lg">Say "Hey Flix" or tap to start</div>
              )}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-6">
            <button
              onClick={handleManualListening}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } disabled:opacity-50`}
            >
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
            
            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Stop Speaking
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
        <h3 className="text-lg font-bold text-gray-900 mb-4">🚀 Quick Voice Commands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Navigation className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-blue-500" />
              Location & Navigation
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• "Find nearby restaurants with offers"</p>
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