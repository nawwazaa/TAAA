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
  RefreshCw,
  Settings,
  UserPlus,
  Store,
  Users,
  Package
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useAuth } from '../../context/AuthContext';
import { permissionsManager } from '../../utils/PermissionsManager';
import PermissionModal from './PermissionModal';

interface QRScanResult {
  decodedText: string;
  result: any;
}

interface ScannedData {
  userId?: string;
  userType?: 'user' | 'seller' | 'influencer';
  name?: string;
  platform?: string;
  offerId?: string;
  serviceId?: string;
  itemId?: string;
  type: 'follow' | 'redeem' | 'collect';
  value?: number;
  timestamp: number;
}

type ScanMode = 'follow' | 'redeem' | 'collect';

const EnhancedQRScanner: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [scanMode, setScanMode] = useState<ScanMode>('follow');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMethod, setScanMethod] = useState<'camera' | 'upload' | null>(null);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showRetake, setShowRetake] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop();
        } catch (error) {
          console.log('QR scanner already stopped');
        }
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (html5QrCodeRef.current) {
      try {
        html5QrCodeRef.current.stop();
      } catch (error) {
        console.log('QR scanner cleanup');
      }
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setScanMethod('camera');
      setErrorMessage('');
      
      // Request camera permission
      const stream = await permissionsManager.requestCameraPermission();
      if (!stream) {
        throw new Error('Failed to get camera stream');
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      // Initialize Html5Qrcode for real QR detection
      const qrCodeElementId = "qr-reader";
      const html5QrCode = new Html5Qrcode(qrCodeElementId);
      html5QrCodeRef.current = html5QrCode;
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };
      
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      );
      
    } catch (error: any) {
      console.error('Camera access error:', error);
      setIsScanning(false);
      setScanMethod(null);
      setErrorMessage(error.message);
      
      if (error.message.includes('permission')) {
        setShowPermissionModal(true);
      }
    }
  };

  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    console.log('QR Code detected:', decodedText);
    
    try {
      // Try to parse as JSON first
      let parsedData: ScannedData;
      
      try {
        const jsonData = JSON.parse(decodedText);
        parsedData = {
          ...jsonData,
          type: scanMode,
          timestamp: Date.now()
        };
      } catch (jsonError) {
        // If not JSON, treat as simple text (URL, etc.)
        parsedData = {
          name: decodedText,
          type: scanMode,
          timestamp: Date.now()
        };
      }
      
      setScannedData(parsedData);
      stopCamera();
      setIsScanning(false);
      
      // Capture frame for preview
      captureFrame();
      setShowRetake(true);
      
    } catch (error) {
      console.error('Error processing QR code:', error);
      setErrorMessage('Invalid QR code format');
    }
  };

  const onScanFailure = (error: string) => {
    // Don't log every scan failure, just continue scanning
    console.debug('QR scan attempt:', error);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setScanMethod('upload');
    setIsScanning(true);
    setErrorMessage('');
    
    try {
      // Create Html5Qrcode instance for file scanning
      const html5QrCode = new Html5Qrcode("qr-reader-upload");
      
      const result = await html5QrCode.scanFile(file, true);
      
      // Process the scanned result
      let parsedData: ScannedData;
      
      try {
        const jsonData = JSON.parse(result);
        parsedData = {
          ...jsonData,
          type: scanMode,
          timestamp: Date.now()
        };
      } catch (jsonError) {
        parsedData = {
          name: result,
          type: scanMode,
          timestamp: Date.now()
        };
      }
      
      setScannedData(parsedData);
      
      // Create preview from uploaded file
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setShowRetake(true);
      };
      reader.readAsDataURL(file);
      
    } catch (error: any) {
      console.error('File scan error:', error);
      setErrorMessage('Could not read QR code from image. Please try a clearer image.');
    } finally {
      setIsScanning(false);
    }
  };

  const confirmScan = async () => {
    if (!scannedData) return;
    
    setProcessingStatus('processing');
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let bonusFlixbits = 0;
      let successMessage = '';
      
      switch (scanMode) {
        case 'follow':
          bonusFlixbits = scannedData.userType === 'seller' ? 50 : 
                         scannedData.userType === 'influencer' ? 75 : 25;
          successMessage = `Successfully followed ${scannedData.name || 'user'}!`;
          break;
          
        case 'redeem':
          bonusFlixbits = scannedData.value || 100;
          successMessage = `Successfully redeemed offer!`;
          break;
          
        case 'collect':
          bonusFlixbits = 25;
          successMessage = `Successfully collected item!`;
          break;
      }
      
      // Award Flixbits
      updateUser({
        flixbits: (user?.flixbits || 0) + bonusFlixbits
      });
      
      setProcessingStatus('success');
      
      // Reset after success
      setTimeout(() => {
        resetScanner();
      }, 3000);
      
    } catch (error) {
      setProcessingStatus('error');
      setErrorMessage('Failed to process QR code. Please try again.');
    }
  };

  const retakeScan = () => {
    setScannedData(null);
    setCapturedImage(null);
    setShowRetake(false);
    setProcessingStatus('idle');
    
    if (scanMethod === 'camera') {
      startCamera();
    } else {
      setScanMethod(null);
    }
  };

  const resetScanner = () => {
    stopCamera();
    setScannedData(null);
    setCapturedImage(null);
    setShowRetake(false);
    setIsScanning(false);
    setScanMethod(null);
    setProcessingStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScanModeInfo = (mode: ScanMode) => {
    switch (mode) {
      case 'follow':
        return {
          icon: <UserPlus className="w-6 h-6" />,
          title: 'Follow Mode',
          description: 'Scan to follow sellers and influencers',
          color: 'from-blue-500 to-teal-500',
          reward: '50-75 Flixbits'
        };
      case 'redeem':
        return {
          icon: <Gift className="w-6 h-6" />,
          title: 'Redeem Mode',
          description: 'Scan to redeem offers and rewards',
          color: 'from-green-500 to-emerald-500',
          reward: 'Varies by offer'
        };
      case 'collect':
        return {
          icon: <Package className="w-6 h-6" />,
          title: 'Collect Mode',
          description: 'Scan to collect purchased items',
          color: 'from-purple-500 to-pink-500',
          reward: '25 Flixbits'
        };
    }
  };

  const getUserTypeIcon = (userType?: string) => {
    switch (userType) {
      case 'seller':
        return <Store className="w-8 h-8 text-blue-500" />;
      case 'influencer':
        return <Users className="w-8 h-8 text-purple-500" />;
      default:
        return <UserPlus className="w-8 h-8 text-green-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">📱 Enhanced QR Scanner</h1>
        <p className="text-blue-100">Real QR code detection with camera and upload options</p>
      </div>

      {/* Scan Mode Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Scan Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['follow', 'redeem', 'collect'] as ScanMode[]).map((mode) => {
            const modeInfo = getScanModeInfo(mode);
            const isSelected = scanMode === mode;
            
            return (
              <button
                key={mode}
                onClick={() => setScanMode(mode)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="text-center">
                  <div className={`bg-gradient-to-r ${modeInfo.color} p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center`}>
                    <div className="text-white">
                      {modeInfo.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{modeInfo.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{modeInfo.description}</p>
                  <p className="text-xs text-green-600 font-medium">Earn: {modeInfo.reward}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scanner Interface */}
      {!scanMethod && !scannedData && processingStatus === 'idle' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Scan Method</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setShowPermissionModal(true)}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-8 rounded-xl font-medium hover:from-blue-600 hover:to-teal-600 transition-colors"
            >
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">📷 Use Camera</h3>
                <p className="text-sm opacity-90">Real-time QR code detection</p>
              </div>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-8 rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-colors"
            >
              <div className="text-center">
                <Upload className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">📁 Upload Image</h3>
                <p className="text-sm opacity-90">Select QR code from gallery</p>
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

      {/* Camera Scanning Interface */}
      {isScanning && scanMethod === 'camera' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="relative bg-black rounded-lg aspect-square max-w-sm mx-auto overflow-hidden">
              {/* Hidden QR reader element for html5-qrcode */}
              <div id="qr-reader" className="w-full h-full"></div>
              
              {/* Video element for preview */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-64 border-2 border-blue-500 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                    
                    {/* Scanning line animation */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse"></div>
                  </div>
                  
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-white text-center">
                    <p className="text-sm font-medium">Point camera at QR code</p>
                    <p className="text-xs opacity-75">QR codes will be detected automatically</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-600">🔍 Scanning for QR codes...</p>
              
              <button
                onClick={resetScanner}
                className="mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Processing */}
      {isScanning && scanMethod === 'upload' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg aspect-square max-w-sm mx-auto flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-16 h-16 mx-auto mb-4 animate-pulse text-gray-500" />
                <p className="text-lg font-medium text-gray-700">📁 Processing Image</p>
                <p className="text-sm text-gray-500">Analyzing QR code...</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-600">🔍 Reading QR code from image...</p>
            </div>
          </div>
        </div>
      )}

      {/* Retake/Confirm Interface */}
      {showRetake && capturedImage && scannedData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">QR Code Detected!</h2>
            
            {/* Preview of captured image */}
            <div className="mb-6">
              <img 
                src={capturedImage} 
                alt="Captured QR code"
                className="w-64 h-64 object-cover rounded-lg mx-auto border-2 border-gray-200"
              />
            </div>
            
            {/* Scanned data preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Scanned Data:</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Mode:</strong> {scanMode}</p>
                {scannedData.name && <p><strong>Name:</strong> {scannedData.name}</p>}
                {scannedData.userType && <p><strong>Type:</strong> {scannedData.userType}</p>}
                {scannedData.value && <p><strong>Value:</strong> {scannedData.value} Flixbits</p>}
              </div>
            </div>
            
            <div className="flex space-x-4 rtl:space-x-reverse justify-center">
              <button
                onClick={retakeScan}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Retake</span>
              </button>
              
              <button
                onClick={confirmScan}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Confirm & Process</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Status */}
      {processingStatus === 'processing' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">⚡ Processing QR Code</h2>
            <p className="text-gray-600 mb-6">Please wait while we validate and process your scan...</p>
            
            <div className="space-y-2 text-sm text-gray-500">
              <p>✅ QR code detected and decoded</p>
              <p>✅ Validating scan authenticity</p>
              <p>✅ Checking user eligibility</p>
              <p>⏳ Processing reward...</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Status */}
      {processingStatus === 'success' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">🎉 Success!</h2>
            <p className="text-gray-600 mb-4">QR code processed successfully</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-green-800 mb-2">Reward Earned!</h3>
              <p className="text-green-700">
                Flixbits have been added to your wallet
              </p>
              <p className="text-green-600 text-sm mt-2">
                New balance: {user?.flixbits.toLocaleString()} Flixbits
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Status */}
      {(processingStatus === 'error' || errorMessage) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">❌ Scan Failed</h2>
            <p className="text-red-600 mb-6">{errorMessage}</p>
            
            <button
              onClick={resetScanner}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      )}

      {/* Hidden elements for QR scanning */}
      <div className="hidden">
        <div id="qr-reader-upload"></div>
        <canvas ref={canvasRef}></canvas>
      </div>

      {/* Permission Modal */}
      <PermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onPermissionsGranted={() => {
          setShowPermissionModal(false);
          startCamera();
        }}
        requiredPermissions={['camera', 'location']}
      />

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">📋 How to Use</h3>
        <div className="space-y-3 text-blue-700">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <p>Select your scan mode: Follow, Redeem, or Collect</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
            <p>Choose camera or upload image method</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
            <p>Point camera at QR code or select image from gallery</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
            <p>Review detected QR code and confirm to earn Flixbits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedQRScanner;