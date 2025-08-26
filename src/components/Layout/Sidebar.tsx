import React from 'react';
import { useState, useEffect } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleToggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('toggle-mobile-menu', handleToggleMobileMenu);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('toggle-mobile-menu', handleToggleMobileMenu);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

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

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Mobile Sidebar */}
      <aside className={`mobile-menu md:hidden fixed inset-y-0 z-50 w-64 bg-white shadow-xl border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isRTL ? 'right-0 border-l' : 'left-0 border-r'
      } ${
        isMobileMenuOpen 
          ? 'translate-x-0' 
          : isRTL ? 'translate-x-full' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg font-bold text-lg">
                FlixMarket
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* User Account Type Display - Mobile Only */}
            {user && (
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                        user.email === 'admin@flixmarket.com' || user.email?.endsWith('@flixmarket.com') 
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : user.userType === 'seller'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : user.userType === 'influencer'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {user.email === 'admin@flixmarket.com' 
                          ? '👑 SUPER ADMIN'
                          : user.email?.endsWith('@flixmarket.com')
                          ? '🛡️ ADMIN'
                          : user.userType === 'seller'
                          ? '🏪 SELLER'
                          : user.userType === 'influencer'
                          ? '⭐ INFLUENCER'
                          : '👤 USER'
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse mt-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">{user.flixbits.toLocaleString()} FB</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 space-x-3 rtl:space-x-reverse text-left rtl:text-right ${
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

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-shrink-0 w-full bg-white shadow-lg border-r border-gray-200 ${isRTL ? 'rtl' : 'ltr'} md:min-h-screen transition-all duration-300 ${
        isCollapsed ? 'md:w-16' : 'md:w-64'
      }`}>
        <div className="h-full flex flex-col w-full">
          {/* Desktop Hamburger Toggle */}
          <div className="flex justify-end p-2 border-b border-gray-200">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className={`flex-1 px-2 md:px-4 py-3 md:py-6 space-y-1 md:space-y-2`}>
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
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;