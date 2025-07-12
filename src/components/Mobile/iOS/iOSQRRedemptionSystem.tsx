import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  QrCode,
  User,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Gift,
  Smartphone,
  Scan,
  History,
  Shield,
  ChevronRight,
  Settings,
  Bell,
  Share2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface QRCodeData {
  id: string;
  type: 'offer' | 'service' | 'event' | 'reward';
  offerId?: string;
  serviceId?: string;
  eventId?: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  value: number;
  originalPrice?: number;
  discountedPrice?: number;
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  validFrom: Date;
  validUntil: Date;
  maxRedemptions: number;
  currentRedemptions: number;
  isActive: boolean;
  createdAt: Date;
}

interface RedemptionRecord {
  id: string;
  qrCodeId: string;
  userId: string;
  userName: string;
  sellerId: string;
  sellerName: string;
  redemptionDate: Date;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  deviceInfo: {
    userAgent: string;
    platform: string;
    timestamp: number;
  };
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
}

const iOSQRRedemptionSystem: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'wallet'>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMethod, setScanMethod] = useState<'camera' | 'upload' | null>(null);
  const [scannedQRData, setScannedQRData] = useState<QRCodeData | null>(null);
  const [redemptionStatus, setRedemptionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample QR codes database
  const [qrCodesDatabase] = useState<QRCodeData[]>([
    {
      id: 'qr_offer_001',
      type: 'offer',
      offerId: 'offer1',
      sellerId: 'seller1',
      sellerName: 'Mario\'s Pizza Restaurant',
      title: 'Fresh Pizza Special - 30% Off',
      description: 'Delicious authentic Italian pizza with fresh ingredients',
      value: 150,
      originalPrice: 500,
      discountedPrice: 350,
      location: {
        address: 'Dubai Mall, Ground Floor',
        city: 'Dubai',
        coordinates: { lat: 25.1972, lng: 55.2744 }
      },
      validFrom: new Date('2024-01-15'),
      validUntil: new Date('2024-02-15'),
      maxRedemptions: 100,
      currentRedemptions: 23,
      isActive: true,
      createdAt: new Date('2024-01-15')
    }
  ]);

  // Redemption history
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionRecord[]>([
    {
      id: 'redemption_001',
      qrCodeId: 'qr_offer_002',
      userId: user?.id || '',
      userName: user?.name || '',
      sellerId: 'seller3',
      sellerName: 'Fashion Boutique',
      redemptionDate: new Date('2024-01-14'),
      location: {
        lat: 25.0657,
        lng: 55.1364,
        address: 'JBR Beach, Dubai'
      },
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: 'iOS',
        timestamp: Date.now()
      },
      status: 'completed',
      transactionId: 'txn_001'
    }
  ]);

  // iOS-specific haptic feedback simulation
  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    setHapticFeedback(true);
    setTimeout(() => setHapticFeedback(false), 100);
    
    // In real iOS app, this would be:
    // import { Haptics } from '@capacitor/haptics';
    // Haptics.impact({ style: type });
  };

  // Get user's current location with iOS-specific permissions
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location access denied:', error);
          // In iOS app, would show native permission dialog
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  }, []);

  const generateTransactionId = () => {
    return `ios_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const validateQRCode = (qrData: QRCodeData): { isValid: boolean; error?: string } => {
    if (!qrData) {
      return { isValid: false, error: 'Invalid QR code format' };
    }

    if (!qrData.isActive) {
      return { isValid: false, error: 'This QR code has been deactivated' };
    }

    const now = new Date();
    if (now < qrData.validFrom || now > qrData.validUntil) {
      return { isValid: false, error: 'This QR code has expired or is not yet valid' };
    }

    if (qrData.currentRedemptions >= qrData.maxRedemptions) {
      return { isValid: false, error: 'This QR code has reached its maximum redemption limit' };
    }

    // iOS-specific: Check if user has already redeemed this QR code
    const userAlreadyRedeemed = redemptionHistory.some(
      record => record.qrCodeId === qrData.id && 
               record.userId === user?.id && 
               record.status === 'completed'
    );
    
    if (userAlreadyRedeemed) {
      return { isValid: false, error: 'You have already redeemed this QR code' };
    }

    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        qrData.location.coordinates.lat,
        qrData.location.coordinates.lng
      );
      
      if (distance > 1) {
        return { isValid: false, error: `You must be within 1km of ${qrData.location.address} to redeem this offer` };
      }
    }

    return { isValid: true };
  };

  const processRedemption = async (qrData: QRCodeData) => {
    setRedemptionStatus('processing');
    triggerHapticFeedback('medium');
    
    try {
      const validation = validateQRCode(qrData);
      if (!validation.isValid) {
        setErrorMessage(validation.error || 'Invalid QR code');
        setRedemptionStatus('error');
        triggerHapticFeedback('error');
        return;
      }

      const redemptionRecord: RedemptionRecord = {
        id: generateTransactionId(),
        qrCodeId: qrData.id,
        userId: user?.id || '',
        userName: user?.name || '',
        sellerId: qrData.sellerId,
        sellerName: qrData.sellerName,
        redemptionDate: new Date(),
        location: {
          lat: userLocation?.lat || 0,
          lng: userLocation?.lng || 0,
          address: 'Current Location'
        },
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: 'iOS',
          timestamp: Date.now()
        },
        status: 'completed',
        transactionId: generateTransactionId()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setRedemptionHistory(prev => [...prev, redemptionRecord]);
      qrData.currentRedemptions += 1;

      updateUser({
        flixbits: (user?.flixbits || 0) + qrData.value
      });

      setRedemptionStatus('success');
      triggerHapticFeedback('success');

      // iOS-specific: Show local notification
      // In real iOS app: LocalNotifications.schedule()

      setTimeout(() => {
        setRedemptionStatus('idle');
        setScannedQRData(null);
        setScanMethod(null);
        setIsScanning(false);
      }, 3000);

    } catch (error) {
      setErrorMessage('Failed to process redemption. Please try again.');
      setRedemptionStatus('error');
      triggerHapticFeedback('error');
    }
  };

  const startCamera = async () => {
    triggerHapticFeedback('light');
    setIsScanning(true);
    setScanMethod('camera');
    
    // iOS-specific camera permissions
    // In real iOS app: Camera.requestPermissions()
    
    setTimeout(() => {
      const mockQRData = qrCodesDatabase[0];
      setScannedQRData(mockQRData);
      setIsScanning(false);
      triggerHapticFeedback('medium');
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      triggerHapticFeedback('light');
      setScanMethod('upload');
      setIsScanning(true);
      
      setTimeout(() => {
        const mockQRData = qrCodesDatabase[0];
        setScannedQRData(mockQRData);
        setIsScanning(false);
        triggerHapticFeedback('medium');
      }, 2000);
    }
  };

  const resetScanner = () => {
    triggerHapticFeedback('light');
    setScannedQRData(null);
    setIsScanning(false);
    setScanMethod(null);
    setRedemptionStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showIOSActionSheet = () => {
    setShowActionSheet(true);
    triggerHapticFeedback('light');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* iOS-style Status Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">9:41 AM</div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
            <div className="text-sm">100%</div>
          </div>
        </div>
      </div>

      {/* iOS-style Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FlixMarket</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => triggerHapticFeedback('light')}
              className="p-2 rounded-full bg-gray-100"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => triggerHapticFeedback('light')}
              className="p-2 rounded-full bg-gray-100"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS-style Segmented Control */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => {
              setActiveTab('scan');
              triggerHapticFeedback('light');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'scan'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Scan QR
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              triggerHapticFeedback('light');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            History
          </button>
          <button
            onClick={() => {
              setActiveTab('wallet');
              triggerHapticFeedback('light');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'wallet'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Wallet
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {activeTab === 'scan' && (
          <div className="space-y-6">
            {!scanMethod && !scannedQRData && redemptionStatus === 'idle' && (
              <div className="space-y-4">
                {/* iOS-style Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <QrCode className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Scan QR Code</h2>
                    <p className="text-gray-600">Scan QR codes to redeem offers and earn Flixbits</p>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={startCamera}
                      className="w-full bg-blue-500 text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center space-x-3 active:bg-blue-600 transition-colors"
                    >
                      <Camera className="w-6 h-6" />
                      <span>Open Camera</span>
                    </button>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-medium text-lg flex items-center justify-center space-x-3 active:bg-gray-200 transition-colors"
                    >
                      <Upload className="w-6 h-6" />
                      <span>Choose from Photos</span>
                    </button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* iOS-style Info Card */}
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
                  <h3 className="font-bold text-blue-900 mb-2">How it works</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>• Point your camera at any QR code</p>
                    <p>• We'll verify your location and eligibility</p>
                    <p>• Earn Flixbits instantly upon redemption</p>
                    <p>• Each QR code can only be used once</p>
                  </div>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
                <div className="relative mb-6">
                  {scanMethod === 'camera' ? (
                    <div className="bg-black rounded-2xl aspect-square max-w-sm mx-auto flex items-center justify-center">
                      <div className="text-white text-center">
                        <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                        <p className="text-lg font-medium">Camera Active</p>
                        <p className="text-sm opacity-75">Point at QR code</p>
                      </div>
                      
                      {/* iOS-style scanning overlay */}
                      <div className="absolute inset-4 border-2 border-white rounded-2xl opacity-50">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-2xl aspect-square max-w-sm mx-auto flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="w-16 h-16 mx-auto mb-4 animate-pulse text-gray-500" />
                        <p className="text-lg font-medium text-gray-700">Processing Image</p>
                        <p className="text-sm text-gray-500">Analyzing QR code...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-gray-600">Scanning for QR code...</p>
                  
                  <button
                    onClick={resetScanner}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {scannedQRData && redemptionStatus === 'idle' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{scannedQRData.title}</h2>
                  <p className="text-gray-600 mb-4">{scannedQRData.description}</p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{scannedQRData.sellerName}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{scannedQRData.location.address}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Valid until: {scannedQRData.validUntil.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl border border-green-200 p-4 mb-6">
                    <h3 className="font-bold text-green-800 mb-2">Redemption Reward</h3>
                    <p className="text-green-700 text-2xl font-bold">
                      +{scannedQRData.value} Flixbits
                    </p>
                    {scannedQRData.originalPrice && scannedQRData.discountedPrice && (
                      <p className="text-green-600 text-sm">
                        Save {scannedQRData.originalPrice - scannedQRData.discountedPrice} Flixbits!
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => processRedemption(scannedQRData)}
                      className="w-full bg-green-500 text-white py-4 rounded-xl font-medium text-lg active:bg-green-600 transition-colors"
                    >
                      Redeem Now
                    </button>
                    
                    <button
                      onClick={resetScanner}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium active:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {redemptionStatus === 'processing' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Redemption</h2>
                <p className="text-gray-600 mb-6">Please wait while we validate and process your QR code...</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <p>✅ Validating QR code authenticity</p>
                  <p>✅ Checking redemption eligibility</p>
                  <p>✅ Verifying location proximity</p>
                  <p>⏳ Processing reward...</p>
                </div>
              </div>
            )}

            {redemptionStatus === 'success' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">Success!</h2>
                <p className="text-gray-600 mb-4">Your QR code has been successfully redeemed</p>
                
                <div className="bg-green-50 rounded-xl border border-green-200 p-4 mb-6">
                  <h3 className="font-bold text-green-800 mb-2">Reward Earned!</h3>
                  <p className="text-green-700 text-2xl font-bold">
                    +{scannedQRData?.value} Flixbits
                  </p>
                  <p className="text-green-600 text-sm mt-2">
                    New balance: {user?.flixbits.toLocaleString()} Flixbits
                  </p>
                </div>
                
                <div className="space-y-2 text-sm text-green-600">
                  <p>✅ QR code validated and redeemed</p>
                  <p>✅ Flixbits added to your wallet</p>
                  <p>✅ Transaction recorded securely</p>
                </div>
              </div>
            )}

            {redemptionStatus === 'error' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">Redemption Failed</h2>
                <p className="text-red-600 mb-6">{errorMessage}</p>
                
                <button
                  onClick={resetScanner}
                  className="w-full bg-blue-500 text-white py-4 rounded-xl font-medium text-lg active:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Redemption History</h2>
              
              {redemptionHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Redemptions Yet</h3>
                  <p className="text-gray-600 mb-4">Start scanning QR codes to build your history!</p>
                  <button
                    onClick={() => setActiveTab('scan')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium active:bg-blue-600 transition-colors"
                  >
                    Start Scanning
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {redemptionHistory.map((record) => (
                    <div key={record.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">QR Code Redemption</h4>
                          <p className="text-sm text-gray-600">From: {record.sellerName}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {record.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                          <p className="font-medium">Date</p>
                          <p>{record.redemptionDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">Location</p>
                          <p>{record.location.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Your Flixbits</h2>
                <p className="text-4xl font-bold mb-2">{user?.flixbits.toLocaleString()}</p>
                <p className="text-orange-100">≈ ${((user?.flixbits || 0) * 0.1).toFixed(2)} USD</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">QR Code Redemption</p>
                    <p className="text-sm text-gray-600">January 14, 2024</p>
                  </div>
                  <span className="text-green-600 font-bold">+150 FB</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Welcome Bonus</p>
                    <p className="text-sm text-gray-600">January 12, 2024</p>
                  </div>
                  <span className="text-green-600 font-bold">+100 FB</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* iOS-style Action Sheet */}
      {showActionSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6 pb-8">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  startCamera();
                  setShowActionSheet(false);
                }}
                className="w-full bg-blue-500 text-white py-4 rounded-xl font-medium text-lg"
              >
                Open Camera
              </button>
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowActionSheet(false);
                }}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-medium text-lg"
              >
                Choose from Photos
              </button>
              <button
                onClick={() => setShowActionSheet(false)}
                className="w-full bg-red-100 text-red-600 py-4 rounded-xl font-medium text-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS-style Haptic Feedback Indicator */}
      {hapticFeedback && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg z-50">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default iOSQRRedemptionSystem;