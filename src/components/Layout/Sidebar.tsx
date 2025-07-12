import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  User, 
  Trophy, 
  Gift, 
  Users, 
  Settings, 
  ShoppingBag,
  Video,
  QrCode,
  Scan,
  MapPin,
  BarChart3,
  Calendar,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: t('dashboard'), icon: Home },
      { id: 'profile', label: t('profile'), icon: User },
      { id: 'tournaments', label: t('tournaments'), icon: Trophy },
      { id: 'rewards', label: t('rewards'), icon: Gift },
      { id: 'qr-code', label: t('qrCode'), icon: QrCode },
      { id: 'qr-redemption', label: 'QR Redemption', icon: Scan },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'wishlist', label: 'Service Requests', icon: Heart },
    ];

    if (user?.userType === 'seller') {
      return [
        ...commonItems,
        { id: 'offers', label: t('offers'), icon: ShoppingBag },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ];
    }

    if (user?.userType === 'influencer') {
      return [
        ...commonItems,
        { id: 'campaigns', label: 'Campaigns', icon: Video },
        { id: 'followers', label: 'Followers', icon: Users },
      ];
    }

    return [
      ...commonItems,
      { id: 'offers', label: t('offers'), icon: ShoppingBag },
      { id: 'referrals', label: t('referrals'), icon: Users },
    ];
  };

  const menuItems = getMenuItems();

  if (user?.userType === 'seller' || user?.userType === 'influencer') {
    menuItems.push({ id: 'location', label: t('location'), icon: MapPin });
  }

  // Add admin items for admin users
  if (user?.email === 'admin@flixmarket.com') {
    menuItems.push({ id: 'admin', label: t('admin'), icon: Settings });
  }

  return (
    <aside className={`w-64 bg-white shadow-lg border-r border-gray-200 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="h-full flex flex-col">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg text-left rtl:text-right transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;