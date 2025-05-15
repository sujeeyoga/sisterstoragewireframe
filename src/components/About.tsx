
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-16 md:py-20 bg-ramen-beige/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="order-2 lg:order-1 px-4 md:px-0">
            <span className="text-ramen-red font-medium">Our Journey</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4 md:mb-6">Crafting Bowl Perfection Since 2010</h2>
            <p className="text-gray-700 mb-5 md:mb-6 leading-relaxed">
              What began as Chef Kenji Takahashi's dream in a small Tokyo kitchen has evolved into Ramen Bae, a celebration of authentic flavors and time-honored techniques. After mastering his craft under legendary ramen masters, Chef Kenji brought his passion across the ocean to share the true essence of Japanese ramen.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Every bowl we serve embodies our commitment to tradition and quality. Our broths simmer for 20 hours to develop deep, complex flavors. Our noodles are made fresh daily using a special flour blend. Every topping is prepared with meticulous care to create a harmonious balance that tells a story with each bite.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'House-made broths simmered for 20 hours with natural ingredients',
                'Artisanal noodles crafted daily using our proprietary flour blend',
                'Locally-sourced, seasonal ingredients that support community farmers',
                'Secret family recipes passed down through generations of ramen masters'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-ramen-red mr-2 flex-shrink-0">✓</span>
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <Button className="bg-ramen-red hover:bg-ramen-red/90 text-white w-full sm:w-auto flex items-center justify-center gap-2">
              Discover Our Story
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-3 md:gap-4 px-4 md:px-0">
            <div className="space-y-3 md:space-y-4">
              <div className="overflow-hidden rounded-lg h-48 md:h-64">
                <img 
                  src="https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=600&auto=format&fit=crop" 
                  alt="Chef preparing ramen with traditional techniques" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-lg h-32 md:h-40">
                <img 
                  src="https://images.unsplash.com/photo-1596560548464-f010549e45d8?q=80&w=600&auto=format&fit=crop" 
                  alt="Fresh premium ramen ingredients sourced daily" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-3 md:space-y-4 mt-6 md:mt-8">
              <div className="overflow-hidden rounded-lg h-32 md:h-40">
                <img 
                  src="https://images.unsplash.com/photo-1632707094003-d1119352e0c6?q=80&w=600&auto=format&fit=crop" 
                  alt="Modern restaurant interior designed for authentic experience" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-lg h-48 md:h-64">
                <img 
                  src="https://images.unsplash.com/photo-1570368295251-47ec318b9302?q=80&w=600&auto=format&fit=crop" 
                  alt="Signature tonkotsu ramen with chashu and ajitama egg" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
