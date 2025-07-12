import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings,
  Crown,
  User,
  MapPin,
  Globe,
  CheckCircle,
  XCircle,
  Key,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Calendar,
  Clock,
  Star,
  Trophy,
  DollarSign,
  Bell,
  FileText,
  BarChart3,
  Truck,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: 'super_admin' | 'admin' | 'manager' | 'moderator' | 'support';
  isActive: boolean;
  createdAt: Date;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'users' | 'tournaments' | 'transactions' | 'content' | 'system' | 'delivery' | 'notifications';
  isGranted: boolean;
}

interface SubAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  roleName: string;
  assignedCountries: string[];
  assignedCities: string[];
  permissions: Permission[];
  status: 'active' | 'suspended' | 'pending';
  lastActive: Date;
  createdAt: Date;
  createdBy: string;
  statistics: {
    usersManaged: number;
    tournamentsCreated: number;
    transactionsReviewed: number;
    supportTicketsHandled: number;
  };
}

const RoleManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'roles' | 'sub-admins' | 'permissions'>('sub-admins');
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showCreateSubAdmin, setShowCreateSubAdmin] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdmin | null>(null);
  const [showSubAdminDetails, setShowSubAdminDetails] = useState(false);

  // Available permissions
  const allPermissions: Permission[] = [
    // User Management
    { id: 'users_view', name: 'View Users', description: 'View user profiles and information', category: 'users', isGranted: false },
    { id: 'users_edit', name: 'Edit Users', description: 'Modify user profiles and settings', category: 'users', isGranted: false },
    { id: 'users_suspend', name: 'Suspend Users', description: 'Suspend or activate user accounts', category: 'users', isGranted: false },
    { id: 'users_delete', name: 'Delete Users', description: 'Permanently delete user accounts', category: 'users', isGranted: false },
    { id: 'users_flixbits', name: 'Manage Flixbits', description: 'Add or remove user Flixbits', category: 'users', isGranted: false },
    
    // Tournament Management
    { id: 'tournaments_view', name: 'View Tournaments', description: 'View tournament information', category: 'tournaments', isGranted: false },
    { id: 'tournaments_create', name: 'Create Tournaments', description: 'Create new tournaments and games', category: 'tournaments', isGranted: false },
    { id: 'tournaments_edit', name: 'Edit Tournaments', description: 'Modify tournament settings and games', category: 'tournaments', isGranted: false },
    { id: 'tournaments_results', name: 'Manage Results', description: 'Update game results and distribute prizes', category: 'tournaments', isGranted: false },
    { id: 'tournaments_prizes', name: 'Set Prizes', description: 'Configure tournament prizes and rewards', category: 'tournaments', isGranted: false },
    
    // Transaction Management
    { id: 'transactions_view', name: 'View Transactions', description: 'View all financial transactions', category: 'transactions', isGranted: false },
    { id: 'transactions_review', name: 'Review Transactions', description: 'Review and approve transactions', category: 'transactions', isGranted: false },
    { id: 'transactions_refund', name: 'Process Refunds', description: 'Process refunds and cancellations', category: 'transactions', isGranted: false },
    { id: 'transactions_support', name: 'Customer Support', description: 'Handle customer support tickets', category: 'transactions', isGranted: false },
    
    // Content Management
    { id: 'content_moderate', name: 'Moderate Content', description: 'Review and moderate user content', category: 'content', isGranted: false },
    { id: 'content_offers', name: 'Manage Offers', description: 'Approve or reject marketplace offers', category: 'content', isGranted: false },
    { id: 'content_events', name: 'Manage Events', description: 'Review and approve events', category: 'content', isGranted: false },
    { id: 'content_videos', name: 'Manage Videos', description: 'Review video contest submissions', category: 'content', isGranted: false },
    
    // Delivery Management
    { id: 'delivery_view', name: 'View Deliveries', description: 'View delivery status and tracking', category: 'delivery', isGranted: false },
    { id: 'delivery_manage', name: 'Manage Deliveries', description: 'Update delivery status and locations', category: 'delivery', isGranted: false },
    { id: 'delivery_verify', name: 'Verify Locations', description: 'Verify customer delivery addresses', category: 'delivery', isGranted: false },
    
    // Notifications
    { id: 'notifications_send', name: 'Send Notifications', description: 'Send push notifications to users', category: 'notifications', isGranted: false },
    { id: 'notifications_manage', name: 'Manage Campaigns', description: 'Create and manage notification campaigns', category: 'notifications', isGranted: false },
    
    // System Management
    { id: 'system_settings', name: 'System Settings', description: 'Modify system-wide settings', category: 'system', isGranted: false },
    { id: 'system_analytics', name: 'View Analytics', description: 'Access system analytics and reports', category: 'system', isGranted: false },
    { id: 'system_backup', name: 'System Backup', description: 'Perform system backups and maintenance', category: 'system', isGranted: false }
  ];

  // Predefined roles
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'country_manager',
      name: 'Country Manager',
      description: 'Manages all operations within assigned countries',
      permissions: allPermissions.filter(p => 
        ['users_view', 'users_edit', 'users_suspend', 'tournaments_view', 'tournaments_create', 
         'tournaments_edit', 'transactions_view', 'content_moderate', 'delivery_view', 
         'delivery_manage', 'notifications_send', 'system_analytics'].includes(p.id)
      ).map(p => ({ ...p, isGranted: true })),
      level: 'admin',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'tournament_manager',
      name: 'Tournament Manager',
      description: 'Specialized in tournament and game management',
      permissions: allPermissions.filter(p => 
        ['tournaments_view', 'tournaments_create', 'tournaments_edit', 'tournaments_results', 
         'tournaments_prizes', 'users_view', 'system_analytics'].includes(p.id)
      ).map(p => ({ ...p, isGranted: true })),
      level: 'manager',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'customer_support',
      name: 'Customer Support',
      description: 'Handles customer inquiries and transaction issues',
      permissions: allPermissions.filter(p => 
        ['transactions_view', 'transactions_support', 'users_view', 'content_moderate', 
         'delivery_view'].includes(p.id)
      ).map(p => ({ ...p, isGranted: true })),
      level: 'support',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'content_moderator',
      name: 'Content Moderator',
      description: 'Reviews and moderates user-generated content',
      permissions: allPermissions.filter(p => 
        ['content_moderate', 'content_offers', 'content_events', 'content_videos', 
         'users_view'].includes(p.id)
      ).map(p => ({ ...p, isGranted: true })),
      level: 'moderator',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'delivery_coordinator',
      name: 'Delivery Coordinator',
      description: 'Manages delivery operations and location verification',
      permissions: allPermissions.filter(p => 
        ['delivery_view', 'delivery_manage', 'delivery_verify', 'users_view', 
         'transactions_view'].includes(p.id)
      ).map(p => ({ ...p, isGranted: true })),
      level: 'manager',
      isActive: true,
      createdAt: new Date('2024-01-01')
    }
  ]);

  // Sample sub-admins
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([
    {
      id: 'subadmin_001',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed.rashid@flixmarket.com',
      phone: '+971501234567',
      roleId: 'country_manager',
      roleName: 'Country Manager',
      assignedCountries: ['UAE'],
      assignedCities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
      permissions: roles.find(r => r.id === 'country_manager')?.permissions || [],
      status: 'active',
      lastActive: new Date('2024-01-20T16:30:00'),
      createdAt: new Date('2024-01-10'),
      createdBy: 'super_admin',
      statistics: {
        usersManaged: 1250,
        tournamentsCreated: 15,
        transactionsReviewed: 89,
        supportTicketsHandled: 23
      }
    },
    {
      id: 'subadmin_002',
      name: 'Mohammed Al-Saud',
      email: 'mohammed.saud@flixmarket.com',
      phone: '+966501234567',
      roleId: 'country_manager',
      roleName: 'Country Manager',
      assignedCountries: ['Saudi Arabia'],
      assignedCities: ['Riyadh', 'Jeddah', 'Dammam'],
      permissions: roles.find(r => r.id === 'country_manager')?.permissions || [],
      status: 'active',
      lastActive: new Date('2024-01-20T14:15:00'),
      createdAt: new Date('2024-01-08'),
      createdBy: 'super_admin',
      statistics: {
        usersManaged: 2100,
        tournamentsCreated: 22,
        transactionsReviewed: 156,
        supportTicketsHandled: 45
      }
    },
    {
      id: 'subadmin_003',
      name: 'Sarah Al-Thani',
      email: 'sarah.thani@flixmarket.com',
      phone: '+974501234567',
      roleId: 'tournament_manager',
      roleName: 'Tournament Manager',
      assignedCountries: ['Qatar'],
      assignedCities: ['Doha', 'Al Rayyan'],
      permissions: roles.find(r => r.id === 'tournament_manager')?.permissions || [],
      status: 'active',
      lastActive: new Date('2024-01-20T18:45:00'),
      createdAt: new Date('2024-01-12'),
      createdBy: 'super_admin',
      statistics: {
        usersManaged: 0,
        tournamentsCreated: 35,
        transactionsReviewed: 0,
        supportTicketsHandled: 0
      }
    },
    {
      id: 'subadmin_004',
      name: 'Fatima Al-Sabah',
      email: 'fatima.sabah@flixmarket.com',
      phone: '+965501234567',
      roleId: 'customer_support',
      roleName: 'Customer Support',
      assignedCountries: ['Kuwait'],
      assignedCities: ['Kuwait City', 'Hawalli'],
      permissions: roles.find(r => r.id === 'customer_support')?.permissions || [],
      status: 'active',
      lastActive: new Date('2024-01-20T12:20:00'),
      createdAt: new Date('2024-01-15'),
      createdBy: 'super_admin',
      statistics: {
        usersManaged: 0,
        tournamentsCreated: 0,
        transactionsReviewed: 234,
        supportTicketsHandled: 178
      }
    }
  ]);

  const [newSubAdmin, setNewSubAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    roleId: '',
    assignedCountries: [] as string[],
    assignedCities: [] as string[]
  });

  const countries = [
    { code: 'UAE', name: 'United Arab Emirates', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'] },
    { code: 'SA', name: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar', 'Taif'] },
    { code: 'QA', name: 'Qatar', cities: ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor', 'Umm Salal'] },
    { code: 'KW', name: 'Kuwait', cities: ['Kuwait City', 'Hawalli', 'Farwaniya', 'Ahmadi', 'Jahra'] },
    { code: 'BH', name: 'Bahrain', cities: ['Manama', 'Riffa', 'Muharraq', 'Hamad Town'] },
    { code: 'OM', name: 'Oman', cities: ['Muscat', 'Salalah', 'Nizwa', 'Sur', 'Sohar'] }
  ];

  const handleCreateSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSubAdmin.name || !newSubAdmin.email || !newSubAdmin.roleId) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedRole = roles.find(r => r.id === newSubAdmin.roleId);
    if (!selectedRole) {
      alert('Please select a valid role');
      return;
    }

    const subAdmin: SubAdmin = {
      id: `subadmin_${Date.now()}`,
      name: newSubAdmin.name,
      email: newSubAdmin.email,
      phone: newSubAdmin.phone,
      roleId: newSubAdmin.roleId,
      roleName: selectedRole.name,
      assignedCountries: newSubAdmin.assignedCountries,
      assignedCities: newSubAdmin.assignedCities,
      permissions: selectedRole.permissions,
      status: 'pending',
      lastActive: new Date(),
      createdAt: new Date(),
      createdBy: user?.id || 'admin',
      statistics: {
        usersManaged: 0,
        tournamentsCreated: 0,
        transactionsReviewed: 0,
        supportTicketsHandled: 0
      }
    };

    setSubAdmins(prev => [...prev, subAdmin]);
    setShowCreateSubAdmin(false);
    setNewSubAdmin({
      name: '',
      email: '',
      phone: '',
      roleId: '',
      assignedCountries: [],
      assignedCities: []
    });

    alert('Sub-admin created successfully! Login credentials will be sent via email.');
  };

  const toggleCountry = (countryCode: string) => {
    setNewSubAdmin(prev => ({
      ...prev,
      assignedCountries: prev.assignedCountries.includes(countryCode)
        ? prev.assignedCountries.filter(c => c !== countryCode)
        : [...prev.assignedCountries, countryCode]
    }));
  };

  const toggleCity = (city: string) => {
    setNewSubAdmin(prev => ({
      ...prev,
      assignedCities: prev.assignedCities.includes(city)
        ? prev.assignedCities.filter(c => c !== city)
        : [...prev.assignedCities, city]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (level: string) => {
    switch (level) {
      case 'super_admin': return <Crown className="w-5 h-5 text-purple-500" />;
      case 'admin': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'manager': return <Star className="w-5 h-5 text-green-500" />;
      case 'moderator': return <Eye className="w-5 h-5 text-orange-500" />;
      case 'support': return <Users className="w-5 h-5 text-teal-500" />;
      default: return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPermissionIcon = (category: string) => {
    switch (category) {
      case 'users': return <Users className="w-4 h-4" />;
      case 'tournaments': return <Trophy className="w-4 h-4" />;
      case 'transactions': return <DollarSign className="w-4 h-4" />;
      case 'content': return <FileText className="w-4 h-4" />;
      case 'delivery': return <Truck className="w-4 h-4" />;
      case 'notifications': return <Bell className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Key className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">👥 Role & Authority Management</h1>
        <p className="text-purple-100">Manage sub-admins, roles, and delegate authority by country/region</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('sub-admins')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'sub-admins'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Sub-Admins</span>
            </button>
            
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'roles'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Roles</span>
            </button>
            
            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'permissions'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Key className="w-5 h-5" />
              <span className="font-medium">Permissions</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Sub-Admins Tab */}
          {activeTab === 'sub-admins' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Sub-Administrators</h2>
                <button
                  onClick={() => setShowCreateSubAdmin(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Create Sub-Admin</span>
                </button>
              </div>

              {/* Sub-Admins Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subAdmins.map((subAdmin) => (
                  <div key={subAdmin.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          {getRoleIcon(roles.find(r => r.id === subAdmin.roleId)?.level || 'support')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{subAdmin.name}</h3>
                          <p className="text-sm text-gray-500">{subAdmin.roleName}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subAdmin.status)}`}>
                        {subAdmin.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium">{subAdmin.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Countries:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {subAdmin.assignedCountries.map((country) => (
                            <span key={country} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Active:</span>
                        <p className="font-medium">{subAdmin.lastActive.toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                      <div className="text-center">
                        <p className="font-bold text-gray-900">{subAdmin.statistics.usersManaged}</p>
                        <p className="text-gray-600">Users</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900">{subAdmin.statistics.tournamentsCreated}</p>
                        <p className="text-gray-600">Tournaments</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900">{subAdmin.statistics.transactionsReviewed}</p>
                        <p className="text-gray-600">Transactions</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900">{subAdmin.statistics.supportTicketsHandled}</p>
                        <p className="text-gray-600">Support</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => {
                          setSelectedSubAdmin(subAdmin);
                          setShowSubAdminDetails(true);
                        }}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        View Details
                      </button>
                      <button className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                        {subAdmin.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Available Roles</h2>
                <button
                  onClick={() => setShowCreateRole(true)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Role</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        {getRoleIcon(role.level)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{role.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{role.level}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{role.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-gray-700">Permissions ({role.permissions.filter(p => p.isGranted).length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.filter(p => p.isGranted).slice(0, 6).map((permission) => (
                          <span key={permission.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {permission.name}
                          </span>
                        ))}
                        {role.permissions.filter(p => p.isGranted).length > 6 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            +{role.permissions.filter(p => p.isGranted).length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        Edit
                      </button>
                      <button className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                        {role.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Available Permissions</h2>
              
              {Object.entries(
                allPermissions.reduce((acc, permission) => {
                  if (!acc[permission.category]) {
                    acc[permission.category] = [];
                  }
                  acc[permission.category].push(permission);
                  return acc;
                }, {} as Record<string, Permission[]>)
              ).map(([category, permissions]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse capitalize">
                    {getPermissionIcon(category)}
                    <span>{category} Management</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-1">{permission.name}</h4>
                        <p className="text-sm text-gray-600">{permission.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Sub-Admin Modal */}
      {showCreateSubAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create Sub-Administrator</h2>
                <button
                  onClick={() => setShowCreateSubAdmin(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateSubAdmin} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={newSubAdmin.name}
                      onChange={(e) => setNewSubAdmin(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newSubAdmin.email}
                      onChange={(e) => setNewSubAdmin(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newSubAdmin.phone}
                      onChange={(e) => setNewSubAdmin(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select
                      value={newSubAdmin.roleId}
                      onChange={(e) => setNewSubAdmin(prev => ({ ...prev, roleId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a role</option>
                      {roles.filter(r => r.isActive).map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Country Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Countries</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {countries.map((country) => (
                      <label key={country.code} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newSubAdmin.assignedCountries.includes(country.code)}
                          onChange={() => toggleCountry(country.code)}
                          className="mr-2 rtl:mr-0 rtl:ml-2"
                        />
                        <span className="text-sm">{country.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* City Assignment */}
                {newSubAdmin.assignedCountries.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Cities</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {countries
                        .filter(country => newSubAdmin.assignedCountries.includes(country.code))
                        .flatMap(country => country.cities)
                        .map((city) => (
                          <label key={city} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newSubAdmin.assignedCities.includes(city)}
                              onChange={() => toggleCity(city)}
                              className="mr-2 rtl:mr-0 rtl:ml-2"
                            />
                            <span className="text-sm">{city}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}

                {/* Role Permissions Preview */}
                {newSubAdmin.roleId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role Permissions</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {roles.find(r => r.id === newSubAdmin.roleId)?.permissions
                          .filter(p => p.isGranted)
                          .map((permission) => (
                            <span key={permission.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {permission.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateSubAdmin(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                  >
                    Create Sub-Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Admin Details Modal */}
      {showSubAdminDetails && selectedSubAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Sub-Admin Details</h2>
                <button
                  onClick={() => setShowSubAdminDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="text-gray-900">{selectedSubAdmin.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{selectedSubAdmin.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900">{selectedSubAdmin.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <p className="text-gray-900">{selectedSubAdmin.roleName}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSubAdmin.status)}`}>
                          {selectedSubAdmin.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created</label>
                        <p className="text-gray-900">{selectedSubAdmin.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Active</label>
                        <p className="text-gray-900">{selectedSubAdmin.lastActive.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created By</label>
                        <p className="text-gray-900">{selectedSubAdmin.createdBy}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Regions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Regions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Countries</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubAdmin.assignedCountries.map((country) => (
                          <span key={country} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cities</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubAdmin.assignedCities.map((city) => (
                          <span key={city} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{selectedSubAdmin.statistics.usersManaged}</p>
                      <p className="text-sm text-blue-800">Users Managed</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{selectedSubAdmin.statistics.tournamentsCreated}</p>
                      <p className="text-sm text-green-800">Tournaments Created</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{selectedSubAdmin.statistics.transactionsReviewed}</p>
                      <p className="text-sm text-purple-800">Transactions Reviewed</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{selectedSubAdmin.statistics.supportTicketsHandled}</p>
                      <p className="text-sm text-orange-800">Support Tickets</p>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(
                      selectedSubAdmin.permissions
                        .filter(p => p.isGranted)
                        .reduce((acc, permission) => {
                          if (!acc[permission.category]) {
                            acc[permission.category] = [];
                          }
                          acc[permission.category].push(permission);
                          return acc;
                        }, {} as Record<string, Permission[]>)
                    ).map(([category, permissions]) => (
                      <div key={category} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2 capitalize flex items-center space-x-2 rtl:space-x-reverse">
                          {getPermissionIcon(category)}
                          <span>{category}</span>
                        </h4>
                        <div className="space-y-1">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="text-sm text-gray-700">
                              • {permission.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowSubAdminDetails(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Sub-Admin
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    {selectedSubAdmin.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;