import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Auth
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      phone: 'Phone Number',
      name: 'Full Name',
      password: 'Password',
      otpCode: 'OTP Code',
      sendOtp: 'Send OTP',
      verifyOtp: 'Verify OTP',
      
      // Navigation
      dashboard: 'Dashboard',
      offers: 'Offers',
      profile: 'Profile',
      tournaments: 'Tournaments',
      rewards: 'Rewards',
      referrals: 'Referrals',
      admin: 'Admin',
      
      // User Types
      user: 'User',
      influencer: 'Influencer',
      seller: 'Seller',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      location: 'Location',
      interests: 'Interests',
      
      // Dashboard
      welcomeBack: 'Welcome back',
      totalFlixbits: 'Total Flixbits',
      activeOffers: 'Active Offers',
      upcomingTournaments: 'Upcoming Tournaments',
      
      // Game Predictions
      gamePredictions: 'Game Predictions',
      predictWinner: 'Predict Winner',
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      draw: 'Draw',
      submitPrediction: 'Submit Prediction',
      predictionAccuracy: 'Prediction Accuracy',
      
      // Offers
      createOffer: 'Create Offer',
      offerTitle: 'Offer Title',
      offerDescription: 'Description',
      startTime: 'Start Time',
      endTime: 'End Time',
      discount: 'Discount %',
      
      // Settings
      language: 'Language',
      notifications: 'Notifications',
      privacy: 'Privacy',
      
      // QR Code
      qrCode: 'QR Code',
      scanQr: 'Scan QR',
      shareQr: 'Share QR Code',
    }
  },
  ar: {
    translation: {
      // Auth
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      name: 'الاسم الكامل',
      password: 'كلمة المرور',
      otpCode: 'رمز التحقق',
      sendOtp: 'إرسال رمز التحقق',
      verifyOtp: 'تحقق من الرمز',
      
      // Navigation
      dashboard: 'لوحة التحكم',
      offers: 'العروض',
      profile: 'الملف الشخصي',
      tournaments: 'البطولات',
      rewards: 'المكافآت',
      referrals: 'الإحالات',
      admin: 'الإدارة',
      
      // User Types
      user: 'مستخدم',
      influencer: 'مؤثر',
      seller: 'بائع',
      
      // Common
      save: 'حفظ',
      cancel: 'إلغاء',
      submit: 'إرسال',
      loading: 'جاري التحميل...',
      success: 'نجح',
      error: 'خطأ',
      location: 'الموقع',
      interests: 'الاهتمامات',
      
      // Dashboard
      welcomeBack: 'مرحباً بعودتك',
      totalFlixbits: 'إجمالي الفليكس بت',
      activeOffers: 'العروض النشطة',
      upcomingTournaments: 'البطولات القادمة',
      
      // Game Predictions
      gamePredictions: 'توقعات المباريات',
      predictWinner: 'توقع الفائز',
      homeTeam: 'الفريق المضيف',
      awayTeam: 'الفريق الضيف',
      draw: 'تعادل',
      submitPrediction: 'إرسال التوقع',
      predictionAccuracy: 'دقة التوقعات',
      
      // Offers
      createOffer: 'إنشاء عرض',
      offerTitle: 'عنوان العرض',
      offerDescription: 'الوصف',
      startTime: 'وقت البدء',
      endTime: 'وقت الانتهاء',
      discount: 'الخصم %',
      
      // Settings
      language: 'اللغة',
      notifications: 'الإشعارات',
      privacy: 'الخصوصية',
      
      // QR Code
      qrCode: 'رمز الاستجابة السريعة',
      scanQr: 'مسح الرمز',
      shareQr: 'مشاركة الرمز',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

