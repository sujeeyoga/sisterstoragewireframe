import { useState, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import EnhancedLogo from '@/components/ui/enhanced-logo';
import { categoryTree } from "@/data/catalog";

interface FloatingSearchModuleProps {
  position?: number;
  onSearch?: (query: string) => void;
  activeCategorySlug?: string;
  onSelectCategory?: (slug?: string) => void;
}

const FloatingSearchModule = ({ position = 0, onSearch, activeCategorySlug, onSelectCategory }: FloatingSearchModuleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  // Calculate scroll-based styling for floating positioning
  const isFloating = position > 16;

  // Prevent body scroll when expanded on mobile
  useEffect(() => {
    if (isMobile && isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded, isMobile]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    setIsExpanded(false);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Main floating search module */}
      <div className={`w-full bg-white/95 backdrop-blur-sm border border-gray-200/50 transition-all duration-300 ${
        isFloating ? 'shadow-lg rounded-[25px]' : 'shadow-md rounded-[20px]'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="shrink-0">
            <EnhancedLogo 
              size={isFloating ? "lg" : "xl"} 
              scrolled={isFloating}
              className="animate-fade-in"
              loading="eager"
            />
          </div>

          {/* Search bar (desktop) */}
          {!isMobile && (
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[hsl(var(--primary))]"
                />
              </form>
            </div>
          )}

          {/* Navigation links (desktop) */}
          {!isMobile && (
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/gallery" 
                className="text-foreground font-medium transition-colors hover:text-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] rounded px-3 py-1"
              >
                GALLERY
              </Link>
              <Link 
                to="/about" 
                className="text-foreground font-medium transition-colors hover:text-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] rounded px-3 py-1"
              >
                ABOUT
              </Link>
              <Link 
                to="/shop" 
                className="bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-full font-medium transition-colors hover:bg-[hsl(var(--primary))]/90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2"
              >
                SHOP
              </Link>
            </div>
          )}

          {/* Toggle button with arrow down icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="shrink-0 p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
            aria-label="Toggle menu"
          >
            <ChevronDown 
              className={`h-5 w-5 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`} 
            />
          </Button>
        </div>

        {/* Expanded dropdown content */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 pb-6 space-y-6 border-t border-gray-100 bg-white">
            {/* Search bar for all devices when expanded */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-full border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[hsl(var(--primary))] w-full"
              />
            </form>

            {/* Storage categories section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Storage with Soul</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    onSelectCategory?.(undefined);
                    setIsExpanded(false);
                  }}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    !activeCategorySlug
                      ? "bg-[hsl(var(--primary))] text-primary-foreground shadow"
                      : "bg-background border border-border text-foreground/80 hover:bg-primary/10"
                  }`}
                >
                  All
                </button>
                {categoryTree.map((node) => (
                  <button
                    key={node.slug}
                    onClick={() => {
                      onSelectCategory?.(node.slug);
                      setIsExpanded(false);
                    }}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      activeCategorySlug === node.slug
                        ? "bg-[hsl(var(--primary))] text-primary-foreground shadow"
                        : "bg-background border border-border text-foreground/80 hover:bg-primary/10"
                    }`}
                  >
                    {node.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 md:justify-center">
              {[
                { name: 'GALLERY', path: '/gallery' },
                { name: 'SHOP', path: '/shop' },
                { name: 'ABOUT', path: '/about' },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsExpanded(false)}
                  className="text-[hsl(var(--primary))] text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Backdrop overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default FloatingSearchModule;