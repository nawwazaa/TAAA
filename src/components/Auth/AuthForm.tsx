import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateQRCode, generateUserQRData } from '../../utils/qrCode';

const AuthForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { login, loginWithTestAccount, testAccounts } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    otpCode: '',
    userType: 'user' as 'user' | 'influencer' | 'seller',
    location: {
      country: '',
      city: '',
      district: ''
    },
    interests: [] as string[]
  });

  const availableInterests = [
    'Food & Dining',
    'Shopping',
    'Entertainment',
    'Sports',
    'Technology',
    'Travel',
    'Fashion',
    'Health & Fitness',
    'Books & Education',
    'Music & Arts'
  ];

  // OTP Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSendOTP = async () => {
    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setOtpTimer(60); // 60 seconds timer
      setLoading(false);
    }, 2000);
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return; // Prevent resending if timer is still active
    
    setLoading(true);
    // Simulate OTP resending
    setTimeout(() => {
      setOtpTimer(60); // Reset timer
      setLoading(false);
      // Show success message
      const successMessage = 'New OTP code sent successfully! Please check your phone.';
      alert(successMessage);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if it's a test account login
    if (!isSignUp && testAccounts[formData.email as keyof typeof testAccounts]) {
      const success = loginWithTestAccount(formData.email);
      if (success) {
        setLoading(false);
        return;
      }
    }
    try {
      // Generate QR code for the user
      const qrData = generateUserQRData(`user_${Date.now()}`, formData.userType);
      const qrCode = await generateQRCode(qrData);

      const userData = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        userType: formData.userType,
        location: formData.userType === 'user' ? formData.location : undefined,
        interests: formData.userType === 'user' ? formData.interests : undefined,
        qrCode,
        flixbits: 100, // Welcome bonus
        createdAt: new Date()
      };

      login(userData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">FlixMarket</h1>
            <p className="text-blue-100">
              {isSignUp ? t('signUp') : t('signIn')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Type
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">{t('user')}</option>
                    <option value="influencer">{t('influencer')}</option>
                    <option value="seller">{t('seller')}</option>
                  </select>
                </div>

                {formData.userType === 'user' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="location.country"
                        placeholder="Country"
                        value={formData.location.country}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="location.city"
                        placeholder="City"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="location.district"
                        placeholder="District"
                        value={formData.location.district}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {t('interests')} (Optional)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableInterests.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleInterestToggle(interest)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                              formData.interests.includes(interest)
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {isSignUp && !otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading || !formData.phone}
                    className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  >
                    {loading ? t('loading') : t('sendOtp')}
                  </button>
                )}
              </div>
            </div>

            {isSignUp && otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('otpCode')}
                </label>
                <input
                  type="text"
                  name="otpCode"
                  value={formData.otpCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter 6-digit code"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Didn\'t receive code?'}
                  </span>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    {otpTimer === 0 && (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50 transition-colors"
                      >
                        {loading ? 'Sending...' : 'Resend Code'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpTimer(0);
                        setFormData(prev => ({ ...prev, otpCode: '' }));
                      }}
                      className="text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors"
                    >
                      Change Number
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-3 pr-10 rtl:pl-10 rtl:pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (isSignUp && !otpSent) || (!isSignUp && (!formData.email || !formData.phone || !formData.password))}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? t('loading') : (isSignUp ? t('signUp') : t('signIn'))}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowTestAccounts(!showTestAccounts)}
                className="text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                {showTestAccounts ? 'Hide Test Accounts' : 'Show Test Accounts (For Testing)'}
              </button>
              
              {showTestAccounts && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-blue-800 mb-3">🧪 Test Accounts</h3>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(testAccounts).map(([email, account]) => (
                        <button
                          key={email}
                          onClick={() => {
                            // Auto-fill the form with test account data
                            setFormData(prev => ({
                              ...prev,
                              email: account.email,
                              phone: account.phone,
                              password: 'test123'
                            }));
                            setShowTestAccounts(false);
                          }}
                          className="bg-white border border-blue-300 rounded-lg p-3 hover:bg-blue-100 transition-colors text-left"
                        >
                          <div className="font-medium text-blue-900">{account.name}</div>
                          <div className="text-blue-700 text-xs">📧 {account.email}</div>
                          <div className="text-blue-600 text-xs">📱 {account.phone}</div>
                          <div className="text-blue-500 text-xs">🔑 Password: test123</div>
                          <div className="text-blue-600 text-xs capitalize">
                            {account.userType} • {account.flixbits} Flixbits
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                      <p className="text-yellow-800 text-xs">
                        💡 <strong>How to use:</strong> Click any account above to auto-fill the login form, then click "Sign In"
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;