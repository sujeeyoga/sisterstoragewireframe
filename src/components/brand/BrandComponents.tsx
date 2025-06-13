
import { SisterBrand } from '@/config/sister-brand.config';
import AnimatedText from '@/components/ui/animated-text';
import ButtonShowcase from './ButtonShowcase';
import ThemeShowcase from './ThemeShowcase';

const BrandComponents = () => {
  return (
    <section className="bg-white min-h-screen flex items-center justify-center px-6 py-16">
      <div className="container-custom">
        <div className="text-center mb-16">
          <AnimatedText
            as="h2"
            className="text-3xl md:text-4xl font-bold mb-8 font-poppins"
            animation="breath-fade-up"
          >
            Modular Components
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
          <div className="col-span-12 mb-12">
            <ButtonShowcase />
          </div>
          <div className="col-span-12">
            <ThemeShowcase />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandComponents;
