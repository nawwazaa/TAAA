import React from 'react';
import { useState } from 'react';
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
  Heart,
  Menu,
  X,
  Wallet,
  Mic,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: t('dashboard'), icon: Home },
      { id: 'wallet', label: 'Wallet', icon: Wallet },
      { id: 'profile', label: t('profile'), icon: User },
      { id: 'tournaments', label: t('tournaments'), icon: Trophy },
      { id: 'rewards', label: t('rewards'), icon: Gift },
      { id: 'qr-code', label: t('qrCode'), icon: QrCode },
      { id: 'qr-redemption', label: 'QR Redemption', icon: Scan },
      { id: 'video-contest', label: 'Video Contest', icon: Video },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'wishlist', label: 'Service Requests', icon: Heart },
      { id: 'draw-winners', label: 'Prize Draws', icon: Gift },
      { id: 'voice-assistant', label: 'Voice Assistant', icon: Mic },
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
    <aside className={`flex-shrink-0 w-full bg-white shadow-lg border-r border-gray-200 ${isRTL ? 'rtl' : 'ltr'} md:min-h-screen transition-all duration-300 ${
      isCollapsed ? 'md:w-16' : 'md:w-64'
    }`}>
      <div className="h-full flex flex-col">
        {/* Desktop Hamburger Toggle */}
        <div className="hidden md:flex justify-end p-2 border-b border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <nav className={`flex-1 px-2 md:px-4 py-3 md:py-6 ${isCollapsed ? 'space-y-1' : 'space-y-1 md:space-y-2'}`}>
          {/* Mobile: Horizontal scroll menu */}
          <div className="md:hidden">
            <div className="flex space-x-2 rtl:space-x-reverse overflow-x-auto pb-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg text-center transition-all duration-200 min-w-[80px] ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Desktop: Vertical menu */}
          <div className="hidden md:block space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center rounded-lg transition-all duration-200 group relative ${
                  isCollapsed ? 'justify-center px-2 py-1' : 'px-3 py-2 space-x-3 rtl:space-x-reverse text-left rtl:text-right'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`${isCollapsed ? 'w-8 h-8' : 'w-5 h-5'} ${isActive ? 'text-white' : 'text-gray-500'}`} />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;