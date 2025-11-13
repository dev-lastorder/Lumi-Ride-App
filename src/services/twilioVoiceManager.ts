import AsyncStorage from '@react-native-async-storage/async-storage';
import { Call, CallInvite, Voice } from '@twilio/voice-react-native-sdk';
import axios from 'axios';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

// ✅ Update this to your backend URL
const BACKEND_URL = 'http://192.168.18.32:3000';  // Your local backend
// const BACKEND_URL = 'https://api-nestjs-enatega.up.railway.app';  // Or Railway

const TOKEN_STORAGE_KEY = '@twilio_voice_token_driver';
const TOKEN_EXPIRY_KEY = '@twilio_voice_token_expiry_driver';

class TwilioVoiceManager {
  private static instance: TwilioVoiceManager;
  private voice: Voice | null = null;
  private activeCall: Call | null = null;
  private isInitialized = false;
  private isInitializing = false;
  private isRegistered = false;
  private listeners: Set<(isActive: boolean, isConnecting: boolean) => void> = new Set();

  private constructor() {}

  static getInstance(): TwilioVoiceManager {
    if (!TwilioVoiceManager.instance) {
      TwilioVoiceManager.instance = new TwilioVoiceManager();
    }
    return TwilioVoiceManager.instance;
  }

  // Subscribe to call state changes
  subscribe(listener: (isActive: boolean, isConnecting: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(isActive: boolean, isConnecting: boolean) {
    this.listeners.forEach(listener => listener(isActive, isConnecting));
  }

  // Initialize Twilio Voice SDK
  async initialize(driverId: string) {
    if (this.isInitialized || this.isInitializing || !driverId) return;

    this.isInitializing = true;

    try {
      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) {
        console.error('Microphone permission denied');
        this.isInitializing = false;
        return;
      }

      this.voice = new Voice();

      // Handle incoming calls
      this.voice.on(Voice.Event.CallInvite, this.handleCallInvite);
      
      this.voice.on(Voice.Event.Registered, () => {
        console.log('✅ [DRIVER] Voice SDK registered');
        this.isRegistered = true;
      });

      this.voice.on(Voice.Event.Error, (error: any) => {
        if (error.message?.includes('PushKit')) {
          console.log('ℹ️ PushKit not configured (incoming calls unavailable in background)');
          return;
        }
        console.error('❌ [DRIVER] Voice SDK error:', error);
        this.isRegistered = false;
      });

      this.voice.on(Voice.Event.Unregistered, () => {
        console.log('[DRIVER] Voice SDK unregistered');
        this.isRegistered = false;
      });

      // Get token and register
      const token = await this.getToken(driverId);
      if (token && this.voice) {
        if (Platform.OS === 'ios') {
          await this.voice.initializePushRegistry();
        }

        try {
          await this.voice.register(token);
        } catch (regError) {
          console.warn('[DRIVER] Registration failed (continuing for outgoing calls):', regError);
        }

        this.isInitialized = true;
        console.log('✅ [DRIVER] Twilio Voice Manager initialized');
      }
    } catch (error) {
      console.error('[DRIVER] Failed to initialize Voice SDK:', error);
    } finally {
      this.isInitializing = false;
    }
  }

  // Request microphone permission
  private async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone for voice calls',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true;
  }

  // Get Twilio access token
  private async getToken(driverId: string): Promise<string | null> {
    try {
      // Check cached token
      const cachedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      const expiryStr = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);

      if (cachedToken && expiryStr) {
        const expiry = parseInt(expiryStr, 10);
        if (expiry > Date.now() + 5 * 60 * 1000) {
          console.log('✅ [DRIVER] Using cached token');
          return cachedToken;
        }
      }

      // Fetch new token
      console.log('🔄 [DRIVER] Fetching new token for:', driverId);
      const response = await axios.get(`${BACKEND_URL}/test/twilio/token`, {
        params: { identity: driverId }
      });

      const { token } = response.data;
      if (!token) throw new Error('No token received');

      // Cache token for 55 minutes
      const expiry = Date.now() + 55 * 60 * 1000;
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());

