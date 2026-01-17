// FeaturesSection.tsx
import { 
  Compass, Map, Sparkles, CheckCircle, 
  Calendar, PlusCircle, Users, BarChart3, 
  Shield, BadgeCheck, Star, Lock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection = () => {
  const navigate = useNavigate();
  const featureCategories = [
    {
      id: 'hikers',
      title: 'For Hikers',
      description: 'Everything you need to discover and join amazing hiking adventures',
      icon: Compass,
      color: 'from-[#1E3A5F] to-[#2C5F8D]',
      features: [
        {
          id: 'discover-events',
          icon: Map,
          title: 'Discover Events',
          description: 'Browse and filter hiking events by difficulty, location, and scenery with intuitive search tools',
          category: 'hikers'
        },
        {
          id: 'ai-recommendations',
          icon: Sparkles,
          title: 'AI Recommendations',
          description: 'Get personalized trail suggestions through our smart chatbot based on your preferences and experience',
          category: 'hikers'
        },
        {
          id: 'easy-registration',
          icon: CheckCircle,
          title: 'Easy Registration',
          description: 'Book your spot with secure online registration and instant confirmation for peace of mind',
          category: 'hikers'
        }
      ]
    },
    {
      id: 'organizers',
      title: 'For Organizers',
      description: 'Powerful tools to create and manage successful hiking events',
      icon: Calendar,
      color: 'from-[#2C5F8D] to-[#3A7CB8]',
      features: [
        {
          id: 'create-events',
          icon: PlusCircle,
          title: 'Create Events',
          description: 'Post and manage your hiking events effortlessly with our intuitive event creation wizard',
          category: 'organizers'
        },
        {
          id: 'manage-participants',
          icon: Users,
          title: 'Manage Participants',
          description: 'Track registrations, send updates, and communicate with your group all in one place',
          category: 'organizers'
        },
        {
          id: 'analytics-dashboard',
          icon: BarChart3,
          title: 'Analytics Dashboard',
          description: 'Monitor attendance, engagement metrics, and event performance with detailed insights',
          category: 'organizers'
        }
      ]
    },
    {
      id: 'trust',
      title: 'Trust & Safety',
      description: 'Your security and peace of mind are our top priorities',
      icon: Shield,
      color: 'from-[#1E3A5F] to-[#2C5F8D]',
      features: [
        {
          id: 'verified-organizers',
          icon: BadgeCheck,
          title: 'Verified Organizers',
          description: 'All event hosts are thoroughly reviewed and approved to ensure quality and reliability',
          category: 'trust'
        },
        {
          id: 'transparent-reviews',
          icon: Star,
          title: 'Transparent Reviews',
          description: 'Read real feedback and ratings from the community to make informed decisions',
          category: 'trust'
        },
        {
          id: 'secure-platform',
          icon: Lock,
          title: 'Secure Platform',
          description: 'Your personal data and payments are protected with enterprise-grade security measures',
          category: 'trust'
        }
      ]
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for Your{' '}
            <span className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] bg-clip-text text-transparent">
              hiking Journey
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            From discovering epic trails to organizing unforgettable adventures, 
            we provide all the tools you need for an amazing outdoor experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featureCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200"
              >
                {/* Header Gradient */}
                <div className={`bg-gradient-to-r ${category.color} p-8 text-white`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">{category.title}</h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="p-8 space-y-6">
                  {category.features.map((feature) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div
                        key={feature.id}
                        className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                      >
                        <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-r ${category.color} text-white transform group-hover:scale-110 transition-transform duration-300`}>
                          <FeatureIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {feature.title}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5F8D] rounded-3xl p-12 text-white max-w-4xl mx-auto shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of hikkers and organizers who are already exploring the great outdoors together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/login')} className="px-8 py-4 bg-white text-[#1E3A5F] font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Explore Hiking Events
              </button>
              <button onClick={() => navigate('/signup')} className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300">
                Become an Organizer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;