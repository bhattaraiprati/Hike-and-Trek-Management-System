// hooks/useChatWebSocket.ts
import { useEffect, useState, useCallback } from 'react';
import { type IMessage } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';
import type { ChatMessage, ChatRoom } from '../types/chatTypes';

interface UseChatWebSocketOptions {
  selectedRoom: ChatRoom | null;
  onMessageReceived?: (message: ChatMessage) => void;
}

export const useChatWebSocket = ({
  selectedRoom,
  onMessageReceived,
}: UseChatWebSocketOptions) => {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const { isConnected, subscribe, publish } = useWebSocket({
    onConnect: () => {
      console.log('Chat WebSocket connected');
    },
    onDisconnect: () => {
      console.log('Chat WebSocket disconnected');
    },
  });

  // Subscribe to selected room
  useEffect(() => {
    if (!selectedRoom || !isConnected) return;

    const unsubscribe = subscribe(
      `/topic/room/${selectedRoom.roomId}`,
      (message: IMessage) => {
        const receivedMessage: ChatMessage = JSON.parse(message.body);

        // Parse the content JSON string
        try {
          receivedMessage.parsedContent = JSON.parse(receivedMessage.content);
        } catch (error) {
          console.error('Failed to parse message content:', error);
        }

        // Check if message is from current room
        if (receivedMessage.chatRoomId === selectedRoom.roomId) {
          setMessages((prev) => [...prev, receivedMessage]);
          onMessageReceived?.(receivedMessage);

          // Update last message in sidebar
          queryClient.setQueryData<ChatRoom[]>(['chatRooms'], (old) =>
            old?.map((room) =>
              room.roomId === selectedRoom.roomId
                ? {
                    ...room,
                    lastMessage:
                      receivedMessage.parsedContent?.text || 'Image sent',
                    lastMessageTime: receivedMessage.timestamp,
                    unreadCount:
                      room.roomId === selectedRoom.roomId
                        ? 0
                        : room.unreadCount + 1,
                  }
                : room
            )
          );
        }
      }
    );

    return () => {
      unsubscribe?.();
    };
  }, [selectedRoom, isConnected, subscribe, queryClient, onMessageReceived]);

  const sendMessage = useCallback(
    (content: string): boolean => {
      if (!selectedRoom || !content.trim()) {
        console.warn('Cannot send message: no room selected or empty content');
        return false;
      }

      const messagePayload = {
        content,
        chatRoomId: selectedRoom.roomId,
      };

      return publish(
        `/app/chat.send/${selectedRoom.roomId}`,
        JSON.stringify(messagePayload)
      );
    },
    [selectedRoom, publish]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setMessagesFromHistory = useCallback((historyMessages: ChatMessage[]) => {
    const parsedMessages = historyMessages.map((msg) => ({
      ...msg,
      parsedContent: JSON.parse(msg.content),
    }));
    setMessages(parsedMessages);
  }, []);

  return {
    messages,
    isConnected,
    sendMessage,
    clearMessages,
    setMessagesFromHistory,
  };
};