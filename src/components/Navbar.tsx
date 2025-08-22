import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Home, Package, Info, Image, Newspaper, Palette, BookOpen, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import EnhancedLogo from '@/components/ui/enhanced-logo';

interface NavbarProps {
  position?: number;
}

const Navbar = ({ position = 0 }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Calculate scroll-based styling for sticky positioning
  const isSticky = position > 16; // Slightly after scroll begins

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
    <>
      <div className={`w-full grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300 ${
        isSticky ? 'py-2 px-4' : 'py-3 px-4'
      }`}>
        {/* Left: Logo */}
        <div className="justify-self-start shrink-0">
          <EnhancedLogo 
            size={isSticky ? "lg" : "xl"} 
            scrolled={isSticky}
            className="animate-fade-in"
            loading="eager"
          />
        </div>

        <div className="justify-self-center flex justify-center">
          {/* Full menu ≥1280px */}
          <div className="hidden xl:flex items-center gap-8">
            <Link to="/" className="bg-[hsl(var(--brand-pink))] text-white px-6 py-2.5 rounded-full font-medium transition-colors hover:bg-[hsl(var(--brand-pink))]/90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] focus:ring-offset-2 min-h-[44px] flex items-center">HOME</Link>
            <Link to="/gallery" className={`px-4 py-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${
              location.pathname === '/gallery' ? 'text-[hsl(var(--brand-pink))] bg-[hsl(var(--brand-pink))]/10' : 'text-black hover:text-[hsl(var(--brand-pink))]'
            }`}>GALLERY</Link>
            <Link to="/about" className={`px-4 py-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${
              location.pathname === '/about' ? 'text-[hsl(var(--brand-pink))] bg-[hsl(var(--brand-pink))]/10' : 'text-black hover:text-[hsl(var(--brand-pink))]'
            }`}>ABOUT</Link>
            <Link to="/shop" className={`px-4 py-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${
              location.pathname === '/shop' ? 'text-[hsl(var(--brand-pink))] bg-[hsl(var(--brand-pink))]/10' : 'text-black hover:text-[hsl(var(--brand-pink))]'
            }`}>SHOP</Link>
          </div>
          
          {/* Condensed menu 768-1279px */}
          <div className="hidden lg:flex xl:hidden items-center gap-6">
            <Link to="/" className="bg-[hsl(var(--brand-pink))] text-white px-6 py-2.5 rounded-full font-medium transition-colors hover:bg-[hsl(var(--brand-pink))]/90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] focus:ring-offset-2 min-h-[44px] flex items-center">HOME</Link>
            <Link to="/gallery" className={`px-4 py-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${
              location.pathname === '/gallery' ? 'text-[hsl(var(--brand-pink))] bg-[hsl(var(--brand-pink))]/10' : 'text-black hover:text-[hsl(var(--brand-pink))]'
            }`}>GALLERY</Link>
            <Link to="/shop" className={`px-4 py-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${
              location.pathname === '/shop' ? 'text-[hsl(var(--brand-pink))] bg-[hsl(var(--brand-pink))]/10' : 'text-black hover:text-[hsl(var(--brand-pink))]'
            }`}>SHOP</Link>
          </div>
        </div>

        {/* Right: Cart and Menu */}
        <div className="justify-self-end shrink-0 flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="p-2 text-black hover:bg-black/10 rounded transition-colors relative focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-6 w-6" />
            {totalItems > 0 && (
              <span 
                className="absolute -top-1 -right-1 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold bg-[hsl(var(--brand-pink))]"
              >
                {totalItems}
              </span>
            )}
          </button>
          <button 
            className="lg:hidden p-3 text-black focus:outline-none hover:bg-[hsl(var(--brand-pink)/0.1)] rounded-full transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-[hsl(var(--brand-pink))] transform hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative">
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[hsl(var(--brand-pink))] rotate-0 transition-all duration-300" />
              ) : (
                <Menu className="h-6 w-6 text-[hsl(var(--brand-pink))] transition-all duration-300" />
              )}
            </div>
          </button>
        </div>
      </div>


      {/* Enhanced Mobile Menu with improved animations and design */}
      <div 
        className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ease-out ${
          mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Enhanced Backdrop with blur */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-all duration-500 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Enhanced Slide-in panel with brand gradient */}
        <aside className={`absolute right-0 top-0 h-full w-[90%] max-w-sm bg-gradient-to-br from-white via-[hsl(var(--brand-pink)/0.02)] to-[hsl(var(--brand-orange)/0.03)] backdrop-blur-xl shadow-2xl border-l border-[hsl(var(--brand-pink)/0.1)] transform transition-transform duration-500 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          {/* Header Section */}
          <div className="p-6 border-b border-[hsl(var(--brand-pink)/0.1)] bg-gradient-to-r from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-orange))]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white">
                <h2 className="text-2xl font-black tracking-tight">SISTER</h2>
                <p className="text-white/80 text-sm font-medium">Culture Without Clutter</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="px-6 space-y-2">
              {[
                { name: 'HOME', path: '/', icon: Home, gradient: 'from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-orange))]' },
                { name: 'SHOP', path: '/shop', icon: ShoppingCart, gradient: 'from-[hsl(var(--brand-orange))] to-[hsl(var(--brand-pink))]' },
                { name: 'GALLERY', path: '/gallery', icon: Image, gradient: 'from-[hsl(var(--brand-pink))] to-purple-500' },
                { name: 'ABOUT', path: '/about', icon: Info, gradient: 'from-[hsl(var(--brand-orange))] to-yellow-500' },
                { name: 'OUR STORY', path: '/our-story', icon: BookOpen, gradient: 'from-purple-500 to-[hsl(var(--brand-pink))]' },
                { name: 'BLOG', path: '/blog', icon: Newspaper, gradient: 'from-blue-500 to-[hsl(var(--brand-orange))]' },
                { name: 'BRAND', path: '/brand', icon: Palette, gradient: 'from-green-500 to-[hsl(var(--brand-pink))]' }
              ].map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                      isActive 
                        ? 'bg-gradient-to-r from-[hsl(var(--brand-pink)/0.1)] to-[hsl(var(--brand-orange)/0.1)] shadow-lg border border-[hsl(var(--brand-pink)/0.2)]' 
                        : 'hover:bg-gradient-to-r hover:from-[hsl(var(--brand-pink)/0.05)] hover:to-[hsl(var(--brand-orange)/0.05)]'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className={`text-lg font-bold transition-colors ${
                        isActive ? 'text-[hsl(var(--brand-pink))]' : 'text-gray-900 group-hover:text-[hsl(var(--brand-pink))]'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-[hsl(var(--brand-pink))] rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="mx-6 my-6 h-px bg-gradient-to-r from-[hsl(var(--brand-pink)/0.2)] via-[hsl(var(--brand-orange)/0.2)] to-transparent" />

            {/* Special Actions */}
            <div className="px-6 space-y-3">
              {/* Cart Button */}
              <button
                onClick={() => { setMobileMenuOpen(false); setCartOpen(true); }}
                className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-orange))] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="p-3 rounded-xl bg-white/20">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-lg font-bold">SHOPPING CART</span>
                  {totalItems > 0 && (
                    <p className="text-white/80 text-sm">{totalItems} items</p>
                  )}
                </div>
                {totalItems > 0 && (
                  <div className="w-8 h-8 bg-white text-[hsl(var(--brand-pink))] rounded-full flex items-center justify-center font-bold text-sm">
                    {totalItems}
                  </div>
                )}
              </button>

              {/* Quick Link */}
              <Link
                to="/#delivery"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full group flex items-center gap-4 p-4 rounded-2xl border-2 border-[hsl(var(--brand-pink)/0.2)] hover:border-[hsl(var(--brand-pink)/0.4)] hover:bg-[hsl(var(--brand-pink)/0.05)] transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-[hsl(var(--brand-orange)/0.1)]">
                  <Package className="h-5 w-5 text-[hsl(var(--brand-orange))]" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-[hsl(var(--brand-pink))]">SHIPPING INFO</span>
                  <p className="text-gray-600 text-sm">Free on orders $75+</p>
                </div>
              </Link>
            </div>
          </nav>

          {/* Footer Section */}
          <div className="p-6 border-t border-[hsl(var(--brand-pink)/0.1)] bg-gradient-to-r from-[hsl(var(--brand-pink)/0.02)] to-[hsl(var(--brand-orange)/0.02)]">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Follow us for daily inspiration</p>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://instagram.com/sisterstorage" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-orange))] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
                >
                  <span className="text-sm font-bold">IG</span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--brand-orange))] to-[hsl(var(--brand-pink))] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
                >
                  <span className="text-sm font-bold">FB</span>
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
