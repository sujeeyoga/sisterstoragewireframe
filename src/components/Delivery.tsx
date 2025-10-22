import { useEffect, useState } from 'react';
import { Truck, Package, Clock, MapPin } from 'lucide-react';
import { useShippingZones } from '@/hooks/useShippingZones';

const Delivery = () => {
  const { zones, isLoading } = useShippingZones();
  const [displayZones, setDisplayZones] = useState<any[]>([]);

  useEffect(() => {
    if (zones && zones.length > 0) {
      // Get top 3 zones, prioritize enabled ones
      const activeZones = zones
        .filter(zone => zone.enabled)
        .slice(0, 3)
        .map(zone => {
          // Get the first rate for display
          const firstRate = zone.rates.find(r => r.enabled);
          
          return {
            id: zone.id,
            name: zone.name,
            description: zone.description || `Shipping to ${zone.name}`,
            rate: firstRate ? `$${firstRate.rate_amount.toFixed(2)}` : 'Contact us',
            timing: '2-5 Business Days',
            features: [
              firstRate ? `Flat rate: $${firstRate.rate_amount.toFixed(2)}` : 'Contact us',
              'Tracking included',
              'Insurance coverage'
            ],
          };
        });

      setDisplayZones(activeZones.length > 0 ? activeZones : [
        {
          id: 'default',
          name: 'Canada',
          description: 'Free shipping across Canada on all orders',
          rate: 'FREE SHIPPING',
          timing: '2-5 Business Days',
          features: ['Free shipping', 'Tracking included', 'Insurance coverage']
        }
      ]);
    }
  }, [zones]);

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <p className="text-muted-foreground">Loading shipping information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="text-center max-w-lg mx-auto mb-10 md:mb-12 px-4">
        <span className="text-primary font-medium">Shipping Info</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">Flexible Shipping Zones</h2>
        <p className="text-muted-foreground">
          We ship to multiple regions with competitive rates and fast delivery
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0 max-w-6xl mx-auto">
        {displayZones.map((zone) => (
          <div 
            key={zone.id} 
            className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border"
          >
            <div 
              className="h-32 flex items-center justify-center flex-col bg-primary"
            >
              <MapPin className="h-12 w-12 text-primary-foreground mb-2" />
              <span className="text-primary-foreground text-2xl font-bold">{zone.name}</span>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-primary mb-1">{zone.rate}</h3>
                <p className="text-sm text-muted-foreground">Flat Rate</p>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 text-center">{zone.description}</p>
              
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary mr-3" />
                  <span className="text-foreground text-sm font-medium">{zone.timing}</span>
                </div>
              </div>

              <div className="space-y-2">
                {zone.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <Package className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 px-4">
        <p className="text-muted-foreground text-sm">
          * Shipping rates are calculated at checkout based on your location. Free shipping thresholds may apply.
        </p>
      </div>
    </div>
  );
};

export default Delivery;
