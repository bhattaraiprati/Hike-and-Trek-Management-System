import { useState, useEffect } from 'react';
import { Sparkles, Search, Calendar, Users, ChevronRight, Plus, MapPin, Mountain, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as publicStatsApi from '../../api/services/publicStatsApi';
import type { PlatformStatsDTO } from '../../types/publicStatsTypes';

const HeroSection = () => {
  const [stats, setStats] = useState<PlatformStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const searchSuggestions = [
    { id: '1', text: 'Everest Base Camp Trek', type: 'trail' },
    { id: '2', text: 'Annapurna Circuit', type: 'trail' },
    { id: '3', text: 'Langtang Valley Trek', type: 'trail' },
    { id: '4', text: 'Weekend Hiking Group', type: 'event' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await publicStatsApi.getPlatformStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch hero stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    fetchStats();
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStartExploring = () => {
    navigate('/login');
  };

  const handleOrganizeEvents = () => {
    navigate('/signup');
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#2C5F8D] to-[#3A7CB8]">
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
          className="absolute bottom-0 left-0 right-0 h-64"
          style={{
            transform: `translateX(${(mousePosition.x - 50) * 0.02}px)`,
          }}
        >
          <div className="absolute bottom-0 w-full h-32">
            {/* Mountain peaks using gradient instead of solid color */}
            <div className="absolute bottom-0 left-0 w-48 h-24 bg-gradient-to-t from-[#1E3A5F] to-transparent clip-path-polygon-[50%_0%,_0%_100%,_100%_100%]"></div>
            <div className="absolute bottom-0 left-40 w-32 h-20 bg-gradient-to-t from-[#1E3A5F] to-transparent clip-path-polygon-[50%_0%,_0%_100%,_100%_100%]"></div>
            <div className="absolute bottom-0 right-40 w-40 h-28 bg-gradient-to-t from-[#1E3A5F] to-transparent clip-path-polygon-[50%_0%,_0%_100%,_100%_100%]"></div>
            <div className="absolute bottom-0 right-0 w-36 h-22 bg-gradient-to-t from-[#1E3A5F] to-transparent clip-path-polygon-[50%_0%,_0%_100%,_100%_100%]"></div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E3A5F]/30 to-[#1E3A5F]/60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="text-center mt-24 max-w-6xl w-full">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Your Next
            <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with hiking communities, discover epic trails, and manage your outdoor events—all in one place
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleStartExploring}
              className="group px-10 py-5 bg-white text-[#1E3A5F] text-lg font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center space-x-3"
            >
              <span>Start Exploring</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button
              onClick={handleOrganizeEvents}
              className="group px-10 py-5 bg-transparent text-white text-lg font-semibold rounded-2xl border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center space-x-3"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Organize Events</span>
            </button>
          </div>

          {/* Stats Preview */}
          <div className="mt-16 grid grid-cols-1 mb-10 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {loading ? (
              <div className="col-span-3 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white/50" />
              </div>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {stats?.totalTrails.toLocaleString() || "500"}+
                  </div>
                  <div className="text-gray-300 flex items-center justify-center gap-1">
                    <Mountain className="w-4 h-4" />
                    Trails Listed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {stats?.communityMembers.toLocaleString() || "10K"}+
                  </div>
                  <div className="text-gray-300 flex items-center justify-center gap-1">
                    <Users className="w-4 h-4" />
                    Community Members
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {stats?.verifiedOrganizers.toLocaleString() || "200"}+
                  </div>
                  <div className="text-gray-300 flex items-center justify-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Verified Organizers
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;