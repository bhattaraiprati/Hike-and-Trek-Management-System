// types/chatbotTypes.ts
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  events?: EventCard[];
  type?: 'text' | 'text_with_events' | 'error';
}

export interface EventCard {
  id: number;
  title: string;
  location: string;
  date: string;
  durationDays: number;
  price: number;
  difficulty: 'EASY' | 'MODERATE' | 'DIFFICULT' | 'EXTREME';
  organizer: string;
  bannerImageUrl: string;
  maxParticipants: number;
  status: string;
}

export interface AIResponse {
  message: string;
  events: EventCard[];
  type: 'TEXT' | 'TEXT_WITH_EVENTS' | 'ERROR';
}

export interface ChatConfig {
  welcomeMessage: string;
  placeholder: string;
  suggestedQuestions: string[];
}