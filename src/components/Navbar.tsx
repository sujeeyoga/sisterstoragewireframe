
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Gift, Mail, ArrowLeft, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const navigate = useNavigate();

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile) {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, isMobile]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-800 shadow-lg py-2' : 'bg-[#E90064] py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Back Button (only on mobile) */}
        {isMobile && (
          <button
            onClick={handleBack}
            className="mr-2 p-1.5 text-white focus:outline-none"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Logo */}
        <Link to="/" className="relative z-10">
          <h1 className="text-white font-bold">SISTER STORAGE</h1>
        </Link>

        {/* Desktop Menu */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { name: 'HOME', path: '/', icon: Home },
              { name: 'US SISTERS', path: '/about' },
              { name: 'BUY', path: '/shop', icon: ShoppingBag },
              { name: 'SHIPPING', path: '#delivery', icon: Package },
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
            className="p-1.5 text-white focus:outline-none z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu Slide-in from left */}
      {isMobile && (
        <div 
          className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-[-100%]'
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="h-full flex flex-col pt-20 px-6">
            <nav className="flex flex-col space-y-6 items-center mt-8">
              {[
                { name: 'HOME', path: '/', icon: Home },
                { name: 'US SISTERS', path: '/about' },
                { name: 'BUY', path: '/shop', icon: ShoppingBag },
                { name: 'SHIPPING', path: '#delivery', icon: Package },
                { name: 'CONTACT', path: '#contact', icon: Mail }
              ].map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className="text-[#e90064] text-lg font-medium hover:text-[#c80056] transition-colors duration-300 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  {item.name}
                </Link>
              ))}
              <Button 
                className="w-full mt-4" 
                size="lg"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCartOpen(true);
                }}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Cart ({totalItems})
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
