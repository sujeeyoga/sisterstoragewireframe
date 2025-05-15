
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ramen-black text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">RAMEN BAE</h2>
            <p className="text-gray-400 max-w-xs">
              Authentic Japanese ramen crafted with passion, tradition, and the finest ingredients.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-ramen-red transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ramen-red transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ramen-red transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ramen-red">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Menu', 'About Us', 'Locations', 'Order Online', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ramen-red">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-400">Monday-Friday</span>
                <span className="text-white">11:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Saturday</span>
                <span className="text-white">10:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Sunday</span>
                <span className="text-white">10:00 - 22:00</span>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ramen-red">Contact</h3>
            <address className="not-italic space-y-2 text-gray-400">
              <p>123 Main Street</p>
              <p>Vancouver, BC V6B 1A1</p>
              <p className="pt-2">info@ramenbae.com</p>
              <p>(604) 555-1234</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Ramen Bae. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
