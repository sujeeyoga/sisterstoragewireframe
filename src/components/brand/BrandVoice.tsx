
import { SisterBrand } from '@/config/sister-brand.config';
import AnimatedText from '@/components/ui/animated-text';

const BrandVoice = () => {
  return (
    <section className="bg-black text-white min-h-screen flex items-center justify-center px-6">
      <div className="container-custom text-center">
        <AnimatedText
          as="h2"
          className="text-3xl md:text-4xl font-bold mb-6 font-poppins"
          animation="breath-fade-up"
        >
          Our Voice
        </AnimatedText>
        <AnimatedText
          as="p"
          className="text-lg font-thin mb-8 font-poppins"
          animation="breath-fade-up-2"
        >
          {SisterBrand.brandVoice.mission}
        </AnimatedText>
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatedText
            as="p"
            className="text-xl italic mb-8 font-poppins"
            animation="breath-fade-up-2"
          >
            "{SisterBrand.brandVoice.tone}"
          </AnimatedText>
          
          <div className="bg-[#E90064] p-8" style={{ borderRadius: '0px' }}>
            <AnimatedText
              as="h3"
              className="text-2xl font-bold mb-4 font-poppins"
              animation="breath-fade-up-3"
            >
              {SisterBrand.brandVoice.tagline}
            </AnimatedText>
            <AnimatedText
              as="p"
              className="text-lg font-poppins"
              animation="breath-fade-up-4"
            >
              Our visual identity celebrates the beauty of organized living while honoring our cultural heritage. Every color, every curve, every choice reflects our mission.
            </AnimatedText>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandVoice;
