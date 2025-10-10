import { HeroBackground } from './HeroBackground';
import { HeroContentText } from './HeroContentText';

interface HeroMobileLayoutProps {
  offset: number;
}

export const HeroMobileLayout = ({ offset }: HeroMobileLayoutProps) => {
  return (
    <div className="md:hidden flex flex-col">
      {/* Pink Content Section */}
      <div className="bg-[hsl(var(--brand-pink))] py-16 px-4 h-[75vh] flex items-center">
        <HeroContentText isMobile />
      </div>

      {/* Background Image */}
      <HeroBackground isMobile offset={offset} />
    </div>
  );
};
