
import { Facebook, Instagram, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Custom Pinterest icon since it's not available in lucide-react
const PinterestIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pinterest h-4 w-4">
      <path d="M9 22c-.4-.7-.9-1.6-.9-3.2 0-1.3.9-2.6 2.5-2.6 1.2 0 2.1.7 2.1 1.9 0 1.2-.7 3-1.5 4.2"></path>
      <path d="M9.5 9.3c0 .5.1 1 .4 1.5l1.5 6.4"></path>
      <path d="M9.9 5.1a8 8 0 1 1-3 15.9 8 8 0 0 0 6.1-2"></path>
      <path d="M12 2a10 10 0 0 0-7.1 17"></path>
    </svg>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container-custom py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 px-4 md:px-0">
          {/* Brand and Description */}
          <div className="space-y-3">
            <h2 className="font-bold">SISTER STORAGE</h2>
            <p className="text-gray-400 max-w-xs">
              Culture without clutter. Storage designed for us, by us – bringing organization and elegance to your cultural treasures.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-[#E6007E] transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#E6007E] transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#E6007E] transition-colors" aria-label="Follow us on Pinterest">
                <PinterestIcon />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-[#E6007E]">Quick Links</h3>
            <ul className="space-y-1.5">
              {[
                {name: 'Home', link: '/'},
                {name: 'US SISTERS', link: '/about'},
                {name: 'BUY', link: '/shop'},
                {name: 'GIFT', link: '#gift'},
                {name: 'CONTACT', link: '#contact'}
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h3 className="font-semibold mb-3 text-[#E6007E]">Store Hours</h3>
            <ul className="space-y-1.5">
              <li className="flex justify-between">
                <span className="text-gray-400">Monday-Friday</span>
                <span className="text-white font-medium">10:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Saturday</span>
                <span className="text-white font-medium">10:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Sunday</span>
                <span className="text-white font-medium">11:00 - 17:00</span>
              </li>
              <li className="pt-1.5 text-gray-400">
                <span>Virtual consultations available 24/7</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-3 text-[#E6007E]">Stay Organized. Stay Inspired.</h3>
            <p className="text-gray-400 mb-3">
              Join our list for exclusive drops, inspiration, and promotions made for our sisters.
            </p>
            <div className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-700 text-white py-1.5 px-3 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E6007E] w-full"
              />
              <Button variant="default" size="sm" className="bg-[#E6007E] hover:bg-white hover:text-[#E6007E] text-white w-full">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 md:mt-10 pt-5 md:pt-6 flex flex-col md:flex-row justify-between items-center px-4 md:px-0">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Sister Storage. All rights reserved. Culture without clutter since 2020.
          </p>
          <div className="flex space-x-5 mt-3 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-400">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-400">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
