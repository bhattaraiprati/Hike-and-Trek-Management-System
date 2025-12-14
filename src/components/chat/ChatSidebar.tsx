
import { Search, Users, MapPin, Clock } from 'lucide-react';
import type { ChatRoom } from '../../types/chatTypes';

interface ChatSidebarProps {
  rooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  onSelectRoom: (room: ChatRoom) => void;
  isLoading: boolean;
}

const ChatSidebar = ({ rooms, selectedRoom, onSelectRoom, isLoading }: ChatSidebarProps) => {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1E3A5F]">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse mb-4">
              <div className="flex items-center gap-3 p-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#1E3A5F]">Messages</h2>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-1">Start chatting with your hiking buddies!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors duration-150 ${
                  selectedRoom?.id === room.id ? 'bg-blue-50 border-r-2 border-[#1E3A5F]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A5F] to-[#2a4a7a] rounded-full flex items-center justify-center text-white font-medium">
                      {room.name.charAt(0).toUpperCase()}
                    </div>
                    {room.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Room Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {room.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        {room.lastMessageTime && (
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatTime(room.lastMessageTime)}
                          </span>
                        )}
                        {room.unreadCount > 0 && (
                          <span className="bg-[#1E3A5F] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event title if available */}
                    {room.eventTitle && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{room.eventTitle}</span>
                      </div>
                    )}

                    {/* Participant count */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{room.participantCount} member{room.participantCount !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Last message preview */}
                    {room.lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {room.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;