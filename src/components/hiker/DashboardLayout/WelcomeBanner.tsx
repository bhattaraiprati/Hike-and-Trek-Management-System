// components/hiker/dashboard/WelcomeBanner.tsx
import { User, Award, TrendingUp } from 'lucide-react';
import type { UserInfo } from '../../../types/HikerTypes';
import { useAuth } from '../../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getProfileUrl } from '../../../api/services/authApi';

interface WelcomeBannerProps {
  userInfo: UserInfo;
}

const WelcomeBanner = ({ userInfo }: WelcomeBannerProps) => {
    
    const {user} = useAuth();
  const getMembershipBadge = (level: string) => {
    const levels = {
      BEGINNER: { color: 'bg-green-100 text-green-800', label: 'Beginner' },
      INTERMEDIATE: { color: 'bg-blue-100 text-blue-800', label: 'Intermediate' },
      ADVANCED: { color: 'bg-purple-100 text-purple-800', label: 'Advanced' },
      EXPERT: { color: 'bg-orange-100 text-orange-800', label: 'Expert' }
    };
    return levels[level as keyof typeof levels] || levels.BEGINNER;
  };

  const membership = getMembershipBadge(userInfo.membershipLevel);

  const {data: profileImageUrl} = useQuery({
    queryKey: ["profileUrl", user?.id],
    queryFn: () => getProfileUrl(Number(user?.id || 0)),
    enabled : !!user?.id
  })

  const displayImage =  profileImageUrl ;
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F] via-[#2a4a7a] to-[#3d5a8f]"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {userInfo.avatar ? (
                <img
                  src={displayImage}
                  alt={userInfo.name}
                  className="w-16 h-16 rounded-full border-4 border-white/20"
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full border-4 border-white/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${membership.color}`}>
                  {membership.label}
                </span>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-white/80">
                Ready for your next adventure? Check out what's happening.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-2 text-white/90 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Overall Day Hike </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {userInfo.streak} days
              </div>
            </div>
            
            <div className="h-12 w-px bg-white/20"></div>
            
            <div className="text-center">
              <div className="flex items-center gap-2 text-white/90 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-sm">Level</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {userInfo.membershipLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Mountain Illustration */}
        <div className="absolute bottom-0 right-8 opacity-20">
          <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 21H1l8-9.46V6.73a1 1 0 012 0v4.81L23 21z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;