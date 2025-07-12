import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Phone, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Shield,
  ShieldOff,
  Download,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Crown,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'user' | 'seller' | 'influencer';
  location: {
    country: string;
    city: string;
    district: string;
  };
  flixbits: number;
  status: 'active' | 'suspended' | 'pending' | 'blocked';
  lastActive: Date;
  joinDate: Date;
  totalPurchases: number;
  totalSales: number;
  rating: number;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  deviceInfo: {
    platform: 'iOS' | 'Android' | 'Web';
    version: string;
    lastIP: string;
  };
}

const UserSearch: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'phone' | 'name' | 'email'>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'user' | 'seller' | 'influencer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending' | 'blocked'>('all');
  const [countryFilter, setCountryFilter] = useState<'all' | 'UAE' | 'Saudi Arabia' | 'Qatar' | 'Kuwait'>('all');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Sample user database
  const [userDatabase] = useState<UserSearchResult[]>([
    {
      id: 'user_001',
      name: 'Ahmed Hassan Al-Mahmoud',
      email: 'ahmed.hassan@email.com',
      phone: '+971501234567',
      userType: 'user',
      location: { country: 'UAE', city: 'Dubai', district: 'Downtown' },
      flixbits: 1250,
      status: 'active',
      lastActive: new Date('2024-01-20T14:30:00'),
      joinDate: new Date('2023-12-15'),
      totalPurchases: 15,
      totalSales: 0,
      rating: 4.8,
      verificationStatus: 'verified',
      deviceInfo: { platform: 'iOS', version: '2.1.0', lastIP: '192.168.1.100' }
    },
    {
      id: 'seller_001',
      name: 'Mario\'s Pizza Restaurant',
      email: 'mario@pizzarestaurant.com',
      phone: '+971507654321',
      userType: 'seller',
      location: { country: 'UAE', city: 'Dubai', district: 'Marina' },
      flixbits: 5670,
      status: 'active',
      lastActive: new Date('2024-01-20T16:45:00'),
      joinDate: new Date('2023-11-20'),
      totalPurchases: 3,
      totalSales: 89,
      rating: 4.9,
      verificationStatus: 'verified',
      deviceInfo: { platform: 'Android', version: '2.0.8', lastIP: '192.168.1.101' }
    },
    {
      id: 'influencer_001',
      name: 'Sarah Fashion Blogger',
      email: 'sarah@fashionblog.com',
      phone: '+966501234567',
      userType: 'influencer',
      location: { country: 'Saudi Arabia', city: 'Riyadh', district: 'Olaya' },
      flixbits: 3450,
      status: 'active',
      lastActive: new Date('2024-01-20T12:15:00'),
      joinDate: new Date('2023-10-10'),
      totalPurchases: 8,
      totalSales: 45,
      rating: 4.7,
      verificationStatus: 'verified',
      deviceInfo: { platform: 'iOS', version: '2.1.0', lastIP: '192.168.1.102' }
    },
    {
      id: 'user_002',
      name: 'Mohammed Ali Bin Rashid',
      email: 'mohammed.ali@email.com',
      phone: '+971509876543',
      userType: 'user',
      location: { country: 'UAE', city: 'Abu Dhabi', district: 'Corniche' },
      flixbits: 890,
      status: 'suspended',
      lastActive: new Date('2024-01-18T09:20:00'),
      joinDate: new Date('2024-01-05'),
      totalPurchases: 2,
      totalSales: 0,
      rating: 3.2,
      verificationStatus: 'pending',
      deviceInfo: { platform: 'Android', version: '2.0.5', lastIP: '192.168.1.103' }
    },
    {
      id: 'seller_002',
      name: 'TechWorld Electronics',
      email: 'info@techworld.com',
      phone: '+966507123456',
      userType: 'seller',
      location: { country: 'Saudi Arabia', city: 'Jeddah', district: 'Al-Hamra' },
      flixbits: 12340,
      status: 'active',
      lastActive: new Date('2024-01-20T18:00:00'),
      joinDate: new Date('2023-09-15'),
      totalPurchases: 12,
      totalSales: 156,
      rating: 4.6,
      verificationStatus: 'verified',
      deviceInfo: { platform: 'Web', version: '2.1.0', lastIP: '192.168.1.104' }
    }
  ]);

  // Search function
  const performSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = userDatabase.filter(user => {
        // Search type filtering
        let matchesSearch = false;
        const query = searchQuery.toLowerCase().trim();
        
        switch (searchType) {
          case 'phone':
            matchesSearch = user.phone.includes(query) || user.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''));
            break;
          case 'name':
            matchesSearch = user.name.toLowerCase().includes(query);
            break;
          case 'email':
            matchesSearch = user.email.toLowerCase().includes(query);
            break;
          default: // 'all'
            matchesSearch = 
              user.name.toLowerCase().includes(query) ||
              user.email.toLowerCase().includes(query) ||
              user.phone.includes(query) ||
              user.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''));
        }

        // Additional filters
        const matchesUserType = userTypeFilter === 'all' || user.userType === userTypeFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesCountry = countryFilter === 'all' || user.location.country === countryFilter;

        return matchesSearch && matchesUserType && matchesStatus && matchesCountry;
      });

      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };

  // Real-time search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchType, userTypeFilter, statusFilter, countryFilter]);

  const handleUserAction = (userId: string, action: 'view' | 'edit' | 'suspend' | 'activate' | 'delete') => {
    const targetUser = searchResults.find(u => u.id === userId);
    
    switch (action) {
      case 'view':
        setSelectedUser(targetUser || null);
        setShowUserDetails(true);
        break;
      case 'edit':
        alert(`Edit user: ${targetUser?.name}`);
        break;
      case 'suspend':
        alert(`Suspend user: ${targetUser?.name}`);
        // Update user status in real app
        break;
      case 'activate':
        alert(`Activate user: ${targetUser?.name}`);
        // Update user status in real app
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete user: ${targetUser?.name}?`)) {
          alert(`Delete user: ${targetUser?.name}`);
          // Delete user in real app
        }
        break;
    }
  };

  const exportResults = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Type', 'Country', 'City', 'Status', 'Flixbits', 'Join Date'].join(','),
      ...searchResults.map(user => [
        user.name,
        user.email,
        user.phone,
        user.userType,
        user.location.country,
        user.location.city,
        user.status,
        user.flixbits,
        user.joinDate.toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_search_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'seller': return <Package className="w-4 h-4 text-blue-500" />;
      case 'influencer': return <Crown className="w-4 h-4 text-purple-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🔍 Advanced User Search</h1>
        <p className="text-blue-100">Search users by mobile number, name, email, or any criteria</p>
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone number, or email..."
              className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            {isSearching && (
              <div className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Search Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Type</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Fields</option>
                <option value="phone">📱 Phone Number</option>
                <option value="name">👤 Name</option>
                <option value="email">📧 Email</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="user">👤 Users</option>
                <option value="seller">🏪 Sellers</option>
                <option value="influencer">⭐ Influencers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">✅ Active</option>
                <option value="suspended">⛔ Suspended</option>
                <option value="pending">⏳ Pending</option>
                <option value="blocked">🚫 Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Countries</option>
                <option value="UAE">🇦🇪 UAE</option>
                <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                <option value="Qatar">🇶🇦 Qatar</option>
                <option value="Kuwait">🇰🇼 Kuwait</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={exportResults}
                disabled={searchResults.length === 0}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
              {searchResults.length > 0 && (
                <div className="text-sm text-gray-600">
                  Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {searchResults.length === 0 ? (
              <div className="p-8 text-center">
                {isSearching ? (
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Searching users...</span>
                  </div>
                ) : (
                  <div>
                    <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                  </div>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              {getUserTypeIcon(user.userType)}
                            </div>
                          </div>
                          <div className="ml-4 rtl:ml-0 rtl:mr-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center space-x-2 rtl:space-x-reverse">
                              <span>{user.name}</span>
                              {getVerificationIcon(user.verificationStatus)}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">{user.userType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phone}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.location.city}</div>
                        <div className="text-sm text-gray-500">{user.location.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{user.flixbits} FB</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Last: {user.lastActive.toLocaleDateString()}</div>
                        <div>Joined: {user.joinDate.toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => handleUserAction(user.id, 'view')}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'edit')}
                            className="text-green-600 hover:text-green-900"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleUserAction(user.id, 'suspend')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Suspend User"
                            >
                              <ShieldOff className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user.id, 'activate')}
                              className="text-green-600 hover:text-green-900"
                              title="Activate User"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="text-gray-900">{selectedUser.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{selectedUser.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900">{selectedUser.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">User Type</label>
                        <p className="text-gray-900 capitalize">{selectedUser.userType}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                          {selectedUser.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Verification</label>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {getVerificationIcon(selectedUser.verificationStatus)}
                          <span className="capitalize">{selectedUser.verificationStatus}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Flixbits Balance</label>
                        <p className="text-gray-900 font-semibold">{selectedUser.flixbits.toLocaleString()} FB</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{selectedUser.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <p className="text-gray-900">{selectedUser.location.country}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <p className="text-gray-900">{selectedUser.location.city}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <p className="text-gray-900">{selectedUser.location.district}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Join Date</label>
                        <p className="text-gray-900">{selectedUser.joinDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Active</label>
                        <p className="text-gray-900">{selectedUser.lastActive.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Purchases</label>
                        <p className="text-gray-900">{selectedUser.totalPurchases}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Sales</label>
                        <p className="text-gray-900">{selectedUser.totalSales}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Device Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Platform</label>
                      <p className="text-gray-900">{selectedUser.deviceInfo.platform}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">App Version</label>
                      <p className="text-gray-900">{selectedUser.deviceInfo.version}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last IP</label>
                      <p className="text-gray-900 font-mono text-sm">{selectedUser.deviceInfo.lastIP}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleUserAction(selectedUser.id, 'edit')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit User
                  </button>
                  {selectedUser.status === 'active' ? (
                    <button
                      onClick={() => handleUserAction(selectedUser.id, 'suspend')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUserAction(selectedUser.id, 'activate')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;