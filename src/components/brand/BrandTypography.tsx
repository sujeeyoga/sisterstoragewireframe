
import { SisterBrand } from '@/config/sister-brand.config';
import AnimatedText from '@/components/ui/animated-text';

const BrandTypography = () => {
  return (
    <div className="text-center">
      <div className="mb-16">
        <AnimatedText
          as="h2"
          className="text-3xl md:text-4xl font-bold mb-8 font-poppins"
          animation="breath-fade-up"
        >
          Typography — Poppins
        </AnimatedText>
        <AnimatedText
          as="p"
          className="text-lg font-thin text-gray-600 font-poppins"
          animation="breath-fade-up-2"
        >
          {SisterBrand.brandVoice.mission}
        </AnimatedText>
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 bg-white p-12 shadow-sm" style={{ borderRadius: '0px' }}>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-4 font-poppins">Display / Hero</p>
          <h1 className="text-4xl md:text-6xl font-bold text-[#E90064] leading-tight font-poppins">
            Culture Without Clutter
          </h1>
        </div>
        
        <div className="col-span-12 md:col-span-6 bg-white p-12 shadow-sm" style={{ borderRadius: '0px' }}>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-4 font-poppins">Heading</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins">
            Designed by sisters — for sisters
          </h2>
        </div>
        
        <div className="col-span-12 md:col-span-6 bg-white p-12 shadow-sm" style={{ borderRadius: '0px' }}>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-4 font-poppins">Body Text</p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed font-poppins">
            Made by sisters, for sisters. Sister Storage was created for the women who celebrate their culture boldly, live beautifully, and organize powerfully.
          </p>
        </div>

        <div className="col-span-12 bg-white p-12 shadow-sm" style={{ borderRadius: '0px' }}>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-4 font-poppins">Small Text / Captions</p>
          <p className="text-sm text-gray-600 font-poppins">
            Clutter never had a place in our culture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandTypography;
