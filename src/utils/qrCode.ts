import QRCode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 256,
      margin: 2,
      color: {
        dark: '#2563eb',
        light: '#ffffff'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const generateUserQRData = (userId: string, userType: string): string => {
  return JSON.stringify({
    userId,
    userType,
    platform: 'FlixMarket',
    timestamp: Date.now()
  });
};