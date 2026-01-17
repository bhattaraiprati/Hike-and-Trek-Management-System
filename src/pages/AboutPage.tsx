// AboutPage.tsx
import { Target,  Heart,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/10 via-[#2C5F8D]/5 to-transparent" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Mission is to{' '}
              <span className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] bg-clip-text text-transparent">
                Connect Adventurers
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              HikeSathi was born from a simple idea: to make hiking accessible, safe, and 
              enjoyable for everyone. We're building a community where nature lovers can 
              discover, connect, and explore together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Join Our Community
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#1E3A5F] text-[#1E3A5F] font-semibold rounded-lg hover:bg-[#1E3A5F]/5 transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Our <span className="text-[#1E3A5F]">Story</span>
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p className="text-lg">
                    Founded in 2025 by a group of passionate hikker in Nepal, HikeSathi emerged 
                    from our own experiences of struggling to find reliable hiking partners and 
                    organized events.
                  </p>
                  <p>
                    We noticed that many adventure seekers missed out on incredible experiences 
                    simply because they didn't have the right information or companions. At the 
                    same time, experienced guides and organizers struggled to reach potential 
                    participants.
                  </p>
                  <p>
                    HikeSathi was created to bridge this gap. Today, we're proud to be Nepal's 
                    leading platform connecting trekkers with trusted organizers, and building 
                    a community of nature enthusiasts.
                  </p>
                </div>
                
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#1E3A5F]">500+</div>
                    <div className="text-sm text-gray-600">Trails Listed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#2C5F8D]">10K+</div>
                    <div className="text-sm text-gray-600">Community Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#1E3A5F]">200+</div>
                    <div className="text-sm text-gray-600">Verified Organizers</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2C5F8D] rounded-2xl p-8 text-white">
                  <div className="mb-6">
                    <Target className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                    <p className="mt-2 opacity-90">
                      To become the world's most trusted platform for outdoor adventures, 
                      making nature exploration accessible to everyone.
                    </p>
                  </div>
                  
                  <div>
                    <Heart className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold">Our Values</h3>
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span>Community First</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span>Sustainable Tourism</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span>Safety & Responsibility</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default AboutPage;