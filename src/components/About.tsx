
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="order-2 lg:order-1 px-4 md:px-0">
            <span className="text-[#E90064] font-medium">Our Journey</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4 md:mb-6">Built on Love and Practicality</h2>
            <p className="text-gray-700 mb-5 md:mb-6 leading-relaxed">
              Sister Storage began when two sisters, Emma and Sarah, couldn't find beautiful storage solutions that matched their homes and aesthetic. What started as handcrafted boxes for their own treasured items evolved into a brand dedicated to bringing organization and beauty into every home.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Each piece in our collection is thoughtfully designed with both function and elegance in mind. Our mission is to transform organizing from a chore into an experience that enhances your space and brings joy to your daily rituals.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Sustainably sourced materials that are as beautiful as they are durable',
                'Designs that complement your existing decor rather than competing with it',
                'Versatile organization solutions that adapt to your changing needs',
                'Created with the belief that practical items should also be beautiful'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#E90064] mr-2 flex-shrink-0">✓</span>
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <Button className="bg-black hover:bg-[#FF8021] text-white w-full sm:w-auto flex items-center justify-center gap-2">
              Learn More About Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-3 md:gap-4 px-4 md:px-0">
            <div className="space-y-3 md:space-y-4">
              <div className="rounded-lg h-48 md:h-64 bg-[#E90064] flex items-center justify-center">
                <span className="text-white text-xl font-bold">Sister</span>
              </div>
              <div className="rounded-lg h-32 md:h-40 bg-[#FFDCBD] flex items-center justify-center">
                <span className="text-[#000000] text-xl font-bold">Storage</span>
              </div>
            </div>
            <div className="space-y-3 md:space-y-4 mt-6 md:mt-8">
              <div className="rounded-lg h-32 md:h-40 bg-[#FF8021] flex items-center justify-center">
                <span className="text-white text-xl font-bold">Organize</span>
              </div>
              <div className="rounded-lg h-48 md:h-64 bg-[#FE5FA2] flex items-center justify-center">
                <span className="text-white text-xl font-bold">Beautifully</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
