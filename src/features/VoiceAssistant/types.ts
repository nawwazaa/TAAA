export interface VoiceCommand {
  id: string;
  command: string;
  intent: 'search' | 'navigation' | 'notification' | 'reminder' | 'query' | 'control';
  parameters: Record<string, any>;
  confidence: number;
  timestamp: Date;
  userId: string;
  response?: VoiceResponse;
}

export interface VoiceResponse {
  id: string;
  text: string;
  audioUrl?: string;
  actions?: VoiceAction[];
  followUpQuestions?: string[];
  timestamp: Date;
}

export interface VoiceAction {
  type: 'open_map' | 'show_offers' | 'set_reminder' | 'read_notifications' | 'navigate' | 'call' | 'message';
  data: Record<string, any>;
  label: string;
}

export interface VoiceSettings {
  isEnabled: boolean;
  voiceType: 'female' | 'male';
  language: 'en' | 'ar';
  speed: number; // 0.5 to 2.0
  volume: number; // 0 to 1
  wakeWord: 'hey_flix' | 'flix_assistant' | 'custom';
  customWakeWord?: string;
  readNotifications: boolean;
  locationServices: boolean;
  personalizedResponses: boolean;
  voiceShortcuts: VoiceShortcut[];
}

export interface VoiceShortcut {
  id: string;
  phrase: string;
  action: string;
  parameters: Record<string, any>;
  isActive: boolean;
}

export interface LocationResult {
  id: string;
  name: string;
  type: 'restaurant' | 'store' | 'service' | 'entertainment' | 'other';
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: number; // in meters
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  offers?: {
    id: string;
    title: string;
    discount: number;
    validUntil: Date;
  }[];
  phone?: string;
  website?: string;
  openingHours?: {
    [key: string]: string;
  };
}

export interface VoiceNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  isRead: boolean;
  shouldReadAloud: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  parameters: Record<string, any>;
}

export interface VoiceReminder {
  id: string;
  title: string;
  description?: string;
  scheduledTime: Date;
  isRecurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  isCompleted: boolean;
  userId: string;
  createdAt: Date;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: {
    transcript: string;
    confidence: number;
  }[];
}

export interface VoiceAnalytics {
  totalCommands: number;
  successfulCommands: number;
  failedCommands: number;
  averageConfidence: number;
  mostUsedIntents: string[];
  dailyUsage: {
    date: string;
    commandCount: number;
  }[];
  preferredLanguage: string;
  averageResponseTime: number;
}