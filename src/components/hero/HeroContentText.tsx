import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface HeroContentTextProps {
  isMobile?: boolean;
}

export const HeroContentText = ({ isMobile = false }: HeroContentTextProps) => {
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-3 text-white pt-54">
        <Badge 
          variant="secondary" 
          className="bg-white text-[hsl(var(--brand-pink))] px-4 py-2 text-base font-bold w-fit rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Beautifully Organized
        </Badge>

        <h1 className="text-[6rem] font-black leading-[0.9] tracking-tighter">
          CULTURE /<br />
          WITHOUT<br />
          CLUTTER.
        </h1>

        <p className="text-3xl font-bold leading-[1.1] tracking-tight uppercase">
          BROUGHT TO YOU BY SISTERS<br />
          WHO GET IT.
        </p>

        <div className="pt-12">
          <Link to="/shop">
            <Button 
              size="lg"
              className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/95 hover:scale-105 font-bold text-lg px-6 py-4 w-fit shadow-2xl transition-all duration-300 rounded-full"
            >
              SHOP THE DROP
            </Button>
          </Link>
        </div>

        <div className="pt-2 opacity-95">
          <p className="text-lg font-light leading-relaxed tracking-wide">
            Made by sisters, for sisters.<br />
            Clutter never had a place in our culture.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 lg:gap-3 text-white">
      <Badge 
        variant="secondary" 
        className="bg-white text-[hsl(var(--brand-pink))] px-3 py-1.5 text-[10px] md:text-xs font-bold w-fit rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        Beautifully Organized
      </Badge>

      <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tighter">
        CULTURE /<br />
        WITHOUT<br />
        CLUTTER.
      </h1>

      <p className="text-sm md:text-base lg:text-xl xl:text-2xl font-bold leading-tight tracking-tight uppercase">
        BROUGHT TO YOU BY SISTERS<br />
        WHO GET IT.
      </p>

      <div className="pt-1">
        <Link to="/shop">
          <Button 
            size="sm"
            className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/90 hover:scale-105 font-bold text-xs md:text-sm px-5 py-3 w-fit shadow-2xl transition-all duration-300 rounded-full"
          >
            SHOP THE DROP
          </Button>
        </Link>
      </div>

      <div className="pt-0.5 opacity-90">
        <p className="text-xs md:text-sm lg:text-base font-light leading-relaxed tracking-wide">
          Made by sisters, for sisters.<br />
          Clutter never had a place in our culture.
        </p>
      </div>
    </div>
  );
};
