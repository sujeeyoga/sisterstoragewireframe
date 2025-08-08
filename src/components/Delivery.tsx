
import { Truck, Package, Clock, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const shippingZones = [
  {
    id: 1,
    name: 'Canada',
    flag: '🇨🇦',
    shipping: 'FREE SHIPPING',
    condition: 'All orders',
    timing: '2-5 Business Days',
    color: '#E90064',
    description: 'Free shipping across Canada on all orders. Express delivery available for select metropolitan areas.',
    features: ['Free shipping', 'Tracking included', 'Insurance coverage']
  },
  {
    id: 2,
    name: 'United States',
    flag: '🇺🇸',
    shipping: 'FREE SHIPPING',
    condition: 'Orders over $250',
    timing: '3-7 Business Days',
    color: '#FF8021',
    description: 'Free shipping to all US states on orders over $250. Standard shipping rates apply for orders under $250.',
    features: ['Free over $250', 'Tracking included', 'Signature delivery']
  }
];

const Delivery = () => {
  return (
    <div className="w-full">{/* Spacing controlled by Section wrapper */}
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-10 md:mb-12 px-4">
          <span className="text-[#E90064] font-medium">Shipping Info</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">Free Shipping Policy</h2>
          <p className="text-gray-600">
            Enjoy free shipping across North America with our sister-friendly delivery options
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0 max-w-4xl mx-auto">
          {shippingZones.map((zone) => (
            <div 
              key={zone.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div 
                className="h-32 flex items-center justify-center flex-col"
                style={{ backgroundColor: zone.color }}
              >
                <span className="text-6xl mb-2">{zone.flag}</span>
                <span className="text-white text-2xl font-bold">{zone.name}</span>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-[#E90064] mb-1">{zone.shipping}</h3>
                  <p className="text-lg text-gray-700">{zone.condition}</p>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 text-center">{zone.description}</p>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-center">
                    <Clock className="h-5 w-5 text-[#E90064] mr-3" />
                    <span className="text-gray-700 text-sm font-medium">{zone.timing}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {zone.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Package className="h-4 w-4 text-[#E90064] mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 px-4">
          <p className="text-gray-600 text-sm">
            * Standard shipping rates apply for US orders under $250. Contact us for international shipping options.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
