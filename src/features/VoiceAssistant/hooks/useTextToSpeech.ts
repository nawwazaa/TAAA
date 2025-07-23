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
    
    // Force load voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = useCallback((text: string, options?: { priority?: 'high' | 'normal' }) => {
    if (!isSupported || !settings.isEnabled) {
      console.log('Speech not supported or disabled');
      return;
    }

    console.log('=== SPEECH SYNTHESIS DEBUG ===');
    console.log('Text to speak:', text);
    console.log('Settings:', settings);

    try {
      // Stop any current speech
      if (window.speechSynthesis.speaking) {
        console.log('Stopping current speech...');
        window.speechSynthesis.cancel();
      }
      
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set basic properties
      utterance.rate = settings.speed || 1.0;
      utterance.volume = settings.volume || 1.0;
      utterance.pitch = 1.0;
      
      // Set language
      if (settings.language === 'ar') {
        utterance.lang = 'ar-SA';
      } else {
        utterance.lang = 'en-US';
      }
      
      console.log('Utterance settings:', {
        rate: utterance.rate,
        volume: utterance.volume,
        pitch: utterance.pitch,
        lang: utterance.lang
      });

      // Get and set voice
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices.length);
      
      if (voices.length > 0) {
        // Try to find a good voice
        let selectedVoice = null;
        
        // First try: exact language match
        selectedVoice = voices.find(voice => 
          voice.lang === utterance.lang && voice.localService
        );
        
        // Second try: language prefix match
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.startsWith(settings.language === 'ar' ? 'ar' : 'en')
          );
        }
        
        // Third try: any English voice for English
        if (!selectedVoice && settings.language === 'en') {
          selectedVoice = voices.find(voice => 
            voice.lang.startsWith('en')
          );
        }
        
        // Fourth try: default voice
        if (!selectedVoice) {
          selectedVoice = voices[0];
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log('Selected voice:', {
            name: selectedVoice.name,
            lang: selectedVoice.lang,
            localService: selectedVoice.localService,
            default: selectedVoice.default
          });
        } else {
          console.log('No voice selected, using default');
        }
      } else {
        console.log('No voices available yet');
      }

      // Set up event handlers
      utterance.onstart = () => {
        console.log('✅ Speech started successfully');
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        console.log('✅ Speech ended');
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('❌ Speech error:', event.error);
        console.error('Error details:', event);
        setError(`Speech error: ${event.error}`);
        setIsSpeaking(false);
      };

      utterance.onpause = () => {
        console.log('⏸️ Speech paused');
      };

      utterance.onresume = () => {
        console.log('▶️ Speech resumed');
      };

      utterance.onboundary = (event) => {
        console.log('📍 Speech boundary:', event.name, 'at', event.charIndex);
      };

      utteranceRef.current = utterance;
      
      // Speak immediately
      console.log('🎤 Calling speechSynthesis.speak()...');
      window.speechSynthesis.speak(utterance);
      
      // Check if it's actually speaking
      setTimeout(() => {
        console.log('Speech status check:', {
          speaking: window.speechSynthesis.speaking,
          pending: window.speechSynthesis.pending,
          paused: window.speechSynthesis.paused
        });
        
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          console.warn('⚠️ Speech may not have started properly');
          setError('Speech synthesis may not be working');
          setIsSpeaking(false);
        }
      }, 100);

    } catch (error) {
      console.error('❌ TTS Error:', error);
      setError('Failed to speak text');
      setIsSpeaking(false);
    }
  }, [isSupported, settings]);

  const stop = useCallback(() => {
    console.log('🛑 Stopping speech synthesis');
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    console.log('⏸️ Pausing speech synthesis');
    window.speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    console.log('▶️ Resuming speech synthesis');
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