import { Button } from '@/components/ui/button';
import { ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromotionalSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Sale Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-lg border border-gray-200">
          <div className="flex flex-col lg:flex-row">
            {/* Content Side */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[hsl(var(--brand-pink))] text-white px-4 py-2 rounded-full mb-6 w-fit">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-bold tracking-wide">LIMITED TIME OFFER</span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                Summer End<br />
                <span className="text-[hsl(var(--brand-pink))]">Sale</span>
              </h2>

              {/* Discount */}
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-[hsl(var(--brand-orange)/0.1)] text-[hsl(var(--brand-orange))] px-6 py-3 rounded-full">
                  <span className="text-2xl font-black">20% OFF</span>
                </div>
                <p className="text-gray-600 text-lg">Everything Store-Wide</p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90 text-white px-8 py-6 text-lg font-bold"
                  asChild
                >
                  <Link to="/shop" className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Shop Now</span>
                  </Link>
                </Button>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[hsl(var(--brand-pink))] rounded-full" />
                  <span>Free shipping on orders $75+</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[hsl(var(--brand-orange))] rounded-full" />
                  <span>Ends September 30th</span>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className="flex-1 relative min-h-[300px] lg:min-h-[500px] p-8" style={{ backgroundColor: '#FCF2FB' }}>
              <img 
                src="/lovable-uploads/ff4988e3-c51c-4391-a440-95e03d111656.png" 
                alt="Sister Storage organized jewelry collection"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalSection;