
import AnimatedText from '@/components/ui/animated-text';
import ButtonShowcase from './ButtonShowcase';
import ThemeShowcase from './ThemeShowcase';

const BrandComponents = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="container-custom">
        <AnimatedText
          as="h2"
          className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins"
          animation="breath-fade-up"
        >
          Modular Components
        </AnimatedText>
        
        <div className="max-w-4xl mx-auto space-y-12">
          <ButtonShowcase />
          <ThemeShowcase />
        </div>
      </div>
    </section>
  );
};

export default BrandComponents;
