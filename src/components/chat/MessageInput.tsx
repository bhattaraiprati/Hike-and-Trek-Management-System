// components/chat/MessageInput.tsx
import { useState, useRef } from 'react';
import { Send, Image as ImageIcon, Smile, Paperclip, X } from 'lucide-react';

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');

  const handleImageSelect = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    setSelectedImage(file);
    setImageCaption(file.name.split('.')[0]);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendImage = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
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
      onSendImage(result.secure_url, imageCaption || selectedImage.name.split('.')[0]);
      
      // Clear image state after successful upload
      handleCancelImage();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleImageSelect(file);
        }
      }
    }
  };

  const handleSend = () => {
    if (selectedImage) {
      handleSendImage();
    } else if (messageText.trim()) {
      onSendText();
    }
  };

  const handleKeyPressWrapper = (e: React.KeyboardEvent) => {
    if (selectedImage) {
      // If image is selected, Enter sends the image
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendImage();
      }
    } else {
      // Otherwise, use the original key press handler
      onKeyPress(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                onClick={handleCancelImage}
                disabled={isUploading}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 mb-1">Image ready to send</p>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Add a caption (optional)"
                disabled={isUploading}
                className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* Attachment button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading || !!selectedImage}
          className="p-2.5 text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload image"
        >
          <Paperclip className="w-5 h-5" />
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
            onKeyPress={handleKeyPressWrapper}
            onPaste={handlePaste}
            placeholder={
              selectedImage 
                ? "Add a caption or press Enter to send image" 
                : disabled 
                  ? "Connecting to chat..." 
                  : "Type your message..."
            }
            disabled={disabled || isUploading}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent resize-none max-h-32 min-h-[44px] disabled:opacity-50"
            rows={1}
          />
          <div className="absolute right-3 bottom-2 flex items-center gap-1">
            {/* Emoji picker placeholder */}
            <button
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Add emoji"
              disabled={isUploading}
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={(!messageText.trim() && !selectedImage) || disabled}
          className="p-3 bg-[#1E3A5F] text-white rounded-xl hover:bg-[#2a4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Upload hint */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>
            {selectedImage 
              ? "Press Enter or click Send to upload image" 
              : "Press Enter to send, Shift+Enter for new line"}
          </span>
        </div>
        {!selectedImage && (
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            Drag & drop or paste images to upload
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageInput;