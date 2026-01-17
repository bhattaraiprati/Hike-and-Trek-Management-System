// HowItWorksSection.tsx
import { User, Search, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorksSection = () => {
  const navigate = useNavigate();
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up and tell us your hiking preferences, experience level, and favorite trail types.",
      icon: User
    },
    {
      number: 2,
      title: "Find Your Perfect Trek",
      description: "Browse curated events or chat with our AI assistant to discover matching trails.",
      icon: Search
    },
    {
      number: 3,
      title: "Join & Explore",
      description: "Register for your adventure and hit the trails with your hiking community.",
      icon: Zap
    }
  ];

  return (
    <section id="how-it-works" className="min-h-screen flex items-center justify-center py-8 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-3">
            Your Adventure Starts in <span className="text-[#2C5F8D]">3 Simple Steps</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get ready to explore breathtaking trails with fellow nature enthusiasts
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="max-w-4xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-4/5 top-10 bg-gradient-to-b from-[#1E3A5F] via-[#2C5F8D] to-[#3A7CB8] rounded-full"></div>
              
              {/* Steps */}
              <div className="space-y-8">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div
                      key={step.number}
                      className={`flex items-center justify-center ${
                        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      {/* Step Content */}
                      <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#2C5F8D]/20">
                          {/* Step Header */}
                          <div className="flex items-start mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                              {step.number}
                            </div>
                            <div className="ml-3">
                              <h3 className="text-xl font-semibold text-[#1E3A5F]">
                                {step.title}
                              </h3>
                            </div>
                          </div>
                          
                          {/* Icon and Description */}
                          <div className="flex items-start space-x-3">
                            <div className="text-[#2C5F8D] mt-1 flex-shrink-0">
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Timeline Dot */}
                      <div className="relative z-10 w-4 h-4 rounded-full bg-[#1E3A5F] border-2 border-white shadow-md flex-shrink-0"></div>
                      
                      {/* Empty Space */}
                      <div className="w-5/12"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tablet Timeline */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-1 gap-6">
              {steps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.number} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#2C5F8D]/20">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="text-[#2C5F8D] mr-3">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl font-semibold text-[#1E3A5F]">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-4">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number} className="relative">
                  {/* Step Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-100">
                    {/* Step Header */}
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 mr-3">
                        {step.number}
                      </div>
                      <div className="text-[#2C5F8D] mr-3">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#1E3A5F]">
                        {step.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm pl-13">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Connecting Line (except last) */}
                  {step.number < 3 && (
                    <div className="absolute left-6 top-full w-0.5 h-4 bg-gradient-to-b from-[#1E3A5F] to-[#2C5F8D] transform translate-y-1"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button onClick={()=> navigate("/login")} className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] text-white px-8 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Start Your Adventure
          </button>
          <p className="text-gray-500 text-sm mt-3">
            Join thousands of trekkers exploring nature's wonders
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;