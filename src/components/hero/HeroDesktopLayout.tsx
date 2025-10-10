import { HeroBackground } from './HeroBackground';
import { HeroContentText } from './HeroContentText';

export const HeroDesktopLayout = () => {
  return (
    <div className="hidden md:block">
      {/* Full Background Image */}
      <HeroBackground />

      {/* Pink Content Section */}
      <div className="relative h-[90vh] flex items-center justify-start pt-0">
        <div className="bg-[hsl(var(--brand-pink))] flex items-center animate-slide-in-right w-full md:w-[60vw] lg:w-[55vw] overflow-hidden shadow-2xl rounded-r-[3rem]">
          <div className="grid grid-cols-2 w-full py-4 md:py-6 lg:py-8">
            {/* First column - empty spacer */}
            <div className="col-span-1"></div>
            
            {/* Second column - text content */}
            <div className="col-span-1 pr-2 md:pr-3 lg:pr-4">
              <HeroContentText />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
