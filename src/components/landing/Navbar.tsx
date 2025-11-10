import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();


interface NavItem {
  id: string;
  label: string;
  href: string;
}

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'features', label: 'Features', href: '#features' },
    { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    // Smooth scroll implementation would go here
  };
  const handleLoginButton = () => {
    navigate('/login');
  }
  const handleSignUpButton = () => {
    navigate('/signup');
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2D5016] to-[#1E3A5F] rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span
                className={`text-xl font-bold ${
                  isScrolled ? 'text-[#2D5016]' : 'text-white'
                }`}
              >
                HikeSathi
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-[#2D5016]'
                      : 'text-white hover:text-gray-200'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={handleLoginButton}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors duration-200 ${
                isScrolled
                  ? 'border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-[#2D5016]'
              }`}
            >
              Login
            </button>
            <button onClick={handleSignUpButton}
              className="px-4 py-2 rounded-md text-sm font-medium bg-[#FF6B35] text-white hover:bg-[#E76F51] transition-colors duration-200 shadow-lg"
            >
              Sign Up as Organizer
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-64 opacity-100 py-4'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#2D5016] hover:bg-gray-50 transition-colors duration-200"
                onClick={() => handleNavClick()}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button onClick={handleLoginButton} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#2D5016] hover:bg-gray-50 transition-colors duration-200">
                Login
              </button>
              <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-[#FF6B35] text-white hover:bg-[#E76F51] transition-colors duration-200">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar