import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const PromotionalBanner = () => {
  return (
    <section className="py-12 md:py-16 bg-[hsl(var(--brand-pink))]">
      <div className="container-custom">
        <Card className="overflow-hidden border-none shadow-xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center p-8 md:p-12 bg-white">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                YOUR JEWELS<br />
                DESERVE BETTER<br />
                SIS.
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Stop letting your precious jewelry tangle in drawers. Our thoughtfully designed storage solutions keep everything organized, protected, and easy to find.
              </p>
              
              <Link to="/shop">
                <Button 
                  size="lg"
                  className="bg-[hsl(var(--brand-pink))] text-white hover:bg-[hsl(var(--brand-pink))]/90 font-bold px-8"
                >
                  DISCOVER OUR COLLECTIONS
                </Button>
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative h-[300px] lg:h-[400px]">
              <img
                src="/lovable-uploads/c44d4b5c-0104-4077-99dd-904d87ec4d8b.png"
                alt="Sister Storage organized jewelry display"
                className="w-full h-full object-cover rounded-lg shadow-md"
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
