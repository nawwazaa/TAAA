export const verifyLocationProximity = (
  userLat: number,
  userLng: number,
  eventLat: number,
  eventLng: number,
  radiusMeters: number
): boolean => {
  const distance = calculateDistance(userLat, userLng, eventLat, eventLng);
  return distance <= radiusMeters;
};

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Convert to meters
};

export const generateAttendeeId = (): string => {
  return `attendee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateClaimCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateQRCodeData = (eventId: string, eventType: string = 'draw_event'): string => {
  return JSON.stringify({
    eventId,
    type: eventType,
    timestamp: Date.now(),
    version: '1.0'
  });
};

export const validateQRCodeData = (qrData: string): { isValid: boolean; data?: any; error?: string } => {
  try {
    const parsed = JSON.parse(qrData);
    
    if (!parsed.eventId || !parsed.type) {
      return { isValid: false, error: 'Missing required QR code fields' };
    }

    if (parsed.type !== 'draw_event') {
      return { isValid: false, error: 'Invalid QR code type' };
    }

    return { isValid: true, data: parsed };
  } catch (error) {
    return { isValid: false, error: 'Invalid QR code format' };
  }
};

export const formatTimeRemaining = (endDate: Date): string => {
  const now = new Date();
  const timeDiff = endDate.getTime() - now.getTime();
  
  if (timeDiff <= 0) return 'Expired';
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'active': return 'bg-green-100 text-green-800';
    case 'ended': return 'bg-blue-100 text-blue-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getPrizeTypeIcon = (type: string): string => {
  switch (type) {
    case 'flixbits': return '🪙';
    case 'physical': return '📦';
    case 'voucher': return '🎟️';
    case 'service': return '🛠️';
    default: return '🎁';
  }
};

export const exportWinners = (winners: any[], eventTitle: string) => {
  const csvContent = [
    ['Winner Name', 'Email', 'Phone', 'Prize', 'Prize Type', 'Value', 'Claim Code', 'Status', 'Selected Date'].join(','),
    ...winners.map(winner => [
      winner.userName,
      winner.userEmail || 'N/A',
      winner.userPhone || 'N/A',
      winner.prizeTitle,
      winner.prizeType,
      winner.prizeValue,
      winner.claimCode,
      winner.claimStatus,
      winner.selectedAt.toLocaleDateString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_winners_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};