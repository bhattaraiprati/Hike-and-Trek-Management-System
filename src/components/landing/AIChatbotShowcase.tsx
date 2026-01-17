// AIChatbotShowcase.tsx
import { useState } from 'react';
import { 
  MessageSquare, Bot, Zap,
  Cloud
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIChatbotShowcase = () => {
  const [activeExample, setActiveExample] = useState(0);
  const navigate = useNavigate();

  const chatExamples = [
    {
      user: "I want to trek in the jungle this season with a view of Kathmandu Valley",
      bot: "Perfect! Based on your preferences, I recommend:\n\n• **Shivapuri Nagarjun National Park** - Lush jungle trails with panoramic valley views\n• **Champadevi Hill** - Moderate jungle trek with breathtaking valley overlooks\n• **Nagarkot Nature Trail** - Jungle paths leading to famous viewpoint\n\nAll are accessible this season with 2-4 hour durations."
    },
    {
      user: "Find easy treks for beginners near me",
      bot: "Great choice for starting out! Here are beginner-friendly options:\n\n• **Garden of Dreams Loop** - Flat, paved paths in the city\n• **Phulchowki Hill** - Gentle slopes with amazing flora\n• **Godavari Botanical Garden** - Well-maintained walking trails\n\nAll under 2 hours with minimal elevation gain."
    },
    {
      user: "Recommend challenging trails with waterfalls",
      bot: "Adventure time! For challenging waterfall treks:\n\n• **Bhotekoshi River Trail** - Steep terrain with multiple waterfalls\n• **Sundarijal to Chisapani** - Difficult climb with scenic falls\n• **Helambu Circuit** - Multi-day trek with waterfall crossings\n\nProper gear and experience recommended."
    }
  ];

  const features = [
    { icon: Zap, text: "24/7 Trail Recommendations" },
    { icon: Cloud, text: "Event Recommendation" },
    // { icon: Users, text: "Personalized Difficulty Matching" },
    // { icon: Shield, text: "Local Guide Connections" }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-8 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
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
                <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">TrekBot AI</h3>
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
                        <div className="w-6 h-6 bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] rounded-full flex items-center justify-center mr-2">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-[#1E3A5F]">TrekBot AI</span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-line">
                        {chatExamples[activeExample].bot}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Example Selector */}
              <div className="flex flex-wrap gap-2 justify-center">
                {chatExamples.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveExample(index)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeExample === index
                        ? 'bg-[#1E3A5F] text-white shadow-md'
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
                <h3 className="text-2xl font-bold text-[#1E3A5F] mb-4">
                  Your Smart Hiking Companion
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI assistant understands your preferences, experience level, and current conditions to provide perfect trail recommendations every time.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-white/80 rounded-xl border border-gray-200 hover:border-[#2C5F8D]/30 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] rounded-2xl p-6 text-white text-center">
                <h4 className="text-xl font-bold mb-2">Ready to Explore?</h4>
                <p className="text-white/80 mb-4 text-sm">
                  Start a conversation with TrekBot AI and discover your next adventure
                </p>
                <button onClick={()=> navigate("/login")} className="bg-white text-[#1E3A5F] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat Now 
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