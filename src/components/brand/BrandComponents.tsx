
import { SisterBrand } from '@/config/sister-brand.config';
import AnimatedText from '@/components/ui/animated-text';
import ButtonShowcase from './ButtonShowcase';
import ThemeShowcase from './ThemeShowcase';

const BrandComponents = () => {
  return (
    <section className="bg-white min-h-screen flex items-center justify-center px-6">
      <div className="container-custom">
        <div className="text-center mb-12">
          <AnimatedText
            as="h2"
            className="text-3xl md:text-4xl font-bold mb-4 font-poppins"
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
        
        <div className="max-w-4xl mx-auto space-y-12">
          <ButtonShowcase />
          <ThemeShowcase />
        </div>
      </div>
    </section>
  );
};

export default BrandComponents;
