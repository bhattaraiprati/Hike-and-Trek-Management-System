// components/chat/ChatRoomView.tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { ChatMessage, ChatRoom } from '../../types/chatTypes';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatRoomViewProps {
  room: ChatRoom;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isConnected: boolean;
}

const ChatRoomView = ({ room, messages, onSendMessage, isLoading, isConnected }: ChatRoomViewProps) => {
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendText = () => {
    if (!messageText.trim() || !user) return;

    const content = JSON.stringify({
      type: 'text',
      text: messageText.trim(),
    });

    onSendMessage(content);
    setMessageText('');
  };

  const handleSendImage = (url: string, caption?: string) => {
    if (!user) return;

    const content = JSON.stringify({
      type: 'image',
      url,
      caption: caption || '',
    });

    onSendMessage(content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse mb-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-16 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader 
        room={room} 
        isConnected={isConnected}
      />
      
      <MessageList 
        messages={messages}
        currentUserId={Number(user?.id || 0)}
        messagesEndRef={messagesEndRef}
      />
      
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        onSendText={handleSendText}
        onSendImage={handleSendImage}
        onKeyPress={handleKeyPress}
        disabled={!isConnected}
      />
    </div>
  );
};

export default ChatRoomView;