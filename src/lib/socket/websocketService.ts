

import io, { Socket } from 'socket.io-client';


interface IsentMessage {
  sender: string;
  receiver: string;
  text: string;
}

interface IReceivedMessage {
  sender: string;
  receiver: string;
  text: string;
}



const IS_DEV = __DEV__;
const WEBSOCKET_URL = IS_DEV 
  ? 'https://api-nestjs-enatega.up.railway.app' 
  : 'https://api-nestjs-enatega.up.railway.app';



class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private currentUserId: string | null = null;
  private messageListeners: ((message: IReceivedMessage) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];

  // Connect to WebSocket server
  connect(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Already connected for this user
        if (this.socket && this.isConnected && this.currentUserId === userId) {
          console.log('✅ WebSocket already connected for user:', userId);
          resolve(true);
          return;
        }

        // Disconnect if different user
        if (this.socket) {
          this.disconnect();
        }

        console.log('🔌 Connecting to WebSocket:', WEBSOCKET_URL);
        
        // Create socket connection
        this.socket = io(WEBSOCKET_URL, {
          transports: ['websocket'],
          autoConnect: true,
        });

        // Handle successful connection
        this.socket.on('connect', () => {
          console.log('✅ WebSocket connected with ID:', this.socket?.id);
          this.isConnected = true;
          this.currentUserId = userId;
          
          // Register user with backend
          this.socket?.emit('add-user', userId);
          console.log('📤 Emitted add-user for:', userId);
          
          // Notify listeners
          this.connectionListeners.forEach(listener => listener(true));
          resolve(true);
        });

        // Handle disconnection
        this.socket.on('disconnect', () => {
          console.log('❌ WebSocket disconnected');
          this.isConnected = false;
          this.connectionListeners.forEach(listener => listener(false));
        });

        // Handle connection errors
        this.socket.on('connect_error', (error: any) => {
          console.error('❌ WebSocket connection error:', error);
          this.isConnected = false;
          this.connectionListeners.forEach(listener => listener(false));
          reject(error);
        });

        // Listen for incoming messages
        this.socket.on('receive-message', (message: IReceivedMessage) => {
          console.log('📥 Received message:', message);
          this.messageListeners.forEach(listener => listener(message));
        });

        // Connection timeout (10 seconds)
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000);

      } catch (error) {
        console.error('❌ WebSocket connection error:', error);
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.currentUserId = null;
    this.connectionListeners.forEach(listener => listener(false));
  }

  // Send message via WebSocket
  sendMessage(message: IsentMessage): void {
    if (!this.socket || !this.isConnected) {
      console.error('❌ WebSocket not connected, cannot send message');
      return;
    }

    console.log('📤 Sending message via WebSocket:', message);
    this.socket.emit('send-message', message);
  }

  // Subscribe to incoming messages
  onMessage(callback: (message: IReceivedMessage) => void): () => void {
    this.messageListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.messageListeners.indexOf(callback);
      if (index > -1) {
        this.messageListeners.splice(index, 1);
      }
    };
  }

  // Subscribe to connection status changes
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.connectionListeners.indexOf(callback);
      if (index > -1) {
        this.connectionListeners.splice(index, 1);
      }
    };
  }

  // Check if socket is connected
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  // Reconnect if disconnected
  reconnect(): void {
    if (this.currentUserId && !this.isConnected) {
      console.log('🔄 Attempting to reconnect WebSocket');
      this.connect(this.currentUserId);
    }
  }
}


export const webSocketService = new WebSocketService();

// Export types
export type { IReceivedMessage, IsentMessage };
