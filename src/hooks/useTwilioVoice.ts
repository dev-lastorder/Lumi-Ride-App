import { useEffect, useState } from 'react';
import { twilioVoiceManager } from '../services/twilioVoiceManager';

interface UseTwilioVoiceReturn {
  makeCall: (customerId?: string) => Promise<void>;
  endCall: () => void;
  toggleMute: () => boolean;
  isCallActive: boolean;
  isConnecting: boolean;
  isReady: boolean; // Add this
}

export const useTwilioVoice = (driverId: string | undefined): UseTwilioVoiceReturn => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!driverId) return;

    let mounted = true;

    const init = async () => {
      try {
        console.log('[DRIVER HOOK] Initializing for driver:', driverId);
        await twilioVoiceManager.initialize(driverId);
        if (mounted) setIsReady(true);
      } catch (error) {
        console.error('[DRIVER HOOK] Init failed:', error);
        if (mounted) setIsReady(false);
      }
    };

    init();

    const unsubscribe = twilioVoiceManager.subscribe((active, connecting) => {
      if (!mounted) return;
      console.log('[DRIVER HOOK] Call state updated:', { active, connecting });
      setIsCallActive(active);
      setIsConnecting(connecting);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [driverId]);

  const makeCall = async (customerId?: string) => {
    if (!isReady) {
      console.warn('[DRIVER HOOK] Twilio not ready yet');
      return;
    }
    if (driverId) {
      console.log('[DRIVER HOOK] Making call to customer:', customerId || 'customer123');
      await twilioVoiceManager.makeCall(driverId, customerId);
    } else {
      console.error('[DRIVER HOOK] No driver ID available');
    }
  };

  const endCall = () => {
    console.log('[DRIVER HOOK] Ending call');
    twilioVoiceManager.endCall();
  };

  const toggleMute = () => {
    const muted = twilioVoiceManager.toggleMute();
    console.log('[DRIVER HOOK] Mute toggled:', muted);
    return muted;
  };

  return {
    makeCall,
    endCall,
    toggleMute,
    isCallActive,
    isConnecting,
    isReady,
  };
};