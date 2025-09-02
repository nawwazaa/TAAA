import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Camera, 
  MapPin, 
  Users, 
  Shield, 
  Settings, 
  AlertCircle,
  CheckCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { permissionsManager, PermissionStatus } from '../../utils/PermissionsManager';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionsGranted: () => void;
  requiredPermissions: ('camera' | 'location' | 'contacts')[];
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  onPermissionsGranted,
  requiredPermissions
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>({
    camera: 'unknown',
    location: 'unknown',
    contacts: 'unknown'
  });
  const [isRequesting, setIsRequesting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      checkPermissions();
    }
  }, [isOpen]);

  const checkPermissions = async () => {
    const status = await permissionsManager.checkAllPermissions();
    setPermissionStatus(status);
  };

  const requestPermission = async (type: 'camera' | 'location' | 'contacts') => {
    setIsRequesting(true);
    
    try {
      switch (type) {
        case 'camera':
          const stream = await permissionsManager.requestCameraPermission();
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setPermissionStatus(prev => ({ ...prev, camera: 'granted' }));
          }
          break;
          
        case 'location':
          await permissionsManager.requestLocationPermission();
          setPermissionStatus(prev => ({ ...prev, location: 'granted' }));
          break;
          
        case 'contacts':
          // Future implementation
          setPermissionStatus(prev => ({ ...prev, contacts: 'granted' }));
          break;
      }
    } catch (error: any) {
      console.error(`${type} permission error:`, error);
      setPermissionStatus(prev => ({ ...prev, [type]: 'denied' }));
    } finally {
      setIsRequesting(false);
    }
  };

  const requestAllPermissions = async () => {
    setIsRequesting(true);
    
    for (const permission of requiredPermissions) {
      try {
        await requestPermission(permission);
        setCurrentStep(prev => prev + 1);
      } catch (error) {
        console.error(`Failed to get ${permission} permission:`, error);
      }
    }
    
    setIsRequesting(false);
    
    // Check if all required permissions are granted
    const allGranted = requiredPermissions.every(
      permission => permissionStatus[permission] === 'granted'
    );
    
    if (allGranted) {
      onPermissionsGranted();
    }
  };

  const getPermissionInfo = (type: 'camera' | 'location' | 'contacts') => {
    switch (type) {
      case 'camera':
        return {
          icon: <Camera className="w-6 h-6" />,
          title: 'Camera Access',
          description: 'Required to scan QR codes using your device camera',
          required: true
        };
      case 'location':
        return {
          icon: <MapPin className="w-6 h-6" />,
          title: 'Location Access',
          description: 'Used to verify you are near the business for redemptions',
          required: false
        };
      case 'contacts':
        return {
          icon: <Users className="w-6 h-6" />,
          title: 'Contacts Access',
          description: 'Future feature for sharing QR codes with contacts',
          required: false
        };
    }
  };

  const openBrowserSettings = () => {
    alert('To enable permissions:\n\n1. Click the lock/camera icon in your browser address bar\n2. Select "Allow" for camera and location\n3. Refresh the page and try again');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Shield className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-blue-600" />
              Permissions Required
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            <p className="text-gray-600">
              To use the QR scanner, we need access to the following permissions:
            </p>
            
            {requiredPermissions.map((permission) => {
              const info = getPermissionInfo(permission);
              const status = permissionStatus[permission];
              
              return (
                <div key={permission} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className={`p-2 rounded-lg ${
                        status === 'granted' ? 'bg-green-100 text-green-600' :
                        status === 'denied' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{info.title}</h3>
                        <p className="text-sm text-gray-600">{info.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {status === 'granted' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : status === 'denied' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span className={`text-sm font-medium ${
                        status === 'granted' ? 'text-green-600' :
                        status === 'denied' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {status === 'granted' ? 'Granted' :
                         status === 'denied' ? 'Denied' :
                         status === 'prompt' ? 'Pending' : 'Unknown'}
                      </span>
                    </div>
                  </div>
                  
                  {status === 'denied' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                      <p className="text-red-700 text-sm">
                        Permission denied. Please enable in browser settings.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="space-y-3">
            {requiredPermissions.some(p => permissionStatus[p] !== 'granted') ? (
              <>
                <button
                  onClick={requestAllPermissions}
                  disabled={isRequesting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
                >
                  {isRequesting ? (
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Requesting Permissions...</span>
                    </div>
                  ) : (
                    'Grant Permissions'
                  )}
                </button>
                
                <button
                  onClick={openBrowserSettings}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <Settings className="w-5 h-5" />
                  <span>Open Browser Settings</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onPermissionsGranted}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-colors"
              >
                Continue to Scanner
              </button>
            )}
            
            <button
              onClick={onClose}
              className="w-full text-gray-600 py-2 rounded-lg font-medium hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;