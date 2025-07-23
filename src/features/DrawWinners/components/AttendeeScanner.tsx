import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  QrCode,
  MapPin,
  Clock,
  Users,
  Shield,
  Smartphone,
  Navigation
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useQRScanner } from '../hooks/useQRScanner';
import { DrawEvent } from '../types';

interface AttendeeScannerProps {
  event: DrawEvent;
  onAttendeeAdded: (attendee: any) => void;
}

const AttendeeScanner: React.FC<AttendeeScannerProps> = ({ event, onAttendeeAdded }) => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const { isScanning, scanResult, scanQRCode, resetScan } = useQRScanner();
  const [scanMethod, setScanMethod] = useState<'camera' | 'upload' | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError('');
        },
        (error) => {
          setLocationError('Location access required to verify attendance');
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser');
    }
  }, []);

  const startCamera = async () => {
    if (!userLocation) {
      alert('Location access is required to scan QR codes for this event');
      return;
    }

    setScanMethod('camera');
    
    // Simulate camera scanning
    setTimeout(async () => {
      await handleQRScan();
    }, 3000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userLocation) {
      setScanMethod('upload');
      
      // Simulate QR code processing from uploaded image
      setTimeout(async () => {
        await handleQRScan();
      }, 2000);
    }
  };

  const handleQRScan = async () => {
    if (!userLocation || !user) return;

    setIsProcessing(true);

    try {
      // Simulate QR code data (in real app, this would come from camera/image processing)
      const mockQRData = JSON.stringify({
        eventId: event.id,
        type: 'draw_event',
        timestamp: Date.now()
      });

      const result = await scanQRCode(
        mockQRData,
        userLocation,
        event,
        user.id,
        user.name,
        user.email,
        user.phone
      );

      if (result.isValid && result.attendee) {
        // Award Flixbits for attending
        const attendanceBonus = 50;
        updateUser({
          flixbits: (user.flixbits || 0) + attendanceBonus
        });

        // Notify parent component
        onAttendeeAdded(result.attendee);

        alert(`✅ Successfully registered for the draw! You earned ${attendanceBonus} Flixbits for attending.`);
      }
    } catch (error) {
      console.error('Error processing QR scan:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    resetScan();
    setScanMethod(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000;
  };

  const distanceToEvent = userLocation ? 
    calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      event.location.coordinates.lat, 
      event.location.coordinates.lng
    ) : null;

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🎯 Event Check-In</h1>
        <p className="text-purple-100">Scan the QR code at the event location to register for the prize draw</p>
      </div>

      {/* Event Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
              <div>
                <p className="font-medium">{event.location.name}</p>
                <p className="text-sm">{event.location.address}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
              <div>
                <p className="font-medium">{event.eventDate.toLocaleDateString()}</p>
                <p className="text-sm">{event.startTime} - {event.endTime}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
              <p>{event.currentAttendees} / {event.maxAttendees} registered</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 mb-2">🏆 Prizes Available</h3>
              <div className="space-y-1">
                {event.prizes.slice(0, 3).map((prize) => (
                  <p key={prize.id} className="text-yellow-700 text-sm">
                    • {prize.title} ({prize.quantity} winner{prize.quantity > 1 ? 's' : ''})
                  </p>
                ))}
                {event.prizes.length > 3 && (
                  <p className="text-yellow-600 text-sm">+ {event.prizes.length - 3} more prizes</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Navigation className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
          Location Verification
        </h3>
        
        {locationError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 rtl:mr-0 rtl:ml-3" />
              <div>
                <p className="text-red-800 font-medium">Location Access Required</p>
                <p className="text-red-600 text-sm">{locationError}</p>
              </div>
            </div>
          </div>
        ) : userLocation ? (
          <div className={`border rounded-lg p-4 ${
            distanceToEvent && distanceToEvent <= event.location.verificationRadius
              ? 'bg-green-50 border-green-200'
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center">
              {distanceToEvent && distanceToEvent <= event.location.verificationRadius ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 rtl:mr-0 rtl:ml-3" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-500 mr-3 rtl:mr-0 rtl:ml-3" />
              )}
              <div>
                <p className={`font-medium ${
                  distanceToEvent && distanceToEvent <= event.location.verificationRadius
                    ? 'text-green-800'
                    : 'text-orange-800'
                }`}>
                  {distanceToEvent && distanceToEvent <= event.location.verificationRadius
                    ? '✅ You are at the event location'
                    : '⚠️ You need to be closer to the event location'
                  }
                </p>
                <p className={`text-sm ${
                  distanceToEvent && distanceToEvent <= event.location.verificationRadius
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  Distance: {distanceToEvent ? Math.round(distanceToEvent) : '---'}m 
                  (Required: within {event.location.verificationRadius}m)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3 rtl:mr-0 rtl:ml-3"></div>
              <p className="text-blue-800">Getting your location...</p>
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner */}
      {!scanMethod && !scanResult && !isProcessing && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Scan Event QR Code</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={startCamera}
              disabled={!userLocation || (distanceToEvent && distanceToEvent > event.location.verificationRadius)}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-8 rounded-xl font-medium hover:from-blue-600 hover:to-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">📷 Use Camera</h3>
                <p className="text-sm opacity-90">Point camera at printed QR code</p>
              </div>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!userLocation || (distanceToEvent && distanceToEvent > event.location.verificationRadius)}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-8 rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-center">
                <Upload className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">📁 Upload Image</h3>
                <p className="text-sm opacity-90">Select QR code photo</p>
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
          
          {(!userLocation || (distanceToEvent && distanceToEvent > event.location.verificationRadius)) && (
            <div className="mt-4 text-center">
              <p className="text-red-600 text-sm">
                ⚠️ You must be at the event location to scan the QR code
              </p>
            </div>
          )}
        </div>
      )}

      {(scanMethod || isProcessing) && !scanResult && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="relative">
              {scanMethod === 'camera' ? (
                <div className="bg-black rounded-lg aspect-square max-w-sm mx-auto flex items-center justify-center">
                  <div className="text-white text-center">
                    <Camera className="w-20 h-20 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl font-medium">📷 Camera Active</p>
                    <p className="text-sm opacity-75">Point at printed QR code</p>
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
              <p className="text-gray-600">🔍 Scanning QR code...</p>
              
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

      {scanResult && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            {scanResult.isValid ? (
              <div>
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Successfully Registered!</h2>
                <p className="text-gray-600 mb-6">You are now eligible for the prize draw</p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-green-800 mb-2">✅ Registration Confirmed</h3>
                  <div className="space-y-1 text-green-700 text-sm">
                    <p>• Location verified: ✅ Within {event.location.verificationRadius}m</p>
                    <p>• QR code verified: ✅ Valid event QR code</p>
                    <p>• Time verified: ✅ During event hours</p>
                    <p>• User verified: ✅ Account authenticated</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-blue-800 mb-2">🎁 What's Next?</h3>
                  <div className="space-y-1 text-blue-700 text-sm">
                    <p>• You earned 50 Flixbits for attending!</p>
                    <p>• Prize draw will be conducted on {event.drawSettings.drawDate.toLocaleDateString()}</p>
                    <p>• Winners will be notified via email and app notification</p>
                    <p>• You can rate this event after it ends</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">❌ Registration Failed</h2>
                <p className="text-red-600 mb-6">{scanResult.error}</p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-red-800 mb-2">Verification Details</h3>
                  <div className="space-y-1 text-red-700 text-sm">
                    <p>• Location verified: {scanResult.verificationDetails.locationVerified ? '✅' : '❌'}</p>
                    <p>• QR code verified: {scanResult.verificationDetails.qrCodeVerified ? '✅' : '❌'}</p>
                    <p>• Time verified: {scanResult.verificationDetails.timeVerified ? '✅' : '❌'}</p>
                    <p>• User verified: {scanResult.verificationDetails.userVerified ? '✅' : '❌'}</p>
                    {scanResult.verificationDetails.distance && (
                      <p>• Distance: {Math.round(scanResult.verificationDetails.distance)}m</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={resetScanner}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              {scanResult.isValid ? '🎯 Done' : '🔄 Try Again'}
            </button>
          </div>
        </div>
      )}

      {/* Security Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
          🔒 Security Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
          <div className="space-y-2">
            <p>• 📍 <strong>Location Verification:</strong> Must be physically present at event</p>
            <p>• ⏰ <strong>Time Validation:</strong> QR codes expire after event</p>
            <p>• 🔐 <strong>One-Time Scan:</strong> Each person can only register once</p>
            <p>• 📱 <strong>Device Tracking:</strong> Prevents duplicate registrations</p>
          </div>
          <div className="space-y-2">
            <p>• 🎯 <strong>Fair Draw:</strong> Cryptographically secure random selection</p>
            <p>• 🏆 <strong>Transparent Process:</strong> All draws are recorded and auditable</p>
            <p>• 🔄 <strong>Real-time Updates:</strong> Live attendance and winner tracking</p>
            <p>• ⭐ <strong>Rating System:</strong> Rate event creators for quality assurance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeScanner;