import { VoiceResponse } from '../types';

interface NLPResult {
  intent: 'search' | 'navigation' | 'notification' | 'reminder' | 'query' | 'control';
  parameters: Record<string, any>;
  confidence: number;
}

export const processNaturalLanguage = (text: string): NLPResult => {
  const lowerText = text.toLowerCase().trim();
  
  // Search intent patterns
  if (lowerText.includes('find') || lowerText.includes('search') || lowerText.includes('show me') || lowerText.includes('where')) {
    return {
      intent: 'search',
      parameters: extractSearchParameters(lowerText),
      confidence: 0.8
    };
  }
  
  // Navigation intent patterns
  if (lowerText.includes('navigate') || lowerText.includes('directions') || lowerText.includes('take me') || lowerText.includes('go to')) {
    return {
      intent: 'navigation',
      parameters: extractNavigationParameters(lowerText),
      confidence: 0.8
    };
  }
  
  // Notification intent patterns
  if (lowerText.includes('notification') || lowerText.includes('read') || lowerText.includes('messages')) {
    return {
      intent: 'notification',
      parameters: extractNotificationParameters(lowerText),
      confidence: 0.8
    };
  }
  
  // Reminder intent patterns
  if (lowerText.includes('remind') || lowerText.includes('reminder') || lowerText.includes('schedule')) {
    return {
      intent: 'reminder',
      parameters: extractReminderParameters(lowerText),
      confidence: 0.8
    };
  }
  
  // Control intent patterns
  if (lowerText.includes('open') || lowerText.includes('close') || lowerText.includes('show')) {
    return {
      intent: 'control',
      parameters: extractControlParameters(lowerText),
      confidence: 0.8
    };
  }
  
  // Default to query intent
  return {
    intent: 'query',
    parameters: { question: text },
    confidence: 0.6
  };
};

const extractSearchParameters = (text: string): Record<string, any> => {
  const params: Record<string, any> = {};
  
  // Extract category
  if (text.includes('restaurant') || text.includes('food') || text.includes('eat')) {
    params.category = 'restaurants';
  } else if (text.includes('store') || text.includes('shop') || text.includes('buy')) {
    params.category = 'stores';
  } else if (text.includes('mall') || text.includes('shopping')) {
    params.category = 'stores';
  } else if (text.includes('gas') || text.includes('fuel')) {
    params.category = 'gas_stations';
  } else if (text.includes('hospital') || text.includes('clinic')) {
    params.category = 'healthcare';
  } else if (text.includes('pharmacy') || text.includes('medicine')) {
    params.category = 'pharmacy';
  }
  
  // Extract location modifiers
  if (text.includes('nearby') || text.includes('near me') || text.includes('close')) {
    params.location = 'nearby';
  } else if (text.includes('in my area') || text.includes('around here')) {
    params.location = 'nearby';
  }
  
  // Extract offers
  if (text.includes('offer') || text.includes('deal') || text.includes('discount')) {
    params.hasOffers = true;
  }
  
  return params;
};

const extractNavigationParameters = (text: string): Record<string, any> => {
  const params: Record<string, any> = {};
  
  // Extract destination - handle various patterns
  let destination = '';
  
  // Pattern 1: "take me to [destination]"
  if (text.includes('take me to ')) {
    destination = text.split('take me to ')[1]?.trim() || '';
  }
  // Pattern 2: "go to [destination]"
  else if (text.includes('go to ')) {
    destination = text.split('go to ')[1]?.trim() || '';
  }
  // Pattern 3: "navigate to [destination]"
  else if (text.includes('navigate to ')) {
    destination = text.split('navigate to ')[1]?.trim() || '';
  }
  // Pattern 4: "directions to [destination]"
  else if (text.includes('directions to ')) {
    destination = text.split('directions to ')[1]?.trim() || '';
  }
  // Pattern 5: "where is [destination]" or "find [destination]"
  else if (text.includes('where is ')) {
    destination = text.split('where is ')[1]?.trim() || '';
  }
  else if (text.includes('find ') && (text.includes('airport') || text.includes('mall') || text.includes('hospital'))) {
    destination = text.split('find ')[1]?.trim() || '';
  }
  
  // Clean up common words
  destination = destination.replace(/^(the|a|an)\s+/i, '');
  
  if (destination) {
    params.destination = destination;
  }
  
  // Extract transportation mode
  if (text.includes('walk') || text.includes('walking')) {
    params.mode = 'walking';
  } else if (text.includes('drive') || text.includes('driving')) {
    params.mode = 'driving';
  } else if (text.includes('transit') || text.includes('bus')) {
    params.mode = 'transit';
  }
  
  return params;
};

const extractNotificationParameters = (text: string): Record<string, any> => {
  const params: Record<string, any> = {};
  
  if (text.includes('latest') || text.includes('recent')) {
    params.filter = 'recent';
  } else if (text.includes('unread')) {
    params.filter = 'unread';
  } else if (text.includes('important')) {
    params.filter = 'important';
  }
  
  return params;
};

const extractReminderParameters = (text: string): Record<string, any> => {
  const params: Record<string, any> = {};
  
  // Extract task
  const reminderWords = ['remind', 'reminder', 'schedule'];
  let taskStart = -1;
  
  for (const word of reminderWords) {
    const index = text.indexOf(word);
    if (index !== -1) {
      taskStart = index + word.length;
      break;
    }
  }
  
  if (taskStart !== -1) {
    const taskText = text.substring(taskStart).trim();
    if (taskText.startsWith('me to ')) {
      params.task = taskText.substring(6);
    } else if (taskText.startsWith('to ')) {
      params.task = taskText.substring(3);
    } else {
      params.task = taskText;
    }
  }
  
  // Extract time
  const timePatterns = [
    /at (\d{1,2}:\d{2})/,
    /at (\d{1,2} (?:am|pm))/,
    /in (\d+) (?:minute|hour|day)s?/
  ];
  
  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      params.time = match[1];
      break;
    }
  }
  
  return params;
};

const extractControlParameters = (text: string): Record<string, any> => {
  const params: Record<string, any> = {};
  
  // Extract action
  if (text.includes('open')) {
    params.action = 'open';
  } else if (text.includes('close')) {
    params.action = 'close';
  } else if (text.includes('show')) {
    params.action = 'show';
  }
  
  // Extract target
  if (text.includes('wallet')) {
    params.target = 'wallet';
  } else if (text.includes('profile')) {
    params.target = 'profile';
  } else if (text.includes('offers')) {
    params.target = 'offers';
  } else if (text.includes('tournaments')) {
    params.target = 'tournaments';
  }
  
  return params;
};

export const generateResponse = (text: string, actions?: any[]): VoiceResponse => {
  return {
    id: `resp_${Date.now()}`,
    text,
    actions: actions || [],
    timestamp: new Date()
  };
};

export const generateContextualResponse = (intent: string, parameters: Record<string, any>, userContext?: any): string => {
  switch (intent) {
    case 'search':
      if (parameters.category === 'restaurants') {
        return userContext?.hasLocation 
          ? "I'm searching for restaurants with offers near you..."
          : "I need your location to find nearby restaurants. Please enable location services.";
      }
      return "I'm searching for what you requested...";
      
    case 'navigation':
      return parameters.destination 
        ? `Getting directions to ${parameters.destination}...`
        : "Where would you like to go?";
        
    case 'notification':
      return "Let me read your notifications...";
      
    case 'reminder':
      return parameters.task 
        ? `I'll remind you to ${parameters.task}.`
        : "What would you like me to remind you about?";
        
    default:
      return "I'm here to help! You can ask me to find nearby offers, set reminders, or read your notifications.";
  }
};