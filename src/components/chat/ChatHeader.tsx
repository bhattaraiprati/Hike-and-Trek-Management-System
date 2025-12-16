// components/chat/ChatHeader.tsx
import { Users, Wifi, WifiOff, ChevronLeft } from 'lucide-react';
import type { ChatRoom } from '../../types/chatTypes';

interface ChatHeaderProps {
  room: ChatRoom;
  isConnected: boolean;
}

const ChatHeader = ({ room, isConnected }: ChatHeaderProps) => {
  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile back button (hidden on desktop) */}
          <button className="lg:hidden text-gray-600 hover:text-gray-900">
            <ChevronLeft size={20} />
          </button>
          
          {/* Room info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2a4a7a] rounded-full flex items-center justify-center text-white font-medium">
                {room.roomName.charAt(0).toUpperCase()}
              </div>
              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                isConnected ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
            
            <div>
              <h2 className="font-bold text-gray-900">{room.roomName}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-3.5 h-3.5" />
                <span>{room.participantCount} participants</span>
                <div className="flex items-center gap-1 ml-2">
                  {isConnected ? (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-600">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-500">Connecting...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event info if available */}
        {room.eventTitle && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-[#1E3A5F]">
              {room.eventTitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;