import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Share2, Copy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const QRCodeDisplay: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';

  const handleDownload = () => {
    if (user?.qrCode) {
      const link = document.createElement('a');
      link.href = user.qrCode;
      link.download = `${user.name}_QRCode.png`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && user?.qrCode) {
      try {
        const response = await fetch(user.qrCode);
        const blob = await response.blob();
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        
        // Check if file sharing is supported
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'My FlixMarket QR Code',
            text: 'Scan this QR code to connect with me on FlixMarket!',
            files: [file]
          });
        } else {
          // Fallback to sharing without files
          const profileLink = `https://flixmarket.com/profile/${user?.id}`;
          await navigator.share({
            title: 'My FlixMarket QR Code',
            text: `Scan this QR code to connect with me on FlixMarket! Visit: ${profileLink}`,
            url: profileLink
          });
        }
      } catch (error) {
        console.error('Error sharing:', error);
        // Provide user-friendly feedback
        if (error.name === 'AbortError') {
          // User cancelled the share
          return;
        } else {
          alert('Unable to share at this time. You can copy the profile link instead.');
        }
      }
    } else {
      // Web Share API not supported, fallback to copy link
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const profileLink = `https://flixmarket.com/profile/${user?.id}`;
    navigator.clipboard.writeText(profileLink);
    alert('Profile link copied to clipboard!');
  };

  if (!user?.qrCode) {
    return (
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-600">QR Code not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">{t('qrCode')}</h1>
        <p className="text-blue-100">Share your QR code to connect with others</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="inline-block p-6 bg-white rounded-xl shadow-lg border-2 border-gray-100">
            <img 
              src={user.qrCode} 
              alt="User QR Code" 
              className="w-64 h-64 mx-auto"
            />
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h2>
            <p className="text-gray-600 capitalize mb-4">{t(user.userType)}</p>
            
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <Copy className="w-5 h-5" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">How to use your QR Code</h3>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
            <p>Share your QR code with sellers, influencers, or other users</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
            <p>When they scan it, you'll be connected on FlixMarket</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
            <p>Receive targeted offers and notifications based on your connections</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
            <p>Earn Flixbits for successful referrals and interactions</p>
          </div>
        </div>
      </div>

      {user.userType === 'seller' && (
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-green-800 mb-2">Seller Benefits</h3>
          <p className="text-green-700 mb-4">
            Display this QR code in your store so customers can easily follow you and receive your offer notifications.
          </p>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600 font-medium">Pro Tip:</p>
            <p className="text-sm text-green-700">
              Print this QR code and place it near your checkout counter or entrance for maximum visibility.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;