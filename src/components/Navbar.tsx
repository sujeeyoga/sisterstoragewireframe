
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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
        isScrolled ? 'bg-ramen-black/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="relative z-10">
          <h1 className="text-ramen-white text-2xl font-bold">RAMEN BAE</h1>
        </a>

        {/* Desktop Menu */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-8">
            {['Menu', 'About', 'Locations', 'Order Online'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-ramen-white hover:text-ramen-red transition-colors duration-300 text-sm font-medium"
              >
                {item}
              </a>
            ))}
            <Button 
              className="bg-ramen-red hover:bg-ramen-red/90 text-ramen-white" 
              size="sm"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Order Now
            </Button>
          </nav>
        )}

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button 
            className="p-2 text-ramen-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && (
        <div 
          className={`fixed inset-0 bg-ramen-black z-40 pt-24 px-4 transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className="flex flex-col space-y-6 items-center">
            {['Menu', 'About', 'Locations', 'Order Online'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-ramen-white hover:text-ramen-red transition-colors duration-300 text-xl font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <Button 
              className="bg-ramen-red hover:bg-ramen-red/90 text-ramen-white w-full mt-4" 
              size="lg"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Order Now
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
