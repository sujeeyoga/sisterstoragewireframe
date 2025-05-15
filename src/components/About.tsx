
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <section id="about" className="py-20 bg-ramen-beige/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-ramen-red font-medium">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Crafting The Perfect Bowl Since 2010</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Ramen Bae began with a simple mission: to bring authentic Japanese ramen to food lovers everywhere. Our founder, Chef Kenji Takahashi, spent years perfecting his craft in Tokyo before bringing his culinary expertise to North America.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Every bowl of ramen we serve is the result of tradition, passion, and meticulous attention to detail. Our broths are simmered for 20 hours to extract maximum flavor, our noodles are made fresh daily, and our toppings are prepared with the finest ingredients.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Handcrafted broths made from scratch daily',
                'Fresh noodles made in-house',
                'Locally-sourced, seasonal ingredients',
                'Traditional recipes with modern twists'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-ramen-red mr-2">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="bg-ramen-red hover:bg-ramen-red/90 text-white">
              Learn More About Us
            </Button>
          </div>
          
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg h-64">
                <img 
                  src="https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=600&auto=format&fit=crop" 
                  alt="Chef preparing ramen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-lg h-40">
                <img 
                  src="https://images.unsplash.com/photo-1596560548464-f010549e45d8?q=80&w=600&auto=format&fit=crop" 
                  alt="Ramen ingredients" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="overflow-hidden rounded-lg h-40">
                <img 
                  src="https://images.unsplash.com/photo-1632707094003-d1119352e0c6?q=80&w=600&auto=format&fit=crop" 
                  alt="Restaurant interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-lg h-64">
                <img 
                  src="https://images.unsplash.com/photo-1570368295251-47ec318b9302?q=80&w=600&auto=format&fit=crop" 
                  alt="Bowl of ramen" 
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
