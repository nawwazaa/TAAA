import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  QrCode, 
  Scan, 
  History, 
  Settings,
  Eye,
  Camera,
  Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import EnhancedQRScanner from './EnhancedQRScanner';
import QRCodeDisplay from './QRCodeDisplay';

const QRCodeTabs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'scanner' | 'my-qr' | 'history' | 'settings'>('scanner');

  const [scanHistory, setScanHistory] = useState([
    {
      id: 'scan_001',
      type: 'follow',
      sellerName: 'Mario\'s Pizza Restaurant',
      timestamp: new Date('2024-01-20T14:30:00'),
      flixbitsEarned: 50,
      status: 'completed'
    },
    {
      id: 'scan_002',
      type: 'redeem',
      sellerName: 'TechWorld Electronics',
      timestamp: new Date('2024-01-19T16:45:00'),
      flixbitsEarned: 150,
      status: 'completed'
    }
  ]);

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">📱 QR Code Center</h1>
        <p className="text-blue-100">Complete QR code scanning and management system</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse overflow-x-auto">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'scanner'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Scan className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">QR Scanner</span>
              <span className="responsive-tab-text-short font-medium">Scanner</span>
            </button>
            
            <button
              onClick={() => setActiveTab('my-qr')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'my-qr'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <QrCode className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">My QR Code</span>
              <span className="responsive-tab-text-short font-medium">My QR</span>
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <History className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Scan History</span>
              <span className="responsive-tab-text-short font-medium">History</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`responsive-tab flex items-center space-x-2 rtl:space-x-reverse px-3 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="responsive-tab-icon w-5 h-5" />
              <span className="responsive-tab-text-full font-medium">Settings</span>
              <span className="responsive-tab-text-short font-medium">Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'scanner' && <EnhancedQRScanner />}
          
          {activeTab === 'my-qr' && <QRCodeDisplay />}
          
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">📋 Scan History</h2>
              
              {scanHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Scans Yet</h3>
                  <p className="text-gray-600 mb-4">Start scanning QR codes to build your history!</p>
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
                  >
                    🔍 Start Scanning
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 capitalize">{scan.type} Scan</h4>
                          <p className="text-sm text-gray-600">{scan.sellerName}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {scan.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{scan.timestamp.toLocaleString()}</span>
                        <span className="text-green-600 font-medium">+{scan.flixbitsEarned} FB</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">⚙️ QR Scanner Settings</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Camera Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Prefer Back Camera</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Auto-focus</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Flash Support</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Scanning Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Sound Effects</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Vibration Feedback</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Auto-confirm Scans</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Save Scan History</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Location Verification</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Share Analytics</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeTabs;