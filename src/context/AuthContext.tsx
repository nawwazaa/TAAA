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
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};