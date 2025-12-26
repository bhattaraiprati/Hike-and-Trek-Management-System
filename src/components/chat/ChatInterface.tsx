// components/chat/ChatInterface.tsx
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { ChatRoom } from '../../types/chatTypes';
import { fetchChatMessages, fetchChatRooms } from '../../api/services/chatApi';
import { useChatWebSocket } from '../../hooks/useChatWebSocket';
import ChatRoomView from './ChatRoomView';
import ChatSidebar from './ChatSidebar';

const ChatInterface = () => {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch chat rooms
  const { data: chatRooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: fetchChatRooms,
    staleTime: 30000,
  });

  // Fetch messages when a room is selected
  const { data: roomMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chatMessages', selectedRoom?.roomId],
    queryFn: () => fetchChatMessages(selectedRoom!.roomId),
    enabled: !!selectedRoom,
    staleTime: 0,
  });

  // Use chat WebSocket hook
  const {
    messages,
    isConnected,
    sendMessage,
    setMessagesFromHistory,
  } = useChatWebSocket({
    selectedRoom,
    onMessageReceived: (message) => {
      console.log('New message received:', message);
    },
  });

  // Update messages when room messages load
  useEffect(() => {
    if (roomMessages.length > 0) {
      setMessagesFromHistory(roomMessages);
    }
  }, [roomMessages, setMessagesFromHistory]);

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    setIsSidebarOpen(false);

    // Mark room as read
    queryClient.setQueryData<ChatRoom[]>(['chatRooms'], (old) =>
      old?.map((r) => (r.roomId === room.roomId ? { ...r, unreadCount: 0 } : r))
    );
  };

  const handleSendMessage = (content: string) => {
    const success = sendMessage(content);
    if (!success) {
      console.error('Failed to send message');
    }
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
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-80 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
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
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to Trek Chat
              </h3>
              <p className="text-gray-500 max-w-md">
                Select a conversation from the sidebar to start chatting with
                your hiking buddies.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;