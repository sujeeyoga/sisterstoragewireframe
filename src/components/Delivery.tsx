
import { Truck, Package, Clock, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const deliveryZones = [
  {
    id: 1,
    name: 'East Coast Express',
    areas: 'New York, Boston, Philadelphia, Washington D.C.',
    timing: '1-2 Business Days',
    phone: '(212) 555-8765',
    hours: 'Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM',
    color: '#E90064',
    description: 'Fast delivery service to all major East Coast cities with real-time tracking and package protection.'
  },
  {
    id: 2,
    name: 'West Coast Standard',
    areas: 'Los Angeles, San Francisco, Seattle, Portland',
    timing: '1-3 Business Days',
    phone: '(310) 555-2301',
    hours: 'Mon-Sun: 9:00 AM - 8:00 PM',
    color: '#FF8021',
    description: 'Reliable delivery service to West Coast metropolitan areas with signature confirmation and special handling options.'
  },
  {
    id: 3,
    name: 'Nationwide Premium',
    areas: 'All 50 States including Hawaii and Alaska',
    timing: '2-4 Business Days',
    phone: '(312) 555-6437',
    hours: 'Mon-Sat: 8:00 AM - 9:00 PM, Sun: 10:00 AM - 6:00 PM',
    color: '#FFDCBD',
    description: 'Premium nationwide shipping with insurance coverage, climate-controlled transport, and specialized packaging for delicate items.'
  }
];

const Delivery = () => {
  return (
    <section id="delivery" className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-10 md:mb-12 px-4">
          <span className="text-[#E90064] font-medium">Shipping Info</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">Our Delivery Service</h2>
          <p className="text-gray-600">
            We deliver your beautifully crafted storage solutions directly to your doorstep with care and precision
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
          {deliveryZones.map((zone) => (
            <div 
              key={zone.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 w-full max-w-[350px] mx-auto"
            >
              <div 
                className="h-48 flex items-center justify-center"
                style={{ backgroundColor: zone.color }}
              >
                <Package className="h-12 w-12 text-white mb-2" />
                <span className="text-white text-3xl font-bold ml-3">{zone.name}</span>
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-3">{zone.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{zone.description}</p>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 text-[#E90064] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{zone.areas}</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-[#E90064] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{zone.timing}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-[#E90064] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{zone.phone} (Customer Support)</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="flex-1 bg-black hover:bg-[#FF8021] text-white flex items-center justify-center gap-1"
                  >
                    Delivery Info
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-black text-black hover:bg-black hover:text-white"
                  >
                    Track Package
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

export default Delivery;
