
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    id: 1,
    title: "Choose Your Box",
    description: "Start with a style that suits your needs and your space.",
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Customize Your Interior",
    description: "Select interiors that protect and showcase your pieces perfectly.",
    image: "https://images.unsplash.com/photo-1489274495757-95c7c837b101?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Enjoy a Clutter-Free Life",
    description: "Let your everyday feel a little lighter, calmer, and more beautiful.",
    image: "https://images.unsplash.com/photo-1587142198902-6599e97263bd?q=80&w=600&auto=format&fit=crop"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-12 md:mb-16 px-4">
          <span className="text-[#E90064] font-medium">Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">How It Works</h2>
          <p className="text-gray-600">
            Transform your space in three easy steps with our beautiful storage solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 px-4 md:px-0">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-[#FFDCBD] flex items-center justify-center mb-2">
                  <span className="text-[#FF8021] text-2xl font-bold">{step.id}</span>
                </div>
                <div className="absolute top-1/2 left-full h-0.5 bg-[#FFDCBD] w-full -translate-y-1/2 hidden md:block" 
                     style={{ display: step.id === steps.length ? 'none' : undefined }}></div>
              </div>
              
              <div className="h-48 w-full overflow-hidden rounded-lg mb-4">
                <img 
                  src={step.image} 
                  alt={`Step ${step.id}: ${step.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              <div className="mt-4 flex items-center justify-center text-[#E90064]">
                <Check className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Easy & Intuitive</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="secondary" size="lg">
            Learn More About Our Process
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
