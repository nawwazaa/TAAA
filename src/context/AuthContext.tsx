import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Referral } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  generateReferralCode: () => string;
  trackReferral: (referralCode: string) => Promise<boolean>;
  getReferrals: () => Referral[];
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  // Test user accounts for different roles
  const testAccounts = {
    // Regular Users
    'user@test.com': {
      id: 'user_001',
      name: 'Ahmed Hassan Al-Mahmoud',
      email: 'user@test.com',
      phone: '+971501234567',
      userType: 'user' as const,
      location: {
        country: 'UAE',
        city: 'Dubai',
        district: 'Downtown',
        coordinates: { lat: 25.2048, lng: 55.2708 }
      },
      interests: ['Food & Dining', 'Shopping', 'Technology'],
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
      flixbits: 1250,
      createdAt: new Date('2024-01-15'),
      referralCode: 'USER-ABC123'
    },
    
    // Seller Account
    'seller@test.com': {
      id: 'seller_001',
      name: 'Mario\'s Pizza Restaurant',
      email: 'seller@test.com',
      phone: '+971507654321',
      userType: 'seller' as const,
      location: {
        country: 'UAE',
        city: 'Dubai',
        district: 'Marina',
        coordinates: { lat: 25.0657, lng: 55.1364 }
      },
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
      flixbits: 5670,
      createdAt: new Date('2023-11-20'),
      referralCode: 'SELL-XYZ789'
    },
    
    // Influencer Account
    'influencer@test.com': {
      id: 'influencer_001',
      name: 'Sarah Fashion Blogger',
      email: 'influencer@test.com',
      phone: '+966501234567',
      userType: 'influencer' as const,
      location: {
        country: 'Saudi Arabia',
        city: 'Riyadh',
        district: 'Olaya',
        coordinates: { lat: 24.7136, lng: 46.6753 }
      },
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
      flixbits: 3450,
      createdAt: new Date('2023-10-10'),
      referralCode: 'INFL-DEF456'
    },
    
    // Super Admin Account (already exists)
    'admin@flixmarket.com': {
      id: 'admin_super',
      name: 'Super Administrator',
      email: 'admin@flixmarket.com',
      phone: '+971501111111',
      userType: 'user' as const, // Uses user type but has admin access
      location: {
        country: 'UAE',
        city: 'Dubai',
        district: 'DIFC'
      },
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
      flixbits: 99999,
      createdAt: new Date('2023-01-01'),
      referralCode: 'ADMIN-SUPER'
    },
    
    // Sub-Admin Accounts
    'ahmed.rashid@flixmarket.com': {
      id: 'subadmin_001',
      name: 'Ahmed Al-Rashid (Country Manager - UAE)',
      email: 'ahmed.rashid@flixmarket.com',
      phone: '+971501234567',
      userType: 'user' as const,
      location: {
        country: 'UAE',
        city: 'Dubai',
        district: 'Business Bay'
      },
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
      flixbits: 15000,
      createdAt: new Date('2024-01-10'),
      referralCode: 'ADMIN-UAE'
    },
    
    'mohammed.saud@flixmarket.com': {
      id: 'subadmin_002',
      name: 'Mohammed Al-Saud (Country Manager - Saudi)',
      email: 'mohammed.saud@flixmarket.com',
      phone: '+966501234567',
      userType: 'user' as const,
      location: {
        country: 'Saudi Arabia',
        city: 'Riyadh',
        district: 'King Fahd'
      },
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
      flixbits: 18000,
      createdAt: new Date('2024-01-08'),
      referralCode: 'ADMIN-SA'
    },
    
    'sarah.thani@flixmarket.com': {
      id: 'subadmin_003',
      name: 'Sarah Al-Thani (Tournament Manager - Qatar)',
      email: 'sarah.thani@flixmarket.com',
      phone: '+974501234567',
      userType: 'user' as const,
      location: {
        country: 'Qatar',
        city: 'Doha',
        district: 'West Bay'
      },
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
      flixbits: 12000,
      createdAt: new Date('2024-01-12'),
      referralCode: 'ADMIN-QA'
    },
    
    'fatima.sabah@flixmarket.com': {
      id: 'subadmin_004',
      name: 'Fatima Al-Sabah (Customer Support - Kuwait)',
      email: 'fatima.sabah@flixmarket.com',
      phone: '+965501234567',
      userType: 'user' as const,
      location: {
        country: 'Kuwait',
        city: 'Kuwait City',
        district: 'Salmiya'
      },
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiI+PC9zdmc+',
      flixbits: 8000,
      createdAt: new Date('2024-01-15'),
      referralCode: 'ADMIN-KW'
    }
  };
  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load referrals from local storage
    const storedReferrals = localStorage.getItem('referrals');
    if (storedReferrals) {
      setReferrals(JSON.parse(storedReferrals));
    }
  }, []);

  const login = (userData: User) => {
    // Generate referral code if not exists
    if (!userData.referralCode) {
      userData.referralCode = generateReferralCode();
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const loginWithTestAccount = (email: string) => {
    const testUser = testAccounts[email as keyof typeof testAccounts];
    if (testUser) {
      login(testUser);
      return true;
    }
    return false;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const generateReferralCode = (): string => {
    // Generate a unique referral code based on user ID and random characters
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const userPart = user?.id?.substring(0, 4) || 'USER';
    return `${userPart}-${randomPart}`;
  };

  const trackReferral = async (referralCode: string): Promise<boolean> => {
    // Find the user who owns this referral code
    if (!referralCode || !user) return false;
    
    // In a real app, this would be an API call to verify the referral code
    // For demo purposes, we'll simulate finding a referrer
    const referrerId = `user_${Date.now() - 100000}`; // Simulate a user ID
    const referrerName = "Existing User"; // Simulate a user name
    
    // Create a new referral record
    const newReferral: Referral = {
      id: `ref_${Date.now()}`,
      referrerId: referrerId,
      referrerName: referrerName,
      referredId: user.id,
      referredName: user.name,
      referralCode: referralCode,
      status: 'completed',
      bonusAmount: 50, // 50 Flixbits bonus
      bonusPaid: true,
      createdAt: new Date(),
      completedAt: new Date()
    };
    
    // Update referrals list
    const updatedReferrals = [...referrals, newReferral];
    setReferrals(updatedReferrals);
    localStorage.setItem('referrals', JSON.stringify(updatedReferrals));
    
    // Update user with referral info
    updateUser({
      referredBy: referrerId
    });
    
    return true;
  };

  const getReferrals = (): Referral[] => {
    if (!user) return [];
    
    // Filter referrals where the current user is either the referrer or the referred
    return referrals.filter(ref => 
      ref.referrerId === user.id || ref.referredId === user.id
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        generateReferralCode,
        trackReferral,
        getReferrals,
        loginWithTestAccount,
        testAccounts,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};