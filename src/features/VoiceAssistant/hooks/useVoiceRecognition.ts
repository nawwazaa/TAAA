import { useState, useEffect, useCallback, useRef } from 'react';
import { SpeechRecognitionResult, VoiceSettings } from '../types';

export const useVoiceRecognition = (settings: VoiceSettings) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = settings.language === 'ar' ? 'ar-SA' : 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        if (isListeningRef.current) {
          // Restart if we should still be listening
          recognition.start();
        }
      };
      
      recognition.onerror = (event: any) => {
        setError(event.error);
        setIsListening(false);
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let maxConfidence = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence || 0;
          
          if (result.isFinal) {
            finalTranscript += transcript;
            maxConfidence = Math.max(maxConfidence, confidence);
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          console.log('🎤 Final transcript:', finalTranscript, 'Confidence:', maxConfidence);
          setTranscript(finalTranscript.trim());
          setConfidence(maxConfidence);
          
          // Process any final transcript as a command when manually listening
          if (isListeningRef.current) {
            console.log('🚀 Triggering voice command processing...');
            window.dispatchEvent(new CustomEvent('voice-command', {
              detail: { command: finalTranscript.trim(), confidence: maxConfidence }
            }));
          }
        } else if (interimTranscript) {
          setTranscript(interimTranscript.trim());
        }
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [settings.language, settings.wakeWord, settings.customWakeWord]);

  const handleWakeWordDetected = (transcript: string) => {
    // Extract command after wake word
    const wakeWords = ['hey flix', 'flix assistant', settings.customWakeWord?.toLowerCase()].filter(Boolean);
    let command = transcript.toLowerCase();
    
    for (const wakeWord of wakeWords) {
      if (command.includes(wakeWord!)) {
        command = command.split(wakeWord!)[1]?.trim() || '';
        break;
      }
    }
    
    if (command) {
      // Trigger command processing
      window.dispatchEvent(new CustomEvent('voice-command', {
        detail: { command, confidence }
      }));
    }
  };

  const startListening = useCallback(() => {
    if (!isSupported || !settings.isEnabled) return;
    
    try {
      isListeningRef.current = true;
      recognitionRef.current?.start();
    } catch (error) {
      setError('Failed to start voice recognition');
    }
  }, [isSupported, settings.isEnabled]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
};