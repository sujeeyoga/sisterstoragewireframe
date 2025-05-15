
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-ramen-black text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-0">
          {/* Brand and Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">RAMEN BAE</h2>
            <p className="text-gray-400 max-w-xs">
              Authentic Japanese ramen crafted with passion, tradition, and the finest ingredients. Each bowl tells a story of culinary excellence and cultural heritage.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-ramen-red transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ramen-red transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ramen-red transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ramen-red">Quick Links</h3>
            <ul className="space-y-2">
              {[
                {name: 'Home', link: '/'},
                {name: 'Our Menu', link: '#menu'},
                {name: 'Our Story', link: '#about'},
                {name: 'Locations', link: '#locations'},
                {name: 'Order Online', link: '#'},
                {name: 'Gift Cards', link: '#'}
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.link} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
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
                <span className="text-gray-400 text-sm">Monday-Friday</span>
                <span className="text-white text-sm font-medium">11:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400 text-sm">Saturday</span>
                <span className="text-white text-sm font-medium">10:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400 text-sm">Sunday</span>
                <span className="text-white text-sm font-medium">10:00 - 22:00</span>
              </li>
              <li className="pt-2 text-gray-400 text-sm">
                <span>Last orders 30 minutes before closing</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ramen-red">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for exclusive offers, new menu items, and ramen inspiration delivered to your inbox.
            </p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-800 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-1 focus:ring-ramen-red w-full text-sm"
              />
              <Button className="bg-ramen-red hover:bg-ramen-red/90 text-white w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center px-4 md:px-0">
          <p className="text-gray-500 text-xs md:text-sm">
            © {new Date().getFullYear()} Ramen Bae. All rights reserved. Authentic Japanese cuisine since 2010.
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
