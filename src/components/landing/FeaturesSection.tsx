
const FeaturesSection = () => {

interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: 'hikers' | 'organizers' | 'trust';
}

interface FeatureCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: FeatureCard[];
  color: string;
}
type IconComponent = React.ReactElement;

  const featureCategories: FeatureCategory[] = [
    {
      id: 'hikers',
      title: 'For Hikers',
      description: 'Everything you need to discover and join amazing hiking adventures',
      icon: 'compass',
      color: 'from-green-500 to-green-600',
      features: [
        {
          id: 'discover-events',
          icon: 'map',
          title: 'Discover Events',
          description: 'Browse and filter hiking events by difficulty, location, and scenery with intuitive search tools',
          category: 'hikers'
        },
        {
          id: 'ai-recommendations',
          icon: 'sparkles',
          title: 'AI Recommendations',
          description: 'Get personalized trail suggestions through our smart chatbot based on your preferences and experience',
          category: 'hikers'
        },
        {
          id: 'easy-registration',
          icon: 'check-circle',
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
      icon: 'calendar',
      color: 'from-blue-500 to-blue-600',
      features: [
        {
          id: 'create-events',
          icon: 'plus-circle',
          title: 'Create Events',
          description: 'Post and manage your hiking events effortlessly with our intuitive event creation wizard',
          category: 'organizers'
        },
        {
          id: 'manage-participants',
          icon: 'users',
          title: 'Manage Participants',
          description: 'Track registrations, send updates, and communicate with your group all in one place',
          category: 'organizers'
        },
        {
          id: 'analytics-dashboard',
          icon: 'chart-bar',
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
      icon: 'shield',
      color: 'from-orange-500 to-orange-600',
      features: [
        {
          id: 'verified-organizers',
          icon: 'badge-check',
          title: 'Verified Organizers',
          description: 'All event hosts are thoroughly reviewed and approved to ensure quality and reliability',
          category: 'trust'
        },
        {
          id: 'transparent-reviews',
          icon: 'star',
          title: 'Transparent Reviews',
          description: 'Read real feedback and ratings from the community to make informed decisions',
          category: 'trust'
        },
        {
          id: 'secure-platform',
          icon: 'lock-closed',
          title: 'Secure Platform',
          description: 'Your personal data and payments are protected with enterprise-grade security measures',
          category: 'trust'
        }
      ]
    }
  ];

 const getIconComponent = (iconName: string, className: string = "w-6 h-6"): IconComponent => {
  const icons: Record<string, IconComponent> = {
    compass: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm4-12l-4 2-2 4-2-4 4-2z" />
      </svg>
    ),
    map: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    sparkles: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    'check-circle': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    calendar: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    'plus-circle': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    users: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    'chart-bar': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    shield: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    'badge-check': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    star: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    'lock-closed': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  };

    return icons[iconName] || icons.compass;
};

  return (
    <section id="features" className="py-20  bg-gradient-to-br from-white via-green-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for Your{' '}
            <span className="bg-gradient-to-r from-[#2D5016] to-[#1E3A5F] bg-clip-text text-transparent">
              Hiking Journey
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            From discovering epic trails to organizing unforgettable adventures, 
            we provide all the tools you need for an amazing outdoor experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featureCategories.map((category) => (
            <div
              key={category.id}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
            >
              {/* Header Gradient */}
              <div className={`bg-gradient-to-r ${category.color} p-8 text-white`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    {getIconComponent(category.icon, "w-8 h-8")}
                  </div>
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                </div>
                <p className="text-white/90 text-lg leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Features List */}
              <div className="p-8 space-y-6">
                {category.features.map((feature) => (
                  <div
                    key={feature.id}
                    className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-r ${category.color} text-white transform group-hover:scale-110 transition-transform duration-300`}>
                      {getIconComponent(feature.icon, "w-6 h-6")}
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
                ))}
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#2D5016] to-[#1E3A5F] rounded-3xl p-12 text-white max-w-4xl mx-auto shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of hikers and organizers who are already exploring the great outdoors together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-[#FF6B35] text-white font-semibold rounded-2xl hover:bg-[#E76F51] transition-all duration-300 transform hover:scale-105 shadow-lg">
                Explore Hiking Events
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300">
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