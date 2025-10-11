
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const StorySection = () => {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
            By Sisters, For Sisters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-[#FF8021] h-64 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">Sister Storage</span>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                Sister Storage was created for the women who celebrate their culture boldly, 
                live beautifully, and organize powerfully. We believe in honoring our traditions 
                while designing for our modern lives.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed font-medium italic">
                "Designed with love, built for everyday beauty."
              </p>
              
              <Button 
                variant="secondary" 
                className="px-6 py-5 text-base group mt-4"
                onClick={scrollToAbout}
              >
                <span className="flex items-center">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorySection;
