// hooks/useNotificationWebSocket.tsx
import { useEffect, useRef } from 'react';
import { type IMessage } from '@stomp/stompjs';
import { useWebSocket } from './useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface UseNotificationWebSocketOptions {
  onNotificationReceived?: (notification: Notification) => void;
  showToast?: boolean;
}

export const useNotificationWebSocket = ({
  onNotificationReceived,
  showToast = true,
}: UseNotificationWebSocketOptions = {}) => {
  const queryClient = useQueryClient();
  const subscriptionRef = useRef<(() => void) | null>(null);
  
  const { isConnected, subscribe } = useWebSocket({
    onConnect: () => {
      console.log('Notification WebSocket connected');
    },
    onDisconnect: () => {
      console.log('Notification WebSocket disconnected');
      subscriptionRef.current = null;
    },
  });

  useEffect(() => {
    // Only subscribe if connected and not already subscribed
    if (!isConnected || subscriptionRef.current) return;

    console.log('Attempting to subscribe to notifications...');

    const unsubscribe = subscribe(
      '/user/queue/notifications',
      (message: IMessage) => {
        try {
          const notification: Notification = JSON.parse(message.body);
          console.log('Received notification:', notification);

          // Show toast notification
          if (showToast) {
            toast.success(
              <div>
                <div className="font-semibold">{notification.title}</div>
                <div className="text-sm text-gray-600">{notification.message}</div>
              </div>,
              {
                duration: 4000,
                position: 'top-right',
              }
            );
          }

          // Invalidate queries to refetch notifications
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({ queryKey: ['unreadCount'] });

          // Call custom callback
          onNotificationReceived?.(notification);
        } catch (error) {
          console.error('Error processing notification:', error);
        }
      }
    );

    if (unsubscribe) {
      subscriptionRef.current = unsubscribe;
      console.log('Successfully subscribed to notifications');
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
    };
  }, [isConnected, subscribe, onNotificationReceived, showToast, queryClient]);

  return {
    isConnected,
  };
};