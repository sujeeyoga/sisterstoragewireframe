import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSiteTexts } from '@/hooks/useSiteTexts';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';
import { Skeleton } from '@/components/ui/skeleton';

const PromotionalBanner = () => {
  const { texts, isLoading } = useSiteTexts('promotional_banner');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  if (isLoading || !texts) return null;
  
  const bannerText = texts as any;
  
  return (
    <section className="py-20 md:py-24 bg-[hsl(var(--brand-pink))]">
      <div className="container-custom">
        <Card className="overflow-hidden border-none shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0 items-center bg-white">
            {/* Left Content */}
            <div className="space-y-8 lg:space-y-10 px-8 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
              <EditableText
                siteTextId={bannerText.id}
                field="title"
                value={bannerText.title}
                as="h2"
                className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.05] tracking-tight"
              />
              
              <EditableText
                siteTextId={bannerText.id}
                field="description"
                value={bannerText.description}
                as="p"
                className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl"
              />
              
              <Link to="/shop" className="inline-block">
                <Button 
                  size="lg"
                  className="bg-[hsl(var(--brand-pink))] text-white hover:bg-[hsl(var(--brand-pink))]/90 hover:scale-105 font-bold text-base lg:text-lg px-10 py-7 shadow-xl transition-all duration-300"
                >
                  <EditableText
                    siteTextId={bannerText.id}
                    field="button_text"
                    value={bannerText.button_text}
                    as="span"
                  />
                </Button>
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative h-[450px] lg:h-[600px]">
              {!imageLoaded && (
                <Skeleton className="absolute inset-0" />
              )}
              <img
                src="https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/1760125164235-26m74b.jpg"
                alt="Sister Storage organized jewelry display"
                className="w-full h-full object-cover shadow-lg"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PromotionalBanner;
