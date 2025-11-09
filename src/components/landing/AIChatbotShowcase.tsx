// AIChatbotShowcase.tsx
import React, { useState } from 'react';

const AIChatbotShowcase: React.FC = () => {
  const [activeExample, setActiveExample] = useState(0);

  const chatExamples = [
    {
      user: "I want to hike in the jungle this season with a view of Kathmandu Valley",
      bot: "Perfect! Based on your preferences, I recommend:\n\n• **Shivapuri Nagarjun National Park** - Lush jungle trails with panoramic valley views\n• **Champadevi Hill** - Moderate jungle hike with breathtaking valley overlooks\n• **Nagarkot Nature Trail** - Jungle paths leading to famous viewpoint\n\nAll are accessible this season with 2-4 hour durations."
    },
    {
      user: "Find easy hikes for beginners near me",
      bot: "Great choice for starting out! Here are beginner-friendly options:\n\n• **Garden of Dreams Loop** - Flat, paved paths in the city\n• **Phulchowki Hill** - Gentle slopes with amazing flora\n• **Godavari Botanical Garden** - Well-maintained walking trails\n\nAll under 2 hours with minimal elevation gain."
    },
    {
      user: "Recommend challenging trails with waterfalls",
      bot: "Adventure time! For challenging waterfall hikes:\n\n• **Bhotekoshi River Trail** - Steep terrain with multiple waterfalls\n• **Sundarijal to Chisapani** - Difficult climb with scenic falls\n• **Helambu Circuit** - Multi-day trek with waterfall crossings\n\nProper gear and experience recommended."
    }
  ];

  const features = [
    "24/7 Trail Recommendations",
    "Weather & Condition Updates",
    "Personalized Difficulty Matching",
    "Local Guide Connections"
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-8 bg-gradient-to-br from-white via-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            {/* <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#1B4332]/10 border border-[#1B4332]/20 mb-4">
              <span className="w-2 h-2 bg-[#E76F51] rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-semibold text-[#1B4332]">Powered by AI</span>
            </div> */}
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B4332] mb-4">
              Meet Your Personal <span className="text-[#2C5F8D]">Hiking Assistant</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant, personalized trail recommendations and expert guidance for your next adventure
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Chat Demo Section */}
            <div className="space-y-6">
              {/* Chat Container */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-[#1B4332] to-[#2C5F8D] p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">TrailBot AI</h3>
                      <p className="text-white/80 text-sm">Online • Always ready to help</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-[#2C5F8D] text-white rounded-2xl rounded-br-none px-4 py-3 max-w-xs md:max-w-md">
                      <p className="text-sm">{chatExamples[activeExample].user}</p>
                    </div>
                  </div>

                  {/* Bot Message */}
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 max-w-xs md:max-w-md">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-[#1B4332] to-[#2C5F8D] rounded-full flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-[#1B4332]">TrailBot AI</span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-line">
                        {chatExamples[activeExample].bot}
                      </p>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  {/* <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Chat Input */}
                {/* <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Ask about trails, weather, or gear..."
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5F8D] focus:border-transparent"
                    />
                    <button className="bg-[#E76F51] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div> */}
              </div>

              {/* Example Selector */}
              <div className="flex flex-wrap gap-2 justify-center">
                {chatExamples.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveExample(index)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeExample === index
                        ? 'bg-[#E76F51] text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Example {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-[#1B4332] mb-4">
                  Your Smart Hiking Companion
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI assistant understands your preferences, experience level, and current conditions to provide perfect trail recommendations every time.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-white/80 rounded-xl border border-gray-200 hover:border-[#2C5F8D]/30 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#1B4332] to-[#2C5F8D] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-[#1B4332] to-[#2C5F8D] rounded-2xl p-6 text-white text-center">
                <h4 className="text-xl font-bold mb-2">Ready to Explore?</h4>
                <p className="text-white/80 mb-4 text-sm">
                  Start a conversation with TrailBot AI and discover your next adventure
                </p>
                <button className="bg-white text-[#1B4332] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Chat Now - It's Free!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChatbotShowcase;