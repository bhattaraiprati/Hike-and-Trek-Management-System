// Navbar.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X  } from 'lucide-react';
import LogoName from '../common/logo/LogoName';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(100);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'features', label: 'Features', href: '#features' },
    { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 50);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLoginButton = () => {
    navigate('/login');
  };

  const handleSignUpButton = () => {
    navigate('/signup');
  };

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
          <div onClick={() => navigate('/')} className='h-37 w-36'>
            <LogoName className="w-22 h-auto cursor-pointer"  />
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
                      ? 'text-gray-700 hover:text-[#1E3A5F]'
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
            <button
              onClick={handleLoginButton}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors duration-200 ${
                isScrolled
                  ? 'border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-[#1E3A5F]'
              }`}
            >
              Login
            </button>
            <button
              onClick={handleSignUpButton}
              className="px-4 py-2 rounded-md text-sm font-medium bg-[#1E3A5F] text-white hover:bg-[#2C5F8D] transition-colors duration-200 shadow-lg"
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
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
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
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#1E3A5F] hover:bg-gray-50 transition-colors duration-200"
                onClick={() => handleNavClick()}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button onClick={handleLoginButton} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#1E3A5F] hover:bg-gray-50 transition-colors duration-200">
                Login
              </button>
              <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-[#1E3A5F] text-white hover:bg-[#2C5F8D] transition-colors duration-200">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;