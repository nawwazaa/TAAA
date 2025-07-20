import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, User, Globe, LogOut, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  type: 'offer' | 'system' | 'reward' | 'referral';
}

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = i18n.language === 'ar';
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Sample notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif1',
      title: 'New Offer Available',
      message: 'Mario\'s Pizza Restaurant has a new 30% discount offer!',
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      type: 'offer'
    },
    {
      id: 'notif2',
      title: 'Referral Bonus',
      message: 'You earned 50 Flixbits for referring Sarah!',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      type: 'referral'
    },
    {
      id: 'notif3',
      title: 'Tournament Starting Soon',
      message: 'Premier League Predictions tournament starts in 1 hour!',
      time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
      type: 'system'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== id)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer': return '🏷️';
      case 'referral': return '👥';
      case 'reward': return '🎁';
      default: return '📢';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-lg font-bold text-sm md:text-lg">
              FlixMarket
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {user && (
              <div className="flex items-center space-x-1 rtl:space-x-reverse bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs md:text-sm font-medium">
                <span>{user.flixbits}</span>
                <span className="hidden sm:inline">Flixbits</span>
                <span className="sm:hidden">FB</span>
              </div>
            )}
            
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 rtl:space-x-reverse px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium">{i18n.language.toUpperCase()}</span>
            </button>

            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllAsRead();
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3">
                              <span>{getNotificationIcon(notification.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{getTimeAgo(notification.time)}</p>
                            </div>
                            <div className="flex-shrink-0 flex space-x-1 rtl:space-x-reverse">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-gray-200 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </button>

            {user && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs md:text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{t(user.userType)}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
    </header>
  );
};

export default Header;