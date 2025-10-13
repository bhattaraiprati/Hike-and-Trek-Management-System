
// components/sections/Hero/HeroSection.tsx
import React, { useState, useEffect } from 'react';

const HeroSection = () => {

  interface SearchSuggestion {
  id: string;
  text: string;
  type: 'trail' | 'location' | 'event';
}

// interface HeroProps {
//   onSearch?: (query: string) => void;
//   onExplore?: () => void;
//   onOrganize?: () => void;
// }

const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const searchSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'Annapurna Base Camp Trek', type: 'trail' },
    { id: '2', text: 'Rocky Mountain National Park', type: 'location' },
    { id: '3', text: 'Weekend Hiking Group', type: 'event' },
    { id: '4', text: 'Pacific Crest Trail', type: 'trail' },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStartExploring = () => {
    console.log('Start Exploring clicked');
    // Navigate to trails page or open search modal
  };

  const handleOrganizeEvents = () => {
    console.log('Organize Events clicked');
    // Navigate to event creation page
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search for:', searchQuery);
      // Implement search functionality
    }
  };
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D5016] to-[#1E3A5F]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Clouds */}
        <div className="absolute top-20 left-10 animate-float-slow">
          <div className="w-24 h-8 bg-white/20 rounded-full blur-sm"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float-medium">
          <div className="w-16 h-6 bg-white/15 rounded-full blur-sm"></div>
        </div>
        <div className="absolute bottom-60 left-1/4 animate-float-fast">
          <div className="w-20 h-7 bg-white/25 rounded-full blur-sm"></div>
        </div>

        {/* Mountain Silhouettes with Parallax */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#1A1A2E] to-transparent"
          style={{
            transform: `translateX(${(mousePosition.x - 50) * 0.02}px)`,
          }}
        >
          {/* Mountain Peaks */}
          <div className="absolute bottom-0 w-full h-32">
            <div className="absolute bottom-0 left-0 w-48 h-24 bg-[#1A1A2E] clip-path-polygon-[50%_0%,_0%_100%,_100%_100%]"></div>
            <div className="absolute bottom-0 left-40 w-32 h-20 bg-[#1A1A2E] clip-path-polygon-[50%_0%,_0%_100%,_100%_100%]"></div>
            <div className="absolute bottom-0 right-40 w-40 h-28 bg-[#1A1A2E] clip-path-polygon-[50%_0%,_0%_100%,_100%_100%]"></div>
            <div className="absolute bottom-0 right-0 w-36 h-22 bg-[#1A1A2E] clip-path-polygon-[50%_0%,_0%_100%,_100%_100%]"></div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B4332]/30 to-[#1B4332]/60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="text-center mt-24 max-w-6xl w-full">
          {/* Headline */}
          <h1 className="text-5xl md:text-4xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Your Next
            <span className="block bg-gradient-to-r from-[#FF6B35] to-[#E76F51] bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-xl lg:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with hiking communities, discover epic trails, and manage your outdoor events-all in one place
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Where do you want to hike?"
                  className="w-full px-6 py-5 pl-16 text-lg bg-white/95 backdrop-blur-md rounded-2xl border-2 border-white/20 focus:border-[#FF6B35] focus:outline-none focus:ring-4 ring-[#FF6B35]/20 transition-all duration-300 placeholder-gray-500 shadow-2xl"
                />
                
                {/* AI Sparkle Icon */}
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                  <div className="relative">
                    <svg
                      className="w-6 h-6 text-[#FF6B35] animate-pulse"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.8 18.4L14 10.67V4.33L15.5 3.33C15.67 3.22 15.78 3 15.78 2.78C15.78 2.56 15.67 2.33 15.5 2.22L12.5 0.22C12.33 0.11 12.11 0.11 11.94 0.22L8.94 2.22C8.78 2.33 8.67 2.56 8.67 2.78C8.67 3 8.78 3.22 8.94 3.33L10.44 4.33V10.67L4.64 18.4C4.44 18.67 4.44 19 4.64 19.22L5.94 20.78C6.14 21 6.44 21 6.64 20.78L12 14.67L17.36 20.78C17.56 21 17.86 21 18.06 20.78L19.36 19.22C19.56 19 19.56 18.67 19.36 18.4H19.8Z" />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-[#FF6B35] text-white rounded-xl font-semibold hover:bg-[#E76F51] transition-colors duration-200 shadow-lg"
                >
                  Search
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-20">
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      className="w-full px-6 py-4 text-left hover:bg-white/50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                      onMouseDown={() => setSearchQuery(suggestion.text)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          suggestion.type === 'trail' ? 'bg-green-500' :
                          suggestion.type === 'location' ? 'bg-blue-500' :
                          'bg-orange-500'
                        }`}></div>
                        <span className="text-gray-700">{suggestion.text}</span>
                        <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                          {suggestion.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleStartExploring}
              className="group px-10 py-5 bg-[#FF6B35] text-white text-lg font-semibold rounded-2xl hover:bg-[#E76F51] transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center space-x-3"
            >
              <span>Start Exploring</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>

            <button
              onClick={handleOrganizeEvents}
              className="group px-10 py-5 bg-transparent text-white text-lg font-semibold rounded-2xl border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center space-x-3"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Organize Events</span>
            </button>
          </div>

          {/* Stats Preview */}
          <div className="mt-16 grid grid-cols-1 mb-10 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300">Trails Discovered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-300">Adventure Seekers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">200+</div>
              <div className="text-gray-300">Events Organized</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div> */}
    </section>
  )
}

export default HeroSection