import { useState, useCallback, useRef } from 'react';
import React from 'react';
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
      
      // Wait a moment for cancellation to complete
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice settings
        utterance.rate = settings.speed;
        utterance.volume = settings.volume;
        utterance.lang = settings.language === 'ar' ? 'ar-SA' : 'en-US';
        
        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
          // Find a suitable voice
          let selectedVoice = voices.find(voice => {
            const isCorrectLang = voice.lang.startsWith(settings.language === 'ar' ? 'ar' : 'en');
            return isCorrectLang;
          });
          
          // Fallback to any English voice if no match found
          if (!selectedVoice && settings.language === 'en') {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
          }
          
          // Use default voice if still no match
          if (!selectedVoice) {
            selectedVoice = voices[0];
          }
          
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log('Using voice:', selectedVoice.name, selectedVoice.lang);
          }
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
          console.error('Speech error:', event.error);
          setError(event.error);
          setIsSpeaking(false);
        };

        utterance.onpause = () => {
          console.log('Speech paused');
        };

        utterance.onresume = () => {
          console.log('Speech resumed');
        };

        utteranceRef.current = utterance;
        
        // Speak the text
        console.log('Speaking text:', text);
        console.log('Voice settings:', { rate: utterance.rate, volume: utterance.volume, lang: utterance.lang });
        window.speechSynthesis.speak(utterance);
      }, 200);

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