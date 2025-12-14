// components/chat/ChatInterface.tsx
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { ChatMessage, ChatRoom } from '../../types/chatTypes';
import { fetchChatMessages, fetchChatRooms } from '../../api/services/chatApi';
import ChatRoomView from './ChatRoomView';
import ChatSidebar from './ChatSidebar';

const ChatInterface = () => {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  // Fetch chat rooms
  const { data: chatRooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: fetchChatRooms,
    staleTime: 30000,
  });

  // Fetch messages when a room is selected
  const { data: roomMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chatMessages', selectedRoom?.id],
    queryFn: () => fetchChatMessages(selectedRoom!.id),
    enabled: !!selectedRoom,
    staleTime: 0,
  });

  // Connect to WebSocket
  useEffect(() => {
    if (!user) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/api/ws'),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      debug: (str) => {
        console.log('[STOMP]', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      console.error('Details:', frame.body);
    };

    client.onWebSocketError = (event) => {
      console.error('WebSocket error:', event);
    };

    client.onDisconnect = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [user?.id]);

  // Subscribe to selected room
  useEffect(() => {
    if (!stompClient || !selectedRoom || !isConnected) return;

    const subscription = stompClient.subscribe(
      `/topic/room/${selectedRoom.id}`,
      (message: IMessage) => {
        const receivedMessage: ChatMessage = JSON.parse(message.body);
        
        // Parse the content JSON string
        try {
          receivedMessage.parsedContent = JSON.parse(receivedMessage.content);
        } catch (error) {
          console.error('Failed to parse message content:', error);
        }

        // Check if message is from current room
        if (receivedMessage.chatRoomId === selectedRoom.id) {
          setMessages(prev => [...prev, receivedMessage]);
          
          // Update last message in sidebar
          queryClient.setQueryData<ChatRoom[]>(['chatRooms'], (old) => 
            old?.map(room => 
              room.id === selectedRoom.id 
                ? { 
                    ...room, 
                    lastMessage: receivedMessage.parsedContent?.text || 'Image sent',
                    lastMessageTime: receivedMessage.timestamp,
                    unreadCount: room.id === selectedRoom.id ? 0 : room.unreadCount + 1
                  } 
                : room
            )
          );
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, selectedRoom, isConnected, queryClient]);

  // Update messages when room messages load
  useEffect(() => {
    if (roomMessages.length > 0) {
      const parsedMessages = roomMessages.map(msg => ({
        ...msg,
        parsedContent: JSON.parse(msg.content)
      }));
      setMessages(parsedMessages);
    }
  }, [roomMessages]);

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    setIsSidebarOpen(false);
    
    // Mark room as read
    queryClient.setQueryData<ChatRoom[]>(['chatRooms'], (old) => 
      old?.map(r => 
        r.id === room.id 
          ? { ...r, unreadCount: 0 } 
          : r
      )
    );
  };

  const handleSendMessage = (content: string) => {
    if (!stompClient || !selectedRoom || !content.trim()) return;

    const messagePayload = {
      content,
      chatRoomId: selectedRoom.id,
    };

    stompClient.publish({
      destination: `/app/chat.send/${selectedRoom.id}`,
      body: JSON.stringify(messagePayload),
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-80 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <ChatSidebar
          rooms={chatRooms}
          selectedRoom={selectedRoom}
          onSelectRoom={handleSelectRoom}
          isLoading={roomsLoading}
        />
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <ChatRoomView
            room={selectedRoom}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={messagesLoading}
            isConnected={isConnected}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Trek Chat</h3>
              <p className="text-gray-500 max-w-md">
                Select a conversation from the sidebar to start chatting with your hiking buddies.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;