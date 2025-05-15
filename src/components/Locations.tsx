
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const locations = [
  {
    id: 1,
    name: 'New York Flagship',
    address: '123 Fashion Ave, New York, NY 10018',
    phone: '(212) 555-8765',
    hours: 'Mon-Sat: 10:00 AM - 8:00 PM, Sun: 11:00 AM - 6:00 PM',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop',
    description: 'Our original location featuring a spacious showroom with all our collections and personalized storage consultations.'
  },
  {
    id: 2,
    name: 'Los Angeles Studio',
    address: '456 Beverly Blvd, Los Angeles, CA 90048',
    phone: '(310) 555-2301',
    hours: 'Mon-Sun: 11:00 AM - 7:00 PM',
    image: 'https://images.unsplash.com/photo-1555035900-83c0b6c10900?q=80&w=600&auto=format&fit=crop',
    description: 'A boutique experience focused on our premium collections with regular organization workshops and events.'
  },
  {
    id: 3,
    name: 'Chicago Store',
    address: '789 Michigan Ave, Chicago, IL 60611',
    phone: '(312) 555-6437',
    hours: 'Mon-Sat: 10:00 AM - 7:00 PM, Sun: 12:00 PM - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=600&auto=format&fit=crop',
    description: 'Our newest location featuring our complete line of storage solutions with an in-house organization consulting team.'
  }
];

const Locations = () => {
  return (
    <section id="locations" className="py-16 md:py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-10 md:mb-12 px-4">
          <span className="text-purple-600 font-medium">Visit Us</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">Our Locations</h2>
          <p className="text-gray-600">
            Experience our beautifully crafted storage solutions in person at any of our thoughtfully designed spaces
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
                  alt={`${location.name} store location interior`} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-3">{location.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{location.description}</p>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{location.address}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{location.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{location.hours}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="flex-1 bg-gray-800 hover:bg-purple-600 text-white flex items-center justify-center gap-1"
                  >
                    Get Directions
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
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
