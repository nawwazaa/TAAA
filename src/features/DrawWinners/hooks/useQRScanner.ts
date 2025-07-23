import { useState, useCallback } from 'react';
import { QRScanResult, EventAttendee, DrawEvent } from '../types';
import { verifyLocationProximity, generateAttendeeId } from '../utils/helpers';

export const useQRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Convert to meters
  };

  const scanQRCode = useCallback(async (
    qrData: string,
    userLocation: { lat: number; lng: number },
    event: DrawEvent,
    userId: string,
    userName: string,
    userEmail: string,
    userPhone: string
  ): Promise<QRScanResult> => {
    setIsScanning(true);

    try {
      // Parse QR code data
      let parsedData;
      try {
        parsedData = JSON.parse(qrData);
      } catch {
        return {
          isValid: false,
          error: 'Invalid QR code format',
          verificationDetails: {
            locationVerified: false,
            timeVerified: false,
            qrCodeVerified: false,
            userVerified: false
          }
        };
      }

      // Verify QR code belongs to this event
      if (parsedData.eventId !== event.id) {
        return {
          isValid: false,
          error: 'QR code does not belong to this event',
          verificationDetails: {
            locationVerified: false,
            timeVerified: false,
            qrCodeVerified: false,
            userVerified: false
          }
        };
      }

      // Check if QR code is still active
      if (!event.qrCode.isActive || new Date() > event.qrCode.expiresAt) {
        return {
          isValid: false,
          error: 'QR code has expired',
          verificationDetails: {
            locationVerified: false,
            timeVerified: false,
            qrCodeVerified: false,
            userVerified: false
          }
        };
      }

      // Verify location proximity
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        event.location.coordinates.lat,
        event.location.coordinates.lng
      );

      const locationVerified = distance <= event.location.verificationRadius;
      if (!locationVerified) {
        return {
          isValid: false,
          error: `You must be within ${event.location.verificationRadius}m of ${event.location.name} to scan this QR code. You are ${Math.round(distance)}m away.`,
          verificationDetails: {
            locationVerified: false,
            timeVerified: true,
            qrCodeVerified: true,
            userVerified: true,
            distance
          }
        };
      }

      // Check if user already scanned
      const alreadyScanned = event.attendees.some(attendee => attendee.userId === userId);
      if (alreadyScanned) {
        return {
          isValid: false,
          error: 'You have already scanned this QR code for this event',
          verificationDetails: {
            locationVerified: true,
            timeVerified: true,
            qrCodeVerified: true,
            userVerified: false
          }
        };
      }

      // Check event capacity
      if (event.currentAttendees >= event.maxAttendees) {
        return {
          isValid: false,
          error: 'Event has reached maximum capacity',
          verificationDetails: {
            locationVerified: true,
            timeVerified: true,
            qrCodeVerified: true,
            userVerified: false
          }
        };
      }

      // Create attendee record
      const attendee: EventAttendee = {
        id: generateAttendeeId(),
        userId,
        userName,
        userEmail,
        userPhone,
        scanTime: new Date(),
        location: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          accuracy: 10 // meters
        },
        deviceInfo: {
          platform: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          userAgent: navigator.userAgent,
          ip: '192.168.1.1' // In real app, get from server
        },
        verificationStatus: 'verified',
        isEligibleForDraw: true,
        qrScanData: {
          qrCodeId: event.qrCode.id,
          scanId: `scan_${Date.now()}`,
          verificationHash: btoa(`${userId}_${event.id}_${Date.now()}`)
        }
      };

      return {
        isValid: true,
        attendee,
        verificationDetails: {
          locationVerified: true,
          timeVerified: true,
          qrCodeVerified: true,
          userVerified: true,
          distance
        }
      };

    } catch (error) {
      return {
        isValid: false,
        error: 'Error processing QR code scan',
        verificationDetails: {
          locationVerified: false,
          timeVerified: false,
          qrCodeVerified: false,
          userVerified: false
        }
      };
    } finally {
      setIsScanning(false);
    }
  }, []);

  const resetScan = () => {
    setScanResult(null);
    setIsScanning(false);
  };

  return {
    isScanning,
    scanResult,
    scanQRCode,
    resetScan,
    setScanResult
  };
};