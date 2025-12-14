// components/chat/MessageInput.tsx
import { useState, useRef } from 'react';
import { Send, Image as ImageIcon, Smile, Paperclip } from 'lucide-react';

interface MessageInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  onSendText: () => void;
  onSendImage: (url: string, caption?: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
}

const MessageInput = ({
  messageText,
  setMessageText,
  onSendText,
  onSendImage,
  onKeyPress,
  disabled,
}: MessageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Trek Sathi');
      formData.append('cloud_name', 'dtwunctra');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dtwunctra/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onSendImage(result.secure_url, file.name.split('.')[0]);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleImageUpload(file);
        }
      }
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-3">
        {/* Attachment button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="p-2.5 text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload image"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#1E3A5F] rounded-full animate-spin"></div>
          ) : (
            <Paperclip className="w-5 h-5" />
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={onKeyPress}
            onPaste={handlePaste}
            placeholder={disabled ? "Connecting to chat..." : "Type your message..."}
            disabled={disabled}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent resize-none max-h-32 min-h-[44px] disabled:opacity-50"
            rows={1}
          />
          <div className="absolute right-3 bottom-2 flex items-center gap-1">
            {/* Emoji picker placeholder */}
            <button
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Add emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={onSendText}
          disabled={!messageText.trim() || disabled}
          className="p-3 bg-[#1E3A5F] text-white rounded-xl hover:bg-[#2a4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Upload hint */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
        <span className="flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          Drag & drop or paste images to upload
        </span>
      </div>
    </div>
  );
};

export default MessageInput;