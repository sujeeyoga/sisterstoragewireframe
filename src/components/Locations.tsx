
import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const locations = [
  {
    id: 1,
    name: 'Downtown',
    address: '123 Main Street, Vancouver, BC',
    phone: '(604) 555-1234',
    hours: 'Mon-Sun: 11:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Kitsilano',
    address: '456 West 4th Ave, Vancouver, BC',
    phone: '(604) 555-5678',
    hours: 'Mon-Sun: 11:30 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Richmond',
    address: '789 No. 3 Road, Richmond, BC',
    phone: '(604) 555-9012',
    hours: 'Mon-Sun: 11:00 AM - 10:30 PM',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=600&auto=format&fit=crop'
  }
];

const Locations = () => {
  return (
    <section id="locations" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-ramen-red font-medium">Visit Us</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Our Locations</h2>
          <p className="text-gray-600">
            Find the closest Ramen Bae restaurant and experience our authentic Japanese cuisine
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div 
              key={location.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={location.image} 
                  alt={`${location.name} location`} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{location.name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-ramen-red mr-3 mt-0.5" />
                    <span className="text-gray-700">{location.address}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-ramen-red mr-3 mt-0.5" />
                    <span className="text-gray-700">{location.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-ramen-red mr-3 mt-0.5" />
                    <span className="text-gray-700">{location.hours}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 bg-ramen-black hover:bg-ramen-red text-white"
                  >
                    Get Directions
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-ramen-black text-ramen-black hover:bg-ramen-black hover:text-white"
                  >
                    Call
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
