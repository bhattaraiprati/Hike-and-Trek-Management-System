// hooks/useWebSocket.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import { getWebSocketService } from '../Services/websocket/WebSocketService';


interface UseWebSocketOptions {
  enabled?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { enabled = true, onConnect, onDisconnect, onError } = options;
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const connectAttemptedRef = useRef(false);

  useEffect(() => {
    if (!enabled || connectAttemptedRef.current) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    connectAttemptedRef.current = true;
    setIsConnecting(true);

    const wsService = getWebSocketService();

    // Subscribe to connection status changes
    const unsubscribe = wsService.onConnectionChange((connected) => {
      setIsConnected(connected);
      setIsConnecting(false);
      if (connected) {
        onConnect?.();
      } else {
        onDisconnect?.();
      }
    });

    // Connect to WebSocket
    wsService
      .connect(token)
      .then((stompClient) => {
        console.log('WebSocket connected successfully');
        setClient(stompClient);
        setIsConnected(true);
        setIsConnecting(false);
      })
      .catch((error) => {
        console.error('Failed to connect:', error);
        setIsConnecting(false);
        connectAttemptedRef.current = false;
        onError?.(error);
      });

    return () => {
      unsubscribe();
      connectAttemptedRef.current = false;
    };
  }, [enabled, onConnect, onDisconnect, onError]);

  const subscribe = useCallback(
    (
      destination: string,
      callback: (message: IMessage) => void
    ): (() => void) | null => {
      if (!client || !isConnected) {
        console.warn('WebSocket not connected, cannot subscribe to:', destination);
        return null;
      }

      try {
        const subscription: StompSubscription = client.subscribe(
          destination,
          callback
        );

        console.log('Subscribed to:', destination);

        return () => {
          try {
            subscription.unsubscribe();
            console.log('Unsubscribed from:', destination);
          } catch (error) {
            console.error('Error unsubscribing:', error);
          }
        };
      } catch (error) {
        console.error('Error subscribing to', destination, error);
        return null;
      }
    },
    [client, isConnected]
  );

  const publish = useCallback(
    (destination: string, body: string, headers?: Record<string, string>) => {
      if (!client || !isConnected) {
        console.warn('WebSocket not connected, cannot publish to:', destination);
        return false;
      }

      try {
        client.publish({
          destination,
          body,
          headers,
        });
        return true;
      } catch (error) {
        console.error('Error publishing to', destination, error);
        return false;
      }
    },
    [client, isConnected]
  );

  return {
    client,
    isConnected,
    isConnecting,
    subscribe,
    publish,
  };
};