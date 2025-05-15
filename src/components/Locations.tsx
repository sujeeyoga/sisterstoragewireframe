
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const locations = [
  {
    id: 1,
    name: 'Downtown Flagship',
    address: '123 Main Street, Vancouver, BC V6B 5T9',
    phone: '(604) 555-1234',
    hours: 'Mon-Sun: 11:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
    description: 'Our original location featuring an open kitchen concept and traditional decor inspired by Tokyo's finest ramen shops.'
  },
  {
    id: 2,
    name: 'Kitsilano Beach',
    address: '456 West 4th Ave, Vancouver, BC V6K 1N7',
    phone: '(604) 555-5678',
    hours: 'Mon-Sun: 11:30 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
    description: 'A cozy spot with ocean views, perfect for enjoying a steaming bowl of ramen after a day at the beach.'
  },
  {
    id: 3,
    name: 'Richmond Center',
    address: '789 No. 3 Road, Richmond, BC V6Y 2C2',
    phone: '(604) 555-9012',
    hours: 'Mon-Sun: 11:00 AM - 10:30 PM',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=600&auto=format&fit=crop',
    description: 'Our newest location featuring an extended menu with regional specialties and fusion-inspired creations.'
  }
];

const Locations = () => {
  return (
    <section id="locations" className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-10 md:mb-12 px-4">
          <span className="text-ramen-red font-medium">Find Us</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">Our Locations</h2>
          <p className="text-gray-600">
            Experience authentic Japanese ramen at any of our carefully designed spaces, each offering the same commitment to quality with its own unique atmosphere
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
          {locations.map((location) => (
            <div 
              key={location.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 w-full max-w-[350px] mx-auto"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={location.image} 
                  alt={`${location.name} restaurant location interior`} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-3">{location.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{location.description}</p>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-ramen-red mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{location.address}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-ramen-red mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{location.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-ramen-red mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{location.hours}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="flex-1 bg-ramen-black hover:bg-ramen-red text-white flex items-center justify-center gap-1"
                  >
                    Get Directions
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-ramen-black text-ramen-black hover:bg-ramen-black hover:text-white"
                  >
                    Call Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
