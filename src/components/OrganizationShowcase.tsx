import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const OrganizationShowcase = () => {
  const showcaseItems = [
    {
      id: 1,
      image: '/lovable-uploads/open-box-bangle-4rod.jpg',
      title: 'Bangle Organization'
    },
    {
      id: 2,
      image: '/lovable-uploads/medium-bangle-2rod-final.jpg',
      title: 'Compact Storage'
    },
    {
      id: 3,
      image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/optimized/shop-hero.jpg',
      title: 'Complete Collection'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 uppercase tracking-wide">
            Organization Made Beautiful
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            See how our storage solutions transform your space
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {showcaseItems.map((item) => (
            <Link key={item.id} to="/shop" className="group">
              <Card className="overflow-hidden border-2 border-gray-100 hover:border-[hsl(var(--brand-pink))] transition-all duration-300 hover:shadow-xl">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-sm">Shop Now →</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizationShowcase;
