import { useState, useCallback, useRef } from 'react';
import { VoiceSettings } from '../types';

export const useTextToSpeech = (settings: VoiceSettings) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useState(() => {
    setIsSupported('speechSynthesis' in window);
  });

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
      
      // Try to find preferred voice type
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => {
        const isCorrectLang = voice.lang.startsWith(settings.language);
        const isCorrectGender = settings.voiceType === 'female' 
          ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman')
          : voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man');
        return isCorrectLang && (isCorrectGender || voices.length < 5); // Fallback if no gender-specific voices
      });
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        setError(event.error);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      setError('Failed to speak text');
      setIsSpeaking(false);
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