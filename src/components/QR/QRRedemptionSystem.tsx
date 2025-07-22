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
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  value: number; // Flixbits value
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

const QRRedemptionSystem: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'seller-scan'>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMethod, setScanMethod] = useState<'camera' | 'upload' | null>(null);
  const [scannedQRData, setScannedQRData] = useState<QRCodeData | null>(null);
  const [redemptionStatus, setRedemptionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sample QR codes database (in real app, this would be from backend)
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
    },
    {
      id: 'qr_service_001',
      type: 'service',
      serviceId: 'service1',
      sellerId: 'seller2',
      sellerName: 'TechFix Solutions',
      title: 'Phone Repair Service Completed',
      description: 'iPhone screen replacement service',
      value: 200,
      location: {
        address: 'Mall of Emirates, Level 2',
        city: 'Dubai',
        coordinates: { lat: 25.1181, lng: 55.2001 }
      },
      validFrom: new Date('2024-01-10'),
      validUntil: new Date('2024-01-20'),
      maxRedemptions: 1,
      currentRedemptions: 0,
      isActive: true,
      createdAt: new Date('2024-01-10')
    }
  ]);

  // Redemption history (in real app, this would be from backend)
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
        platform: 'mobile',
        timestamp: Date.now()
      },
      status: 'completed',
      transactionId: 'txn_001'
    }
  ]);

  // Get user's current location
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
        }
      );
    }
  }, []);

  const generateTransactionId = () => {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  const validateQRCode = (qrData: QRCodeData): { isValid: boolean; error?: string } => {
    // Check if QR code exists
    if (!qrData) {
      return { isValid: false, error: 'Invalid QR code format' };
    }

    // Check if QR code is active
    if (!qrData.isActive) {
      return { isValid: false, error: 'This QR code has been deactivated' };
    }

    // Check if QR code is within valid date range
    const now = new Date();
    if (now < qrData.validFrom || now > qrData.validUntil) {
      return { isValid: false, error: 'This QR code has expired or is not yet valid' };
    }

    // Check if maximum redemptions reached
    if (qrData.currentRedemptions >= qrData.maxRedemptions) {
      return { isValid: false, error: 'This QR code has reached its maximum redemption limit' };
    }

    // Check if user has already redeemed this QR code
    const userAlreadyRedeemed = redemptionHistory.some(
      record => record.qrCodeId === qrData.id && record.userId === user?.id && record.status === 'completed'
    );
    
    if (userAlreadyRedeemed) {
      return { isValid: false, error: 'You have already redeemed this QR code' };
    }

    // Check location proximity (within 1km of seller location)
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        qrData.location.coordinates.lat,
        qrData.location.coordinates.lng
      );
      
      if (distance > 1) { // More than 1km away
        return { isValid: false, error: `You must be within 1km of ${qrData.location.address} to redeem this offer` };
      }
    }

    return { isValid: true };
  };

  const processRedemption = async (qrData: QRCodeData) => {
    setRedemptionStatus('processing');
    
    try {
      // Validate QR code
      const validation = validateQRCode(qrData);
      if (!validation.isValid) {
        setErrorMessage(validation.error || 'Invalid QR code');
        console.warn('Geolocation is not supported by this browser');
        resolve({ lat: 0, lng: 0 }); // Default coordinates
        return;
      }

      // Create redemption record
      const redemptionRecord: RedemptionRecord = {
        id: generateTransactionId(),
        qrCodeId: qrData.id,
        userId: user?.id || '',
        userName: user?.name || '',
        sellerId: qrData.sellerId,
        sellerName: qrData.sellerName,
        location: {
          lat: userLocation?.lat || 0,
          lng: userLocation?.lng || 0,
          address: 'Current Location'
        },
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          timestamp: Date.now()
        },
        status: 'completed',
        transactionId: generateTransactionId()
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add to redemption history
      setRedemptionHistory(prev => [...prev, redemptionRecord]);

      // Update QR code redemption count
      qrData.currentRedemptions += 1;

      // Award Flixbits to user
      updateUser({
        flixbits: (user?.flixbits || 0) + qrData.value
      });

      setRedemptionStatus('success');

      // Reset after 3 seconds
      setTimeout(() => {
        setRedemptionStatus('idle');
        setScannedQRData(null);
        setScanMethod(null);
        setIsScanning(false);
      }, 3000);

    } catch (error) {
      setErrorMessage('Failed to process redemption. Please try again.');
      setRedemptionStatus('error');
    }
  };

  const startCamera = async () => {
    setIsScanning(true);
    setScanMethod('camera');
    
    // Simulate camera scanning
    setTimeout(() => {
      // Simulate successful QR scan
      const mockQRData = qrCodesDatabase[0];
      setScannedQRData(mockQRData);
      setIsScanning(false);
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScanMethod('upload');
      setIsScanning(true);
      
      // Simulate QR code processing from uploaded image
      setTimeout(() => {
        const mockQRData = qrCodesDatabase[1];
        setScannedQRData(mockQRData);
        setIsScanning(false);
      }, 2000);
    }
  };

  const resetScanner = () => {
    setScannedQRData(null);
    setIsScanning(false);
    setScanMethod(null);
    setRedemptionStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getQRTypeIcon = (type: string) => {
    switch (type) {
      case 'offer':
        return <Gift className="w-6 h-6 text-green-500" />;
      case 'service':
        return <Star className="w-6 h-6 text-blue-500" />;
      case 'event':
        return <MapPin className="w-6 h-6 text-purple-500" />;
      default:
        return <QrCode className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">📱 QR Code Redemption</h1>
        <p className="text-blue-100">Scan QR codes to redeem offers, services, and rewards</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'scan'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Scan className="w-5 h-5" />
              <span className="font-medium">Scan QR Code</span>
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <History className="w-5 h-5" />
              <span className="font-medium">Redemption History</span>
            </button>
            
            {(user?.userType === 'seller' || user?.userType === 'influencer') && (
              <button
                onClick={() => setActiveTab('seller-scan')}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                  activeTab === 'seller-scan'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Seller Scanner</span>
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {/* Scan QR Code Tab */}
          {activeTab === 'scan' && (
            <div className="space-y-6">
              {!scanMethod && !scannedQRData && redemptionStatus === 'idle' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Scan Method</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={startCamera}
                      className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-8 rounded-xl font-medium hover:from-blue-600 hover:to-teal-600 transition-colors"
                    >
                      <div className="text-center">
                        <Camera className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">📷 Use Camera</h3>
                        <p className="text-sm opacity-90">Point camera at QR code</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-8 rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">📁 Upload Image</h3>
                        <p className="text-sm opacity-90">Select QR code image</p>
                      </div>
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
              )}

              {isScanning && (
                <div className="text-center">
                  <div className="relative">
                    {scanMethod === 'camera' ? (
                      <div className="bg-black rounded-lg aspect-square max-w-sm mx-auto flex items-center justify-center">
                        <div className="text-white text-center">
                          <Camera className="w-20 h-20 mx-auto mb-4 animate-pulse" />
                          <p className="text-xl font-medium">📷 Camera Active</p>
                          <p className="text-sm opacity-75">Point at QR code to scan</p>
                        </div>
                        
                        {/* Scanning overlay */}
                        <div className="absolute inset-4 border-2 border-blue-500 rounded-lg">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-lg aspect-square max-w-sm mx-auto flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="w-20 h-20 mx-auto mb-4 animate-pulse text-gray-500" />
                          <p className="text-xl font-medium text-gray-700">📁 Processing Image</p>
                          <p className="text-sm text-gray-500">Analyzing QR code...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <p className="text-gray-600">🔍 Scanning for QR code...</p>
                    
                    <button
                      onClick={resetScanner}
                      className="mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {scannedQRData && redemptionStatus === 'idle' && (
                <div className="text-center">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 max-w-md mx-auto">
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        {getQRTypeIcon(scannedQRData.type)}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{scannedQRData.title}</h2>
                      <p className="text-gray-600 mb-4">{scannedQRData.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center justify-center">
                          <User className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{scannedQRData.sellerName}</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>{scannedQRData.location.address}</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                          <span>Valid until: {scannedQRData.validUntil.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
                      <h3 className="font-bold text-green-800 mb-2">🎁 Redemption Reward</h3>
                      <p className="text-green-700 text-lg font-bold">
                        +{scannedQRData.value} Flixbits
                      </p>
                      {scannedQRData.originalPrice && scannedQRData.discountedPrice && (
                        <p className="text-green-600 text-sm">
                          Save {scannedQRData.originalPrice - scannedQRData.discountedPrice} Flixbits!
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-4 rtl:space-x-reverse justify-center">
                      <button
                        onClick={() => processRedemption(scannedQRData)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-colors"
                      >
                        🎯 Redeem Now
                      </button>
                      
                      <button
                        onClick={resetScanner}
                        className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {redemptionStatus === 'processing' && (
                <div className="text-center">
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-8 max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">⚡ Processing Redemption</h2>
                    <p className="text-gray-600 mb-4">Please wait while we validate and process your QR code...</p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <p>✅ Validating QR code authenticity</p>
                      <p>✅ Checking redemption eligibility</p>
                      <p>✅ Verifying location proximity</p>
                      <p>⏳ Processing reward...</p>
                    </div>
                  </div>
                </div>
              )}

              {redemptionStatus === 'success' && (
                <div className="text-center">
                  <div className="bg-white border-2 border-green-200 rounded-xl p-8 max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Redemption Successful!</h2>
                    <p className="text-gray-600 mb-4">Your QR code has been successfully redeemed</p>
                    
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 mb-6">
                      <h3 className="font-bold text-green-800 mb-2">🎁 Reward Earned!</h3>
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
                </div>
              )}

              {redemptionStatus === 'error' && (
                <div className="text-center">
                  <div className="bg-white border-2 border-red-200 rounded-xl p-8 max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <AlertCircle className="w-12 h-12 text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">❌ Redemption Failed</h2>
                    <p className="text-red-600 mb-6">{errorMessage}</p>
                    
                    <div className="flex space-x-4 rtl:space-x-reverse justify-center">
                      <button
                        onClick={resetScanner}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
                      >
                        🔄 Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Redemption History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">📋 Redemption History</h2>
              
              {redemptionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Redemptions Yet</h3>
                  <p className="text-gray-600 mb-4">Start scanning QR codes to build your redemption history!</p>
                  <button
                    onClick={() => setActiveTab('scan')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
                  >
                    🔍 Start Scanning
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {redemptionHistory.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">QR Code Redemption</h4>
                          <p className="text-sm text-gray-600">From: {record.sellerName}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <p className="font-medium">Date</p>
                          <p>{record.redemptionDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">Time</p>
                          <p>{record.redemptionDate.toLocaleTimeString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">Location</p>
                          <p>{record.location.address}</p>
                        </div>
                        <div>
                          <p className="font-medium">Transaction ID</p>
                          <p className="font-mono text-xs">{record.transactionId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Seller Scanner Tab */}
          {activeTab === 'seller-scan' && (user?.userType === 'seller' || user?.userType === 'influencer') && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">🛡️ Seller QR Scanner</h2>
              <p className="text-gray-600">Scan customer QR codes to validate purchases and process redemptions</p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-800 mb-4">🔒 Seller Verification Features</h3>
                <div className="space-y-2 text-green-700">
                  <p>• ✅ Validate customer purchase QR codes</p>
                  <p>• 🔍 Verify redemption authenticity</p>
                  <p>• 📍 Check location proximity</p>
                  <p>• 🚫 Prevent duplicate redemptions</p>
                  <p>• 📊 Track redemption analytics</p>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={startCamera}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-colors"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Scan className="w-6 h-6" />
                    <span>🔍 Start Seller Scanner</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">🔒 QR Code Security Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
          <div className="space-y-2">
            <p>• 🛡️ <strong>Unique Redemption:</strong> Each QR code can only be redeemed once per user</p>
            <p>• 📍 <strong>Location Verification:</strong> Must be within 1km of seller location</p>
            <p>• ⏰ <strong>Time Validation:</strong> QR codes have expiration dates</p>
            <p>• 🔐 <strong>Encrypted Data:</strong> All QR codes use secure encryption</p>
          </div>
          <div className="space-y-2">
            <p>• 📱 <strong>Device Tracking:</strong> Redemptions tied to device information</p>
            <p>• 🚫 <strong>Fraud Prevention:</strong> Advanced duplicate detection</p>
            <p>• 📊 <strong>Real-time Monitoring:</strong> All redemptions tracked instantly</p>
            <p>• 🔄 <strong>Blockchain Backup:</strong> Immutable redemption records</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRRedemptionSystem;