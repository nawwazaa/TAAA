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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  collapsed = false, 
  onToggleCollapse 
}) => {
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
    <aside className={`
      ${collapsed ? 'w-16' : 'w-full md:w-64'} 
      bg-white shadow-lg border-r border-gray-200 
      ${isRTL ? 'rtl' : 'ltr'} 
      md:min-h-screen 
      fixed md:relative 
      z-30 
      transition-all duration-300
      ${collapsed ? 'md:fixed' : ''}
    `}>
      <div className="h-full flex flex-col">
        {/* Desktop Collapse Toggle */}
        <div className="hidden md:flex justify-end p-2 border-b border-gray-200">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="flex-1 px-2 md:px-4 py-3 md:py-6 space-y-1 md:space-y-2">
          {/* Mobile: Horizontal scroll menu */}
          <div className={`md:hidden ${collapsed ? 'hidden' : ''}`}>
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
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3 rtl:space-x-reverse'} px-3 py-2 rounded-lg text-left rtl:text-right transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
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