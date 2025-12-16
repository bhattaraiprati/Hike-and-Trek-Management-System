import { useState } from 'react';
import { X, MessageCircleMore, Users, Hash, Loader } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChatRoom } from '../../../api/services/chatApi';
import { ErrorMessageToast, SuccesfulMessageToast } from '../../../utils/Toastify.util';


interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventTitle: string;
  onChatCreated: (chatRoomId: number) => void;
}

const CreateChatModal = ({ isOpen, onClose, eventId, eventTitle, onChatCreated }: CreateChatModalProps) => {
  const [chatName, setChatName] = useState('');
  const queryClient = useQueryClient();

  const createChatMutation = useMutation({
    mutationFn: ({ name }: { name: string }) => 
      createChatRoom(eventId, name),
    onSuccess: (data) => {
      SuccesfulMessageToast('Chat room created successfully!');
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      onChatCreated(data.id);
      onClose();
    },
    onError: () => {
      ErrorMessageToast('Failed to create chat room');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatName.trim()) {
      ErrorMessageToast('Please enter a chat room name');
      return;
    }
    createChatMutation.mutate({ name: chatName.trim() });
  };

  const handleClose = () => {
    setChatName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal - Scrollable container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2a4a7a] rounded-lg flex items-center justify-center">
                <MessageCircleMore className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E3A5F]">Create Chat Room</h2>
                <p className="text-sm text-gray-600">Set up chat for your event</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={createChatMutation.isPending}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Event Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4 text-[#1E3A5F]" />
                  <span className="text-sm font-medium text-[#1E3A5F]">Event Details</span>
                </div>
                <p className="font-medium text-gray-900">{eventTitle}</p>
                <p className="text-sm text-gray-600 mt-1">Event ID: {eventId}</p>
              </div>

              {/* Chat Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chat Room Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <MessageCircleMore className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    placeholder="Enter chat room name"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                    required
                    disabled={createChatMutation.isPending}
                    maxLength={50}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Name will be visible to all participants
                  </p>
                  <p className="text-xs text-gray-500">
                    {chatName.length}/50
                  </p>
                </div>
              </div>

              {/* Chat Info */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Chat Features</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <MessageCircleMore className="w-4 h-4 text-[#1E3A5F]" />
                    <span>Real-time chat</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-4 h-4 text-[#1E3A5F]" />
                    <span>Group chat</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <svg className="w-4 h-4 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Image sharing</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <svg className="w-4 h-4 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Auto sync</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Important:</span> All event participants will automatically join this chat. The chat room can be archived but not deleted.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={createChatMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createChatMutation.isPending || !chatName.trim()}
                className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2a4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createChatMutation.isPending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <MessageCircleMore className="w-4 h-4" />
                    Create Chat Room
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateChatModal;