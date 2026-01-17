// components/common/AIChatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Send, Bot, User, Calendar, 
  MapPin, Users, DollarSign, ChevronRight,
  Sparkles, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ChatConfig, ChatMessage } from '../../../types/ChatbotTypes';


interface AIChatbotProps {
  config?: Partial<ChatConfig>;
}

const AIChatbot = ({ config }: AIChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const defaultConfig: ChatConfig = {
    welcomeMessage: "Hello! I'm your Trek Assistant. 🏔️ I can help you find hiking events, provide information about treks, answer your questions, and assist with bookings. How can I help you today?",
    placeholder: "Ask about hiking events, difficulty levels, pricing, or anything else...",
    suggestedQuestions: [
      "What hiking events are available this month?",
      "Show me moderate difficulty treks",
      "What should I pack for a day hike?",
      "Tell me about the Everest Base Camp trek"
    ]
  };

  const chatConfig = { ...defaultConfig, ...config };

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        sender: 'ai',
        content: chatConfig.welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
      case 'DIFFICULT': return 'bg-orange-100 text-orange-800';
      case 'EXTREME': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const handleEventClick = (eventId: number) => {
    navigate(`/hiker-dashboard/event/${eventId}`);
    setIsOpen(false);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // API call to AI backend
      const response = await fetch('http://localhost:8080/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ question: inputText.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: data.message,
        timestamp: new Date(),
        events: data.events || [],
        type: data.type === 'TEXT_WITH_EVENTS' ? 'text_with_events' : 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: "I'm having trouble connecting to the server. Please try again in a moment or contact support if the issue persists.",
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      sender: 'ai',
      content: chatConfig.welcomeMessage,
      timestamp: new Date()
    }]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-[#1E3A5F] to-[#2a4a7a] rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Open AI Chat Assistant"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px]">
            <div className="bg-white rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2a4a7a] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-lg">Trek AI Assistant</h2>
                      <p className="text-white/80 text-sm">Ask me anything about hiking!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearChat}
                      className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                      title="Clear chat"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {/* User Message */}
                      {message.sender === 'user' ? (
                        <div className="flex justify-end">
                          <div className="max-w-[80%]">
                            <div className="flex items-center gap-2 mb-1 justify-end">
                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl rounded-tr-none px-4 py-3">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* AI Message */
                        <div className="flex">
                          <div className="max-w-[80%]">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Bot className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            
                            {/* Text Content */}
                            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                              <div className="text-gray-700 whitespace-pre-wrap">
                                {message.content}
                              </div>
                            </div>

                            {/* Events Cards */}
                            {message.events && message.events.length > 0 && (
                              <div className="mt-3 space-y-3">
                                <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-purple-500" />
                                  Found {message.events.length} matching event{message.events.length !== 1 ? 's' : ''}:
                                </div>
                                
                                {message.events.map((event) => (
                                  <div
                                    key={event.id}
                                    onClick={() => handleEventClick(event.id)}
                                    className="border border-gray-200 rounded-xl p-4 hover:border-[#1E3A5F] hover:shadow-md transition-all cursor-pointer group"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                          src={event.bannerImageUrl}
                                          alt={event.title}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                      </div>
                                      
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 group-hover:text-[#1E3A5F] line-clamp-1">
                                          {event.title}
                                        </h4>
                                        
                                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                                          <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(event.date)}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {event.location}
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 mt-2">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(event.difficulty)}`}>
                                            {event.difficulty}
                                          </span>
                                          <div className="flex items-center gap-1 text-sm">
                                            <DollarSign className="w-3 h-3 text-green-600" />
                                            <span className="font-medium">{formatPrice(event.price)}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-sm">
                                            <Users className="w-3 h-3 text-blue-600" />
                                            <span>{event.maxParticipants} max</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1E3A5F] flex-shrink-0 mt-1" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Error State */}
                            {message.type === 'error' && (
                              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">
                                  <span className="font-medium">Connection Error:</span> {message.content}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-gray-500 text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggested Questions */}
                  {messages.length === 1 && !isLoading && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-3">Try asking:</p>
                      <div className="space-y-2">
                        {chatConfig.suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestedQuestion(question)}
                            className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-[#1E3A5F] hover:shadow-sm transition-all text-sm text-gray-700"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={chatConfig.placeholder}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className="px-4 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#2a4a7a] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 text-center">
                  AI assistant can help with event info, bookings, and hiking advice
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AIChatbot;