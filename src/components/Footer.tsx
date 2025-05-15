
import { Facebook, Instagram, Mail, MessageSquare, Pinterest } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-0">
          {/* Brand and Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">SISTER STORAGE</h2>
            <p className="text-gray-400 max-w-xs">
              Culture without clutter. Storage designed for us, by us – bringing organization and elegance to your cultural treasures.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-[#E6007E] transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#E6007E] transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#E6007E] transition-colors" aria-label="Follow us on Pinterest">
                <Pinterest className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#E6007E]">Quick Links</h3>
            <ul className="space-y-2">
              {[
                {name: 'Home', link: '/'},
                {name: 'US SISTERS', link: '/about'},
                {name: 'BUY', link: '/shop'},
                {name: 'GIFT', link: '#gift'},
                {name: 'CONTACT', link: '#contact'}
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.link} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#E6007E]">Store Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-400 text-sm">Monday-Friday</span>
                <span className="text-white text-sm font-medium">10:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400 text-sm">Saturday</span>
                <span className="text-white text-sm font-medium">10:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400 text-sm">Sunday</span>
                <span className="text-white text-sm font-medium">11:00 - 17:00</span>
              </li>
              <li className="pt-2 text-gray-400 text-sm">
                <span>Virtual consultations available 24/7</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#E6007E]">Stay Organized. Stay Inspired.</h3>
            <p className="text-gray-400 text-sm mb-4">
              Join our list for exclusive drops, inspiration, and promotions made for our sisters.
            </p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E6007E] w-full text-sm"
              />
              <Button className="bg-[#E6007E] hover:bg-white hover:text-[#E6007E] text-white w-full">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center px-4 md:px-0">
          <p className="text-gray-500 text-xs md:text-sm">
            © {new Date().getFullYear()} Sister Storage. All rights reserved. Culture without clutter since 2020.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-xs md:text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-xs md:text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-xs md:text-sm">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
