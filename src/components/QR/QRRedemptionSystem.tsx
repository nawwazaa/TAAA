import React, { useState, useRef, useEffect } from 'react';
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
  RotateCcw,
  RefreshCw
} from 'lucide-react';

interface QRCodeData {
  id: string;
  type: 'offer' | 'service' | 'event' | 'reward' | 'follow-up' | 'collection';
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
  // Mock user for demo purposes
  const [user] = useState({
    id: 'user123',
    name: 'John Doe',
    flixbits: 1500,
    userType: 'buyer'
  });

  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'seller-scan'>('scan');
  const [scanContext, setScanContext] = useState<'redemption' | 'follow-up' | 'collection'>('redemption');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMethod, setScanMethod] = useState<'camera' | 'upload' | null>(null);
  const [scannedQRData, setScannedQRData] = useState<QRCodeData | null>(null);
  const [redemptionStatus, setRedemptionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Permission states
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('prompt');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('prompt');
  const [contactPermission, setContactPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('prompt');
  
  // Camera stream state
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      validUntil: new Date('2024-12-31'),
      maxRedemptions: 100,
      currentRedemptions: 23,
      isActive: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'qr_followup_001',
      type: 'follow-up',
      sellerId: 'seller2',
      sellerName: 'TechFix Solutions',
      title: 'Service Follow-up QR',
      description: 'Scan to provide feedback on your recent service',
      value: 50,
      location: {
        address: 'Mall of Emirates, Level 2',
        city: 'Dubai',
        coordinates: { lat: 25.1181, lng: 55.2001 }
      },
      validFrom: new Date('2024-01-10'),
      validUntil: new Date('2024-12-31'),
      maxRedemptions: 1,
      currentRedemptions: 0,
      isActive: true,
      createdAt: new Date('2024-01-10')
    },
    {
      id: 'qr_collection_001',
      type: 'collection',
      sellerId: 'seller3',
      sellerName: 'Fashion Store',
      title: 'Item Collection QR',
      description: 'Scan to collect your purchased items',
      value: 25,
      location: {
        address: 'JBR Beach Mall, Shop 45',
        city: 'Dubai',
        coordinates: { lat: 25.0657, lng: 55.1364 }
      },
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      maxRedemptions: 5,
      currentRedemptions: 2,
      isActive: true,
      createdAt: new Date('2024-01-01')
    }
  ]);

  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionRecord[]>([]);

  // Request Camera Permission
  const requestCameraPermission = async () => {
    setCameraPermission('checking');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera for QR scanning
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setCameraPermission('granted');
      return stream;
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
      setErrorMessage('Camera access is required for QR code scanning. Please enable camera permissions in your browser settings.');
      return null;
    }
  };

  // Request Location Permission
  const requestLocationPermission = async () => {
    setLocationPermission('checking');
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });
      
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      setLocationPermission('granted');
      return true;
    } catch (error) {
      console.error('Location permission denied:', error);
      setLocationPermission('denied');
      return false;
    }
  };

  // Request Contact Permission (for future use)
  const requestContactPermission = async () => {
    setContactPermission('checking');
    // Note: Contact API is not widely supported, this is placeholder for future
    try {
      // if ('contacts' in navigator && 'ContactsManager' in window) {
      //   const contacts = await (navigator as any).contacts.select(['name'], { multiple: true });
      //   setContactPermission('granted');
      //   return true;
      // } else {
        setContactPermission('granted'); // Assume granted for now
        return true;
      // }
    } catch (error) {
      console.error('Contact permission denied:', error);
      setContactPermission('denied');
      return false;
    }
  };

  // Initialize permissions on component mount
  useEffect(() => {
    requestLocationPermission();
    requestContactPermission();
  }, []);

  // Cleanup camera stream
  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start Camera for QR Scanning
  const startCamera = async () => {
    if (cameraPermission !== 'granted') {
      const cameraStream = await requestCameraPermission();
      if (!cameraStream) return;
      setStream(cameraStream);
    }

    setIsScanning(true);
    setScanMethod('camera');
    setCapturedImage(null);
    setErrorMessage('');

    try {
      const mediaStream = stream || await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (!stream) {
        setStream(mediaStream);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      // Simulate QR detection after 3 seconds
      setTimeout(() => {
        if (isScanning) {
          captureFrame();
        }
      }, 3000);

    } catch (error) {
      console.error('Failed to start camera:', error);
      setErrorMessage('Failed to access camera. Please check your camera permissions.');
      setIsScanning(false);
      setScanMethod(null);
    }
  };

  // Capture frame from video
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const capturedImageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(capturedImageData);
        
        // Simulate QR code detection
        setTimeout(() => {
          const mockQRData = qrCodesDatabase.find(qr => {
            if (scanContext === 'redemption') return qr.type === 'offer';
            if (scanContext === 'follow-up') return qr.type === 'follow-up';
            if (scanContext === 'collection') return qr.type === 'collection';
            return true;
          }) || qrCodesDatabase[0];
          
          setScannedQRData(mockQRData);
          setIsScanning(false);
          stopCameraStream();
        }, 1500);
      }
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setScannedQRData(null);
    startCamera();
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScanMethod('upload');
      setIsScanning(true);
      setErrorMessage('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        
        // Simulate QR code processing from uploaded image
        setTimeout(() => {
          const mockQRData = qrCodesDatabase.find(qr => {
            if (scanContext === 'redemption') return qr.type === 'offer';
            if (scanContext === 'follow-up') return qr.type === 'follow-up';
            if (scanContext === 'collection') return qr.type === 'collection';
            return true;
          }) || qrCodesDatabase[1];
          
          setScannedQRData(mockQRData);
          setIsScanning(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate QR Code
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

    const userAlreadyRedeemed = redemptionHistory.some(
      record => record.qrCodeId === qrData.id && record.userId === user?.id && record.status === 'completed'
    );
    
    if (userAlreadyRedeemed && qrData.type !== 'follow-up' && qrData.type !== 'collection') {
      return { isValid: false, error: 'You have already redeemed this QR code' };
    }

    // Location check (skip for follow-up and collection as they may not require strict location)
    if (userLocation && qrData.type === 'offer') {
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

  // Process Redemption
  const processRedemption = async (qrData: QRCodeData) => {
    setRedemptionStatus('processing');
    
    try {
      const validation = validateQRCode(qrData);
      if (!validation.isValid) {
        setErrorMessage(validation.error || 'Invalid QR code');
        setRedemptionStatus('error');
        return;
      }

      // Create redemption record
      const redemptionRecord: RedemptionRecord = {
        id: `redemption_${Date.now()}`,
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
          platform: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          timestamp: Date.now()
        },
        status: 'completed',
        transactionId: `txn_${Date.now()}`
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add to history
      setRedemptionHistory(prev => [...prev, redemptionRecord]);

      // Update QR code
      qrData.currentRedemptions += 1;

      setRedemptionStatus('success');

      // Reset after 3 seconds
      setTimeout(() => {
        resetScanner();
      }, 3000);

    } catch (error) {
      setErrorMessage('Failed to process redemption. Please try again.');
      setRedemptionStatus('error');
    }
  };

  // Reset Scanner
  const resetScanner = () => {
    setScannedQRData(null);
    setIsScanning(false);
    setScanMethod(null);
    setRedemptionStatus('idle');
    setErrorMessage('');
    setCapturedImage(null);
    stopCameraStream();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get QR type icon
  const getQRTypeIcon = (type: string) => {
    switch (type) {
      case 'offer':
        return <Gift className="w-6 h-6 text-green-500" />;
      case 'service':
        return <Star className="w-6 h-6 text-blue-500" />;
      case 'follow-up':
        return <RefreshCw className="w-6 h-6 text-orange-500" />;
      case 'collection':
        return <Smartphone className="w-6 h-6 text-purple-500" />;
      default:
        return <QrCode className="w-6 h-6 text-gray-500" />;
    }
  };

  const getScanContextColor = (context: string) => {
    switch (context) {
      case 'redemption':
        return 'from-green-500 to-blue-500';
      case 'follow-up':
        return 'from-orange-500 to-red-500';
      case 'collection':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  const getScanContextIcon = (context: string) => {
    switch (context) {
      case 'redemption':
        return <Gift className="w-5 h-5" />;
      case 'follow-up':
        return <RefreshCw className="w-5 h-5" />;
      case 'collection':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <Scan className="w-5 h-5" />;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">📱 QR Code Scanner</h1>
        <p className="text-blue-100">Scan QR codes for redemptions, follow-ups, and collections</p>
      </div>

      {/* Permission Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-3">🔐 Permissions Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg ${cameraPermission === 'granted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <Camera className="w-5 h-5 mb-1" />
            <p className="font-medium">Camera: {cameraPermission}</p>
          </div>
          <div className={`p-3 rounded-lg ${locationPermission === 'granted' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            <MapPin className="w-5 h-5 mb-1" />
            <p className="font-medium">Location: {locationPermission}</p>
          </div>
          <div className={`p-3 rounded-lg ${contactPermission === 'granted' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}>
            <User className="w-5 h-5 mb-1" />
            <p className="font-medium">Contacts: {contactPermission}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'scan'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Scan className="w-5 h-5" />
              <span className="font-medium">QR Scanner</span>
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <History className="w-5 h-5" />
              <span className="font-medium">History</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'scan' && (
            <div className="space-y-6">
              {/* Scan Context Selector */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Select Scan Purpose:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setScanContext('redemption')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      scanContext === 'redemption'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <Gift className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Redemption</p>
                    <p className="text-sm opacity-75">Redeem offers & rewards</p>
                  </button>
                  
                  <button
                    onClick={() => setScanContext('follow-up')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      scanContext === 'follow-up'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <RefreshCw className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Follow-up</p>
                    <p className="text-sm opacity-75">Service feedback</p>
                  </button>
                  
                  <button
                    onClick={() => setScanContext('collection')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      scanContext === 'collection'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <Smartphone className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Collection</p>
                    <p className="text-sm opacity-75">Collect purchased items</p>
                  </button>
                </div>
              </div>

              {/* Scanner Interface */}
              {!scanMethod && !scannedQRData && redemptionStatus === 'idle' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Scan Method</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={startCamera}
                      disabled={cameraPermission === 'denied'}
                      className={`p-8 rounded-xl font-medium transition-colors ${
                        cameraPermission === 'denied'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : `bg-gradient-to-r ${getScanContextColor(scanContext)} text-white hover:opacity-90`
                      }`}
                    >
                      <div className="text-center">
                        <Camera className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">📷 Use Camera</h3>
                        <p className="text-sm opacity-90">
                          {cameraPermission === 'denied' 
                            ? 'Camera access denied' 
                            : 'Point camera at QR code'
                          }
                        </p>
                        {cameraPermission === 'denied' && (
                          <p className="text-xs mt-2 opacity-75">
                            Please enable camera in browser settings
                          </p>
                        )}
                      </div>
                    </button>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`bg-gradient-to-r from-green-500 to-teal-500 text-white p-8 rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-colors`}
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

              {/* Camera View */}
              {isScanning && scanMethod === 'camera' && !capturedImage && (
                <div className="text-center">
                  <div className="relative bg-black rounded-lg overflow-hidden max-w-md mx-auto">
                    <video
                      ref={videoRef}
                      className="w-full h-80 object-cover"
                      playsInline
                      muted
                    />
                    
                    {/* Scanning overlay */}
                    <div className="absolute inset-4 border-2 border-blue-500 rounded-lg">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                      
                      {/* Scanning line animation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-1 bg-blue-500 opacity-75 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                      <p className="font-medium">📷 Scanning for QR Code</p>
                      <p className="text-sm opacity-75">Hold steady and align QR code</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={captureFrame}
                      className={`bg-gradient-to-r ${getScanContextColor(scanContext)} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors mr-4`}
                    >
                      📸 Capture
                    </button>
                    
                    <button
                      onClick={resetScanner}
                      className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Processing Upload */}
              {isScanning && scanMethod === 'upload' && !capturedImage && (
                <div className="text-center">
                  <div className="bg-gray-100 rounded-lg aspect-square max-w-sm mx-auto flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="w-20 h-20 mx-auto mb-4 animate-pulse text-gray-500" />
                      <p className="text-xl font-medium text-gray-700">📁 Processing Image</p>
                      <p className="text-sm text-gray-500">Analyzing QR code...</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <p className="text-gray-600">🔍 Scanning for QR code...</p>
                  </div>
                </div>
              )}

              {/* Captured Image Preview */}
              {capturedImage && !scannedQRData && (
                <div className="text-center">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📸 Captured Image</h3>
                    <div className="relative">
                      <img 
                        src={capturedImage} 
                        alt="Captured QR" 
                        className="w-full rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-lg p-4">
                          <div className="flex items-center space-x-2 text-blue-700">
                            <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-medium">Processing QR Code...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 justify-center mt-6">
                      <button
                        onClick={retakePhoto}
                        className="flex items-center space-x-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <RotateCcw className="w-5 h-5" />
                        <span>🔄 Retake</span>
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

              {/* QR Code Details */}
              {scannedQRData && redemptionStatus === 'idle' && (
                <div className="text-center">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 max-w-md mx-auto">
                    {capturedImage && (
                      <div className="mb-4">
                        <img 
                          src={capturedImage} 
                          alt="Scanned QR" 
                          className="w-24 h-24 object-cover rounded-lg mx-auto border border-gray-200"
                        />
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <div className={`bg-gradient-to-r ${getScanContextColor(scanContext)} p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center`}>
                        {getQRTypeIcon(scannedQRData.type)}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{scannedQRData.title}</h2>
                      <p className="text-gray-600 mb-4">{scannedQRData.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center justify-center">
                          <User className="w-4 h-4 mr-2" />
                          <span>{scannedQRData.sellerName}</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{scannedQRData.location.address}</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Valid until: {scannedQRData.validUntil.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`bg-gradient-to-r ${
                      scanContext === 'redemption' ? 'from-green-50 to-blue-50 border-green-200' :
                      scanContext === 'follow-up' ? 'from-orange-50 to-red-50 border-orange-200' :
                      'from-purple-50 to-pink-50 border-purple-200'
                    } border rounded-lg p-4 mb-6`}>
                      <h3 className={`font-bold mb-2 ${
                        scanContext === 'redemption' ? 'text-green-800' :
                        scanContext === 'follow-up' ? 'text-orange-800' :
                        'text-purple-800'
                      }`}>
                        {scanContext === 'redemption' ? '🎁 Redemption Reward' :
                         scanContext === 'follow-up' ? '💬 Follow-up Action' :
                         '📦 Collection Reward'}
                      </h3>
                      <p className={`text-lg font-bold ${
                        scanContext === 'redemption' ? 'text-green-700' :
                        scanContext === 'follow-up' ? 'text-orange-700' :
                        'text-purple-700'
                      }`}>
                        +{scannedQRData.value} Flixbits
                      </p>
                      {scannedQRData.originalPrice && scannedQRData.discountedPrice && (
                        <p className={`text-sm ${
                          scanContext === 'redemption' ? 'text-green-600' :
                          scanContext === 'follow-up' ? 'text-orange-600' :
                          'text-purple-600'
                        }`}>
                          Save {scannedQRData.originalPrice - scannedQRData.discountedPrice} Flixbits!
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={() => processRedemption(scannedQRData)}
                        className={`bg-gradient-to-r ${getScanContextColor(scanContext)} text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-colors`}
                      >
                        {getScanContextIcon(scanContext)}
                        <span className="ml-2">
                          {scanContext === 'redemption' ? '🎯 Redeem Now' :
                           scanContext === 'follow-up' ? '💬 Submit Feedback' :
                           '📦 Confirm Collection'}
                        </span>
                      </button>
                      
                      <button
                        onClick={retakePhoto}
                        className="flex items-center space-x-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <RotateCcw className="w-5 h-5" />
                        <span>🔄 Retake</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Status */}
              {redemptionStatus === 'processing' && (
                <div className="text-center">
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-8 max-w-md mx-auto">
                    <div className={`bg-gradient-to-r ${getScanContextColor(scanContext)} p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center`}>
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {scanContext === 'redemption' ? '⚡ Processing Redemption' :
                       scanContext === 'follow-up' ? '⚡ Processing Feedback' :
                       '⚡ Processing Collection'}
                    </h2>
                    <p className="text-gray-600 mb-4">Please wait while we validate and process your QR code...</p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <p>✅ Validating QR code authenticity</p>
                      <p>✅ Checking eligibility</p>
                      <p>✅ Verifying location proximity</p>
                      <p>⏳ Processing reward...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Status */}
              {redemptionStatus === 'success' && (
                <div className="text-center">
                  <div className="bg-white border-2 border-green-200 rounded-xl p-8 max-w-md mx-auto">
                    <div className={`bg-gradient-to-r ${getScanContextColor(scanContext)} p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center`}>
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {scanContext === 'redemption' ? '🎉 Redemption Successful!' :
                       scanContext === 'follow-up' ? '🎉 Feedback Submitted!' :
                       '🎉 Collection Confirmed!'}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {scanContext === 'redemption' ? 'Your QR code has been successfully redeemed' :
                       scanContext === 'follow-up' ? 'Your feedback has been submitted successfully' :
                       'Your item collection has been confirmed'}
                    </p>
                    
                    <div className={`bg-gradient-to-r ${
                      scanContext === 'redemption' ? 'from-green-50 to-teal-50 border-green-200' :
                      scanContext === 'follow-up' ? 'from-orange-50 to-red-50 border-orange-200' :
                      'from-purple-50 to-pink-50 border-purple-200'
                    } border rounded-lg p-4 mb-6`}>
                      <h3 className={`font-bold mb-2 ${
                        scanContext === 'redemption' ? 'text-green-800' :
                        scanContext === 'follow-up' ? 'text-orange-800' :
                        'text-purple-800'
                      }`}>
                        🎁 Reward Earned!
                      </h3>
                      <p className={`text-2xl font-bold ${
                        scanContext === 'redemption' ? 'text-green-700' :
                        scanContext === 'follow-up' ? 'text-orange-700' :
                        'text-purple-700'
                      }`}>
                        +{scannedQRData?.value} Flixbits
                      </p>
                      <p className={`text-sm mt-2 ${
                        scanContext === 'redemption' ? 'text-green-600' :
                        scanContext === 'follow-up' ? 'text-orange-600' :
                        'text-purple-600'
                      }`}>
                        New balance: {(user?.flixbits + (scannedQRData?.value || 0)).toLocaleString()} Flixbits
                      </p>
                    </div>
                    
                    <div className={`space-y-2 text-sm ${
                      scanContext === 'redemption' ? 'text-green-600' :
                      scanContext === 'follow-up' ? 'text-orange-600' :
                      'text-purple-600'
                    }`}>
                      <p>✅ QR code validated and processed</p>
                      <p>✅ Flixbits added to your wallet</p>
                      <p>✅ Transaction recorded securely</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Status */}
              {redemptionStatus === 'error' && (
                <div className="text-center">
                  <div className="bg-white border-2 border-red-200 rounded-xl p-8 max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <AlertCircle className="w-12 h-12 text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">❌ Process Failed</h2>
                    <p className="text-red-600 mb-6">{errorMessage}</p>
                    
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={resetScanner}
                        className={`bg-gradient-to-r ${getScanContextColor(scanContext)} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors`}
                      >
                        🔄 Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Hidden canvas for image capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">📋 QR Code History</h2>
              
              {redemptionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No QR Codes Scanned Yet</h3>
                  <p className="text-gray-600 mb-4">Start scanning QR codes to build your history!</p>
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
                          <h4 className="font-bold text-gray-900 flex items-center">
                            {getQRTypeIcon('offer')}
                            <span className="ml-2">QR Code Scanned</span>
                          </h4>
                          <p className="text-sm text-gray-600">From: {record.sellerName}</p>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
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
        </div>
      </div>

      {/* Security & Features Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">🔒 QR Scanner Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
          <div className="space-y-2">
            <p>• 📷 <strong>Camera Integration:</strong> Real-time QR code scanning</p>
            <p>• 🔄 <strong>Retake Option:</strong> Capture perfect scans every time</p>
            <p>• 📱 <strong>Multiple Contexts:</strong> Redemption, follow-up, collection</p>
            <p>• 🛡️ <strong>Permission Handling:</strong> Secure camera & location access</p>
          </div>
          <div className="space-y-2">
            <p>• 📍 <strong>Location Verification:</strong> Proximity-based validation</p>
            <p>• 🚫 <strong>Duplicate Prevention:</strong> One-time use protection</p>
            <p>• 📊 <strong>Real-time Processing:</strong> Instant QR code recognition</p>
            <p>• 💾 <strong>Secure Storage:</strong> Encrypted transaction history</p>
          </div>
        </div>
      </div>
    </div>
  );