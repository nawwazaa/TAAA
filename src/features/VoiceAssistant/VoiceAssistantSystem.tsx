import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Mic, 
  Bell, 
  MapPin, 
  Settings, 
  Brain,
  Volume2,
  Smartphone,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import VoiceInterface from './components/VoiceInterface';

const VoiceAssistantSystem: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'interface' | 'settings' | 'analytics'>('interface');

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🎤 FlixAssistant</h1>
        <p className="text-purple-100">AI-powered voice assistant with location services and smart notifications</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('interface')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'interface'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Mic className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Voice Interface</span>
              <span className="responsive-tab-text-short font-medium">Voice Interface</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Settings</span>
              <span className="responsive-tab-text-short font-medium">Settings</span>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Brain className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Analytics</span>
              <span className="responsive-tab-text-short font-medium">Analytics</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'interface' && <VoiceInterface />}
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">🔧 Voice Assistant Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Voice Recognition</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Enable Voice Assistant</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Always Listen for Wake Word</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Voice Feedback</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Read Notifications Aloud</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Filter by Interests</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Priority Notifications Only</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Location Services</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Enable Location Access</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Auto-Open Maps</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Location-Based Suggestions</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Store Voice Commands</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Personalized Responses</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Share Usage Analytics</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">📊 Voice Assistant Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Commands</p>
                      <p className="text-3xl font-bold text-gray-900">247</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-lg">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Success Rate</p>
                      <p className="text-3xl font-bold text-gray-900">94%</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Avg Response Time</p>
                      <p className="text-3xl font-bold text-gray-900">1.2s</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Daily Usage</p>
                      <p className="text-3xl font-bold text-gray-900">23</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Most Used Commands</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">"Find nearby restaurants"</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">45 times</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">"Read my notifications"</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">32 times</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">"Open my wallet"</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">28 times</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">"Set a reminder"</span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">19 times</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Features */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">🚀 Assistant Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-900 flex items-center">
              <Mic className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              Voice Recognition
            </h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Natural language processing</li>
              <li>• Multi-language support</li>
              <li>• Wake word detection</li>
              <li>• Continuous listening</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              Location Services
            </h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Find nearby offers</li>
              <li>• Google Maps integration</li>
              <li>• Location-based suggestions</li>
              <li>• Navigation assistance</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              Smart Notifications
            </h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Read notifications aloud</li>
              <li>• Interest-based filtering</li>
              <li>• Priority management</li>
              <li>• Interactive responses</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-900 flex items-center">
              <Smartphone className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              App Integration
            </h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Navigate between features</li>
              <li>• Check wallet balance</li>
              <li>• Set reminders</li>
              <li>• Control app functions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantSystem;