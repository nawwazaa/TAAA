import { useState, useCallback, useRef } from 'react';
import { VoiceSettings } from '../types';

export const useTextToSpeech = (settings: VoiceSettings) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string, options?: { priority?: 'high' | 'normal' }) => {
    if (!isSupported || !settings.isEnabled) return;

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = settings.speed;
      utterance.volume = settings.volume;
      utterance.lang = settings.language === 'ar' ? 'ar-SA' : 'en-US';
      
      // Wait for voices to load and then set preferred voice
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const preferredVoice = voices.find(voice => {
            const isCorrectLang = voice.lang.startsWith(settings.language);
            const isCorrectGender = settings.voiceType === 'female' 
              ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman')
              : voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man');
            return isCorrectLang && (isCorrectGender || voices.length < 5);
          });
          
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }
      };
      
      // Set voice immediately if available, or wait for voices to load
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
        console.log('Speech started:', text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('Speech ended');
      };

      utterance.onerror = (event) => {
        setError(event.error);
        setIsSpeaking(false);
        console.error('Speech error:', event.error);
      };

      utteranceRef.current = utterance;
      
      // Add a small delay to ensure proper initialization
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      setError('Failed to speak text');
      setIsSpeaking(false);
      console.error('TTS Error:', error);
    }
  }, [isSupported, settings]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
    error
  };
};