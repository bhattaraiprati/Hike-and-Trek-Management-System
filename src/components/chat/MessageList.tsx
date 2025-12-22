import { Image as ImageIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ChatMessage } from '../../types/chatTypes';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: number;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList = ({ messages, currentUserId, messagesEndRef }: MessageListProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isSameSender = (current: ChatMessage, previous?: ChatMessage) => {
    if (!previous) return false;
    return current.senderId === previous.senderId;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messagesEndRef]);

  const shouldShowHeader = (current: ChatMessage, previous?: ChatMessage) => {
    if (!previous) return true;
    if (current.senderId !== previous.senderId) return true;
    
    const currentTime = new Date(current.timestamp).getTime();
    const previousTime = new Date(previous.timestamp).getTime();
    return (currentTime - previousTime) > 5 * 60 * 1000; // 5 minutes
  };

  // Reverse messages to show oldest first, newest last
  const sortedMessages = [...messages].reverse();

  return (
    <>
      {/* Message List */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to say hello!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedMessages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUserId;
              const showHeader = shouldShowHeader(message, sortedMessages[index - 1]);
              const showAvatar = showHeader || !isSameSender(message, sortedMessages[index - 1]);

              return (
                <div
                  key={message.messageId}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  {/* Avatar (only for others' messages and when needed) */}
                  {!isOwnMessage && showAvatar && (
                    <div className="flex-shrink-0 w-8 h-8">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#1E3A5F] to-[#2a4a7a] rounded-full flex items-center justify-center text-white text-xs">
                        {message.senderName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}

                  {/* Spacer for own messages */}
                  {isOwnMessage && <div className="w-8"></div>}

                  {/* Message Content */}
                  <div className={`flex flex-col max-w-[70%] md:max-w-[60%] ${
                    isOwnMessage ? 'items-end' : 'items-start'
                  }`}>
                    {/* Sender Name */}
                    {showHeader && !isOwnMessage && (
                      <span className="text-xs font-medium text-gray-700 mb-1">
                        {message.senderName}
                      </span>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`group relative rounded-2xl px-4 py-2.5 ${
                        isOwnMessage
                          ? 'bg-[#1E3A5F] text-white rounded-tr-none'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none'
                      }`}
                    >
                      {message.parsedContent?.type === 'text' ? (
                        <p className="whitespace-pre-wrap break-words">
                          {message.parsedContent.text}
                        </p>
                      ) : message.parsedContent?.type === 'image' ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedImage(message.parsedContent?.url || null)}
                            className="block relative overflow-hidden rounded-lg"
                          >
                            <img
                              src={message.parsedContent.url}
                              alt={message.parsedContent.caption || 'Shared image'}
                              className="max-w-full h-auto max-h-96 object-cover hover:opacity-95 transition-opacity"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                          {message.parsedContent.caption && (
                            <p className="text-sm italic text-gray-600">
                              {message.parsedContent.caption}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          [Unsupported message type]
                        </p>
                      )}

                      {/* Timestamp */}
                      <div className={`absolute bottom-1 ${
                        isOwnMessage ? 'left-2' : 'right-2'
                      } opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <span className={`text-xs ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageList;