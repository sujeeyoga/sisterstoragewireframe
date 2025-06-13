
import { SisterBrand } from '@/config/sister-brand.config';
import { Badge } from '@/components/ui/badge';
import AnimatedText from '@/components/ui/animated-text';

const BrandHeader = () => {
  return (
    <section className="bg-[#E90064] text-white min-h-screen flex items-center justify-center px-6 py-16">
      <div className="container-custom text-center">
        <AnimatedText
          as="h1"
          className="text-5xl md:text-7xl font-bold mb-8 font-poppins"
          animation="breath-fade-up-1"
          words
        >
          Sister Storage Brand Guide
        </AnimatedText>
        <AnimatedText
          as="p"
          className="text-lg md:text-xl font-thin mb-12 max-w-2xl mx-auto font-poppins"
          animation="breath-fade-up-2"
        >
          {SisterBrand.brandVoice.mission}
        </AnimatedText>
        <AnimatedText
          as="p"
          className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed font-poppins"
          animation="breath-fade-up-2"
        >
          Our visual identity celebrates the beauty of organized living while honoring our cultural heritage. Every color, every curve, every choice reflects our mission: Culture Without Clutter.
        </AnimatedText>
        <AnimatedText
          as="div"
          className="flex flex-wrap justify-center gap-4"
          animation="breath-fade-up-3"
          container
        >
          {SisterBrand.brandVoice.personality.map((trait) => (
            <Badge key={trait} variant="secondary" className="bg-white text-[#E90064] px-6 py-3 text-sm font-medium font-poppins" style={{ borderRadius: '0px' }}>
              {trait}
            </Badge>
          ))}
        </AnimatedText>
      </div>
    </section>
  );
};

export default BrandHeader;
