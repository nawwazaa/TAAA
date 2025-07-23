import { LocationResult } from '../types';

export const findNearbyPlaces = async (
  userLocation: { lat: number; lng: number },
  type: string,
  radius: number = 2000
): Promise<LocationResult[]> => {
  // In a real app, this would call Google Places API or similar
  // For demo, we'll return sample data based on location
  
  const samplePlaces: LocationResult[] = [
    {
      id: 'place_001',
      name: 'Mario\'s Pizza Restaurant',
      type: 'restaurant',
      address: 'Dubai Mall, Ground Floor, Dubai',
      coordinates: {
        lat: userLocation.lat + 0.001,
        lng: userLocation.lng + 0.001
      },
      distance: 150,
      rating: 4.8,
      priceRange: '$$',
      offers: [
        {
          id: 'offer_001',
          title: 'Fresh Pizza Special',
          discount: 30,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      ],
      phone: '+971-4-123-4567',
      website: 'https://mariospizza.ae',
      openingHours: {
        'Monday': '10:00 AM - 11:00 PM',
        'Tuesday': '10:00 AM - 11:00 PM',
        'Wednesday': '10:00 AM - 11:00 PM',
        'Thursday': '10:00 AM - 11:00 PM',
        'Friday': '10:00 AM - 12:00 AM',
        'Saturday': '10:00 AM - 12:00 AM',
        'Sunday': '10:00 AM - 11:00 PM'
      }
    },
    {
      id: 'place_002',
      name: 'TechWorld Electronics',
      type: 'store',
      address: 'Mall of Emirates, Level 2, Dubai',
      coordinates: {
        lat: userLocation.lat - 0.002,
        lng: userLocation.lng + 0.003
      },
      distance: 320,
      rating: 4.6,
      priceRange: '$$$',
      offers: [
        {
          id: 'offer_002',
          title: 'Smartphone Sale',
          discount: 25,
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      ],
      phone: '+971-4-987-6543',
      openingHours: {
        'Monday': '10:00 AM - 10:00 PM',
        'Tuesday': '10:00 AM - 10:00 PM',
        'Wednesday': '10:00 AM - 10:00 PM',
        'Thursday': '10:00 AM - 10:00 PM',
        'Friday': '10:00 AM - 11:00 PM',
        'Saturday': '10:00 AM - 11:00 PM',
        'Sunday': '10:00 AM - 10:00 PM'
      }
    },
    {
      id: 'place_005',
      name: 'City Center Shopping Mall',
      type: 'store',
      address: 'Deira City Centre, Dubai',
      coordinates: {
        lat: userLocation.lat + 0.003,
        lng: userLocation.lng - 0.001
      },
      distance: 280,
      rating: 4.5,
      priceRange: '$$',
      offers: [
        {
          id: 'offer_005',
          title: 'Weekend Shopping Sale',
          discount: 20,
          validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        }
      ],
      phone: '+971-4-295-1010'
    },
    {
      id: 'place_006',
      name: 'Fashion District Store',
      type: 'store',
      address: 'Business Bay, Dubai',
      coordinates: {
        lat: userLocation.lat - 0.001,
        lng: userLocation.lng + 0.002
      },
      distance: 190,
      rating: 4.7,
      priceRange: '$$$',
      phone: '+971-4-567-8901'
    },
    {
      id: 'place_003',
      name: 'Luxury Spa & Wellness',
      type: 'service',
      address: 'Atlantis The Palm, Dubai',
      coordinates: {
        lat: userLocation.lat + 0.005,
        lng: userLocation.lng - 0.002
      },
      distance: 580,
      rating: 4.9,
      priceRange: '$$$$',
      offers: [
        {
          id: 'offer_003',
          title: 'Spa Day Package',
          discount: 40,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      ],
      phone: '+971-4-426-2000',
      website: 'https://atlantis.com/spa'
    },
    {
      id: 'place_004',
      name: 'Coffee Corner Café',
      type: 'restaurant',
      address: 'Business Bay, Dubai',
      coordinates: {
        lat: userLocation.lat - 0.001,
        lng: userLocation.lng - 0.001
      },
      distance: 95,
      rating: 4.4,
      priceRange: '$',
      offers: [
        {
          id: 'offer_004',
          title: 'Morning Coffee Deal',
          discount: 20,
          validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
      ],
      phone: '+971-50-123-4567',
      openingHours: {
        'Monday': '6:00 AM - 10:00 PM',
        'Tuesday': '6:00 AM - 10:00 PM',
        'Wednesday': '6:00 AM - 10:00 PM',
        'Thursday': '6:00 AM - 10:00 PM',
        'Friday': '6:00 AM - 11:00 PM',
        'Saturday': '7:00 AM - 11:00 PM',
        'Sunday': '7:00 AM - 10:00 PM'
      }
    }
  ];

  // Filter by type and distance
  return samplePlaces
    .filter(place => {
      if (type !== 'any' && type !== 'store' && place.type !== type) return false;
      if (type === 'store' && place.type !== 'store') return false;
      return place.distance <= radius;
    })
    .sort((a, b) => a.distance - b.distance);
};

export const openGoogleMaps = (location: { lat: number; lng: number; name?: string; address?: string }) => {
  const { lat, lng, name, address } = location;
  
  // Create Google Maps URL
  const query = name || address || `${lat},${lng}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&center=${lat},${lng}`;
  
  // Open in new tab
  window.open(mapsUrl, '_blank');
};

export const openGoogleMapsSearch = (searchQuery: string, userLocation?: { lat: number; lng: number }) => {
  console.log('🗺️ Opening Google Maps search for:', searchQuery);
  
  let mapsUrl = '';
  
  if (userLocation) {
    // Search with user's location as starting point
    mapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${encodeURIComponent(searchQuery)}`;
  } else {
    // Simple search
    mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
  }
  
  console.log('🔗 Opening URL:', mapsUrl);
  
  // Open in new tab
  window.open(mapsUrl, '_blank');
};

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Convert to meters
};

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};