// Footer.tsx
import {  MapPin, 
  Mail, Phone 
} from 'lucide-react';
import LogoName from '../common/logo/LogoName';

const Footer = () => {
  const quickLinks = [
    { name: 'Features', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ];


  return (
     <footer className="bg-white text-gray-800">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and Tagline */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 w-60 mb-4">
              <LogoName className="w-28 h-auto" />
            </div>
            <p className="text-gray-800 font-sans text-sm leading-relaxed mb-6">
              Connecting adventurers with nature's most breathtaking trails. Your next hiking adventure starts here.
            </p>
            
            {/* Social Media Icons */}
            {/* <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div> */}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-sans text-gray-800 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm text-gray-800 font-sans">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-800 flex-shrink-0 mt-0.5" />
                <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-800 flex-shrink-0 mt-0.5" />
                <span>info@hikesathi.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-800 flex-shrink-0 mt-0.5" />
                <span>+977 1-1234567</span>
              </div>
            </div>
          </div>

        
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-800 font-sans text-sm">
              © {new Date().getFullYear()} HikeSathi. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;