      return token;
    } catch (error: any) {
      console.error('[DRIVER] Failed to get token:', error.response?.data || error.message);
      return null;
    }
  }

  // Handle incoming call invites
  private handleCallInvite = (callInvite: CallInvite) => {
    Alert.alert(
      'Incoming Call',
      `Call from ${callInvite.getFrom()}`,
      [
        {
          text: 'Reject',
          onPress: () => callInvite.reject(),
          style: 'cancel'
        },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const call = await callInvite.accept();
              this.activeCall = call;
              this.setupCallListeners(call);
            } catch (error) {
              console.error('[DRIVER] Failed to accept call:', error);
            }
          }
        }
      ]
    );
  };

  // Setup call event listeners
  private setupCallListeners(call: Call) {
    call.on(Call.Event.Connected, () => {
      console.log('📞 [DRIVER] Call connected');
      this.notifyListeners(true, false);
    });

    call.on(Call.Event.Disconnected, () => {
      console.log('📞 [DRIVER] Call disconnected');
      this.activeCall = null;
      this.notifyListeners(false, false);
    });

    call.on(Call.Event.ConnectFailure, (error: any) => {
      console.error('❌ [DRIVER] Call failed:', error);
      this.activeCall = null;
      this.notifyListeners(false, false);
      Alert.alert('Call Failed', error.message || 'Failed to connect call');
    });

    call.on(Call.Event.Ringing, () => {
      console.log('📞 [DRIVER] Call ringing...');
    });
  }

  // Make outgoing call to customer (using customer identity, NOT phone number)
  async makeCall(driverId: string, customerId: string = 'f5258cbe-d593-440d-9d9c-1203aa003513') {
    if (!this.voice || !this.isInitialized) {
      Alert.alert('Not Ready', 'Voice service is initializing. Please wait a moment.');
      return;
    }

    if (this.activeCall) {
      Alert.alert('Call in Progress', 'Please end the current call first');
      return;
    }

    try {
      this.notifyListeners(false, true);

      const token = await this.getToken(driverId);
      if (!token) throw new Error('Failed to get access token');

      console.log('📞 [DRIVER] Initiating call to customer:', customerId);

      // ✅ Call using customer IDENTITY (not phone number)
      const call = await this.voice.connect(token, {
        params: { To: customerId }  // This is the customer's user ID
      });

      this.activeCall = call;
      this.setupCallListeners(call);
    } catch (error: any) {
      console.error('[DRIVER] Failed to make call:', error);
      this.notifyListeners(false, false);
      Alert.alert('Call Error', error.message || 'Failed to initiate call');
    }
  }

  // End active call
  endCall() {
    if (this.activeCall) {
      console.log('[DRIVER] Ending call...');
      this.activeCall.disconnect();
      this.activeCall = null;
      this.notifyListeners(false, false);
    }
  }

  // Toggle mute
  toggleMute(): boolean {
    if (this.activeCall) {
      const isMuted = this.activeCall.isMuted();
      this.activeCall.mute(!isMuted);
      return !isMuted;
    }
    return false;
  }

  // Check if call is active
  isCallActive(): boolean {
    return this.activeCall !== null;
  }

 // ✅ NEW CODE (FIXED):
async cleanup(driverId?: string) {
    if (this.voice) {
      try {
        // Unregister requires a valid token
        if (driverId) {
          const token = await this.getToken(driverId);
          if (token) {
            await this.voice.unregister(token);
          }
        }
      } catch (error) {
        console.error('[DRIVER] Cleanup error:', error);
      }
      this.voice = null;
    }
    this.activeCall = null;
    this.isInitialized = false;
    this.isRegistered = false;
  }
}

export const twilioVoiceManager = TwilioVoiceManager.getInstance();