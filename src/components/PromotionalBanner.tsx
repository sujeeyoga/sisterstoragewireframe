import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const PromotionalBanner = () => {
  return (
    <section className="py-16 md:py-20 bg-[hsl(var(--brand-pink))]">
      <div className="container-custom">
        <Card className="overflow-hidden border-none shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-10 md:p-14 bg-white">
            {/* Left Content */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
                YOUR JEWELS<br />
                DESERVE BETTER<br />
                SIS.
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Stop letting your precious jewelry tangle in drawers. Our thoughtfully designed storage solutions keep everything organized, protected, and easy to find.
              </p>
              
              <Link to="/shop">
                <Button 
                  size="lg"
                  className="bg-[hsl(var(--brand-pink))] text-white hover:bg-[hsl(var(--brand-pink))]/90 hover:scale-105 font-bold px-8 py-6 shadow-lg transition-all duration-300"
                >
                  DISCOVER OUR COLLECTIONS
                </Button>
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative h-[320px] lg:h-[450px]">
              <img
                src="/lovable-uploads/c44d4b5c-0104-4077-99dd-904d87ec4d8b.png"
                alt="Sister Storage organized jewelry display"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PromotionalBanner;
