import { useState, useEffect } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
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

const FloatingSearchModule = ({ 
  position = 0, 
  onSearch, 
  activeCategorySlug, 
  onSelectCategory 
}: FloatingSearchModuleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
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

  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleCategorySelect = (slug?: string) => {
    onSelectCategory?.(slug);
    setIsExpanded(false);
  };

  return (
    <div 
      className={`w-full bg-white/95 backdrop-blur-sm border border-gray-200/50 ${
        isFloating ? 'shadow-lg rounded-[25px]' : 'shadow-md rounded-[20px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <EnhancedLogo 
          size={isFloating ? "lg" : "xl"} 
          scrolled={isFloating}
          loading="eager"
        />

        {!isMobile && (
          <nav className="flex items-center gap-6">
            <Link 
              to="/gallery" 
              className="text-foreground font-medium hover:text-foreground/70 rounded px-3 py-1"
            >
              GALLERY
            </Link>
            <Link 
              to="/about" 
              className="text-foreground font-medium hover:text-foreground/70 rounded px-3 py-1"
            >
              ABOUT
            </Link>
            <Link 
              to="/shop" 
              className="bg-foreground text-background px-4 py-2 rounded-full font-medium hover:bg-foreground/90"
            >
              SHOP
            </Link>
          </nav>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="shrink-0 p-2 hover:bg-gray-100 rounded-full"
          aria-label="Toggle menu"
        >
          <ChevronDown 
            className={`h-5 w-5 transition-transform ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </Button>
      </div>

      {/* Expanded Content */}
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 space-y-6 border-t border-gray-100 bg-white">
          <div className="flex justify-center pt-4">
            <EnhancedLogo size="xl" loading="eager" />
          </div>

          {/* Filter Input */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter by category, rod count, or use case..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-full border border-border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-ring w-full"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect(undefined)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                !activeCategorySlug
                  ? "bg-foreground text-background shadow"
                  : "bg-background border border-border text-foreground/80 hover:bg-muted"
              }`}
            >
              All
            </button>
            {categoryTree.map((node) => (
              <button
                key={node.slug}
                onClick={() => handleCategorySelect(node.slug)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  activeCategorySlug === node.slug
                    ? "bg-foreground text-background shadow"
                    : "bg-background border border-border text-foreground/80 hover:bg-muted"
                }`}
              >
                {node.label}
              </button>
            ))}
          </div>

          {/* Navigation Links */}
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
                className="text-foreground text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50 text-center transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default FloatingSearchModule;
