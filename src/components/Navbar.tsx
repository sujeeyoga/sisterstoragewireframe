
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Gift, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { totalItems, setIsOpen: setCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-800/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-10">
          <h1 className="text-white font-bold">SISTER STORAGE</h1>
        </Link>

        {/* Desktop Menu */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { name: 'US SISTERS', path: '/about' },
              { name: 'BUY', path: '/shop', icon: ShoppingBag },
              { name: 'GIFT', path: '#gift', icon: Gift },
              { name: 'CONTACT', path: '#contact', icon: Mail }
            ].map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`text-white hover:bg-black hover:text-white transition-colors duration-300 px-3 py-1.5 rounded-md ${item.icon ? 'flex items-center gap-1' : ''}`}
              >
                {item.icon && <item.icon className="h-3 w-3" />}
                {item.name}
              </Link>
            ))}
            <Button 
              size="sm"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="mr-1 h-3 w-3" />
              Cart ({totalItems})
            </Button>
          </nav>
        )}

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button 
            className="p-1.5 text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && (
        <div 
          className={`fixed inset-0 bg-gray-800 z-40 pt-20 px-4 transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className="flex flex-col space-y-5 items-center">
            {[
              { name: 'US SISTERS', path: '/about' },
              { name: 'BUY', path: '/shop', icon: ShoppingBag },
              { name: 'GIFT', path: '#gift', icon: Gift },
              { name: 'CONTACT', path: '#contact', icon: Mail }
            ].map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="text-white hover:text-purple-300 transition-colors duration-300 flex items-center gap-1.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
            <Button 
              className="w-full mt-2" 
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                setCartOpen(true);
              }}
            >
              <ShoppingBag className="mr-1 h-3 w-3" />
              Cart ({totalItems})
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
