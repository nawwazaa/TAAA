import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, X, UserPlus, Store, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ScannedUser {
  userId: string;
  userType: 'user' | 'seller' | 'influencer';
  name: string;
  platform: string;
  timestamp: number;
}

const QRScanner: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedUser | null>(null);
  const [scanMethod, setScanMethod] = useState<'camera' | 'upload' | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followSuccess, setFollowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate camera access
  const startCamera = async () => {
    setIsScanning(true);
    setScanMethod('camera');
    
    // Simulate camera initialization
    setTimeout(() => {
      // Simulate successful QR scan after 3 seconds
      setTimeout(() => {
        simulateQRScan();
      }, 3000);
    }, 1000);
  };

  const simulateQRScan = () => {
    // Simulate scanning a seller's QR code
    const mockScannedData: ScannedUser = {
      userId: 'seller_123',
      userType: 'seller',
      name: 'Mario\'s Pizza Restaurant',
      platform: 'FlixMarket',
      timestamp: Date.now()
    };
    
    setScannedData(mockScannedData);
    setIsScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScanMethod('upload');
      setIsScanning(true);
      
      // Simulate QR code processing from uploaded image
      setTimeout(() => {
        simulateQRScan();
      }, 2000);
    }
  };

  const handleFollow = async () => {
    if (!scannedData) return;
    
    setIsFollowing(true);
    
    // Simulate follow action
    setTimeout(() => {
      setIsFollowing(false);
      setFollowSuccess(true);
      
      // Award Flixbits for following
      const bonusFlixbits = scannedData.userType === 'seller' ? 50 : 
                           scannedData.userType === 'influencer' ? 75 : 25;
      
      updateUser({
        flixbits: (user?.flixbits || 0) + bonusFlixbits
      });
      
      // Show success for 3 seconds then reset
      setTimeout(() => {
        setFollowSuccess(false);
        setScannedData(null);
        setScanMethod(null);
      }, 3000);
    }, 1500);
  };

  const resetScanner = () => {
    setScannedData(null);
    setIsScanning(false);
    setScanMethod(null);
    setFollowSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'seller':
        return <Store className="w-8 h-8 text-blue-500" />;
      case 'influencer':
        return <Users className="w-8 h-8 text-purple-500" />;
      default:
        return <UserPlus className="w-8 h-8 text-green-500" />;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'seller':
        return 'from-blue-500 to-teal-500';
      case 'influencer':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-green-500 to-teal-500';
    }
  };

  const getBonusFlixbits = (userType: string) => {
    switch (userType) {
      case 'seller':
        return 50;
      case 'influencer':
        return 75;
      default:
        return 25;
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">QR Scanner</h1>
        <p className="text-blue-100">Scan QR codes to follow sellers and influencers</p>
      </div>

      {!scanMethod && !scannedData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Scan Method</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={startCamera}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 rounded-xl font-medium hover:from-blue-600 hover:to-teal-600 transition-colors"
            >
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Use Camera</h3>
                <p className="text-sm opacity-90">Point camera at QR code</p>
              </div>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-colors"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Upload Image</h3>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="relative">
              {scanMethod === 'camera' ? (
                <div className="bg-black rounded-lg aspect-square max-w-sm mx-auto flex items-center justify-center">
                  <div className="text-white text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <p className="text-lg font-medium">Camera Active</p>
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
                    <Upload className="w-16 h-16 mx-auto mb-4 animate-pulse text-gray-500" />
                    <p className="text-lg font-medium text-gray-700">Processing Image</p>
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
              <p className="text-gray-600">Scanning for QR code...</p>
              
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

      {scannedData && !followSuccess && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="mb-6">
              <div className={`bg-gradient-to-r ${getUserTypeColor(scannedData.userType)} p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center`}>
                {getUserTypeIcon(scannedData.userType)}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{scannedData.name}</h2>
              <p className="text-gray-600 capitalize mb-1">{t(scannedData.userType)}</p>
              <p className="text-sm text-gray-500">FlixMarket User</p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-yellow-800 mb-2">Follow Bonus!</h3>
              <p className="text-yellow-700">
                Earn <span className="font-bold">+{getBonusFlixbits(scannedData.userType)} Flixbits</span> for following this {scannedData.userType}
              </p>
              {scannedData.userType === 'seller' && (
                <p className="text-sm text-yellow-600 mt-2">
                  You'll receive notifications about their special offers!
                </p>
              )}
              {scannedData.userType === 'influencer' && (
                <p className="text-sm text-yellow-600 mt-2">
                  Get updates on their latest campaigns and content!
                </p>
              )}
            </div>
            
            <div className="flex space-x-4 rtl:space-x-reverse justify-center">
              <button
                onClick={handleFollow}
                disabled={isFollowing}
                className={`bg-gradient-to-r ${getUserTypeColor(scannedData.userType)} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center space-x-2 rtl:space-x-reverse`}
              >
                {isFollowing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Following...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Follow & Earn {getBonusFlixbits(scannedData.userType)} Flixbits</span>
                  </>
                )}
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

      {followSuccess && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Followed!</h2>
            <p className="text-gray-600 mb-4">
              You're now following <span className="font-semibold">{scannedData?.name}</span>
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-green-800 mb-2">Flixbits Earned!</h3>
              <p className="text-green-700">
                <span className="text-2xl font-bold">+{getBonusFlixbits(scannedData?.userType || 'user')} Flixbits</span> added to your wallet
              </p>
              <p className="text-sm text-green-600 mt-2">
                New balance: {user?.flixbits.toLocaleString()} Flixbits
              </p>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p>✅ You'll receive notifications about their offers</p>
              <p>✅ Earn more Flixbits from their activities</p>
              <p>✅ Get priority access to exclusive deals</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">How QR Scanning Works</h3>
        <div className="space-y-3 text-blue-700">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <p>Scan a seller's or influencer's QR code using camera or upload image</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
            <p>Follow them to receive targeted offers and notifications</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
            <p>Earn Flixbits for following and engaging with their content</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
            <p>Get exclusive access to special deals and early notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;