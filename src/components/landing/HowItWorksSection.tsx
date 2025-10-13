// components/sections/HowItWorks/HowItWorksSection.tsx
import React from 'react';


const HowItWorksSection: React.FC = () => {

    const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up and tell us your hiking preferences, experience level, and favorite trail types.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      number: 2,
      title: "Find Your Perfect Hike",
      description: "Browse curated events or chat with our AI assistant to discover matching trails.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Join & Explore",
      description: "Register for your adventure and hit the trails with your hiking community.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="min-h-screen flex items-center justify-center py-8 bg-gradient-to-br from-white via-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B4332] mb-3">
            Your Adventure Starts in <span className="text-[#E76F51]">3 Simple Steps</span>
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
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-4/5 top-10 bg-gradient-to-b from-[#1B4332] via-[#2C5F8D] to-[#E76F51] rounded-full"></div>
              
              {/* Steps */}
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className={`flex items-center justify-center ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {/* Step Content */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-green-100 hover:border-[#E76F51]/20">
                        {/* Step Header */}
                        <div className="flex items-start mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#E76F51] flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                            {step.number}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-xl font-semibold text-[#1B4332]">
                              {step.title}
                            </h3>
                          </div>
                        </div>
                        
                        {/* Icon and Description */}
                        <div className="flex items-start space-x-3">
                          <div className="text-[#2C5F8D] mt-1 flex-shrink-0">
                            {step.icon}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="relative z-10 w-4 h-4 rounded-full bg-[#1B4332] border-2 border-white shadow-md flex-shrink-0"></div>
                    
                    {/* Empty Space */}
                    <div className="w-5/12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tablet Timeline */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-1 gap-6">
              {steps.map((step) => (
                <div key={step.number} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-green-100 hover:border-[#E76F51]/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[#E76F51] flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="text-[#2C5F8D] mr-3">
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-[#1B4332]">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-4">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                {/* Step Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-green-100">
                  {/* Step Header */}
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#E76F51] flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 mr-3">
                      {step.number}
                    </div>
                    <div className="text-[#2C5F8D] mr-3">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-[#1B4332]">
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
                  <div className="absolute left-6 top-full w-0.5 h-4 bg-gradient-to-b from-[#1B4332] to-[#2C5F8D] transform translate-y-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-[#E76F51] to-[#FF6B35] text-white px-8 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Start Your Adventure
          </button>
          <p className="text-gray-500 text-sm mt-3">
            Join thousands of hikers exploring nature's wonders
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;