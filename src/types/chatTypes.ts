
export type ChatMessageType = 'text' | 'image';

export interface ChatMessageContent {
  type: ChatMessageType;
  text?: string;
  url?: string;
  caption?: string;
}

export interface ChatMessage {
  messageId: number;
  chatRoomId: number;
  content: string; // JSON string of ChatMessageContent
  senderId: number;
  senderName: string;
  timestamp: string;
  parsedContent?: ChatMessageContent; // For convenience
}

export interface ChatRoom {
  roomId: number;
  roomName: string;
  type: 'direct' | 'group' | 'event';
  eventTitle?: string;
  participantCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface WebSocketMessage {
  chatRoomId: number;
  content: string;
  senderId: number;
  senderName: string;
  timestamp: string;
  messageId: number;
}