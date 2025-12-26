// services/websocket/WebSocketService.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export class WebSocketService {
  private client: Client | null = null;
  private isConnected: boolean = false;
  private connectionCallbacks: Set<(connected: boolean) => void> = new Set();
  private baseUrl: string;
  private connectionPromise: Promise<Client> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  connect(token: string): Promise<Client> {
    // Return existing connection promise if already connecting
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Return existing client if already connected
    if (this.client && this.isConnected) {
      return Promise.resolve(this.client);
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(this.baseUrl),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          console.log('[STOMP]', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = (frame) => {
        console.log('WebSocket connected', frame);
        this.isConnected = true;
        this.connectionPromise = null;
        this.notifyConnectionChange(true);
        if (this.client) {
          resolve(this.client);
        }
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        console.error('Details:', frame.body);
        this.isConnected = false;
        this.connectionPromise = null;
        this.notifyConnectionChange(false);
        reject(new Error(frame.headers['message']));
      };

      this.client.onWebSocketError = (event) => {
        console.error('WebSocket error:', event);
        this.isConnected = false;
        this.connectionPromise = null;
        this.notifyConnectionChange(false);
        reject(event);
      };

      this.client.onDisconnect = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.connectionPromise = null;
        this.notifyConnectionChange(false);
      };

      this.client.activate();
    });

    return this.connectionPromise;
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
      this.connectionPromise = null;
      this.notifyConnectionChange(false);
    }
  }

  getClient(): Client | null {
    return this.client;
  }

  getConnectionStatus(): boolean {
    return this.isConnected && this.client !== null && this.client.connected;
  }

  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionCallbacks.add(callback);
    
    return () => {
      this.connectionCallbacks.delete(callback);
    };
  }

  private notifyConnectionChange(connected: boolean): void {
    this.connectionCallbacks.forEach(callback => callback(connected));
  }
}

let wsServiceInstance: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!wsServiceInstance) {
    wsServiceInstance = new WebSocketService('http://localhost:8080/api/ws');
  }
  return wsServiceInstance;
};