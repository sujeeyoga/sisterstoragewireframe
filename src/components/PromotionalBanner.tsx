import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useSiteTexts } from '@/hooks/useSiteTexts';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';

const PromotionalBanner = () => {
  const { texts, isLoading } = useSiteTexts('promotional_banner');
  
  if (isLoading || !texts) return null;
  
  const bannerText = texts as any;
  
  return (
    <section className="py-16 md:py-20 bg-[hsl(var(--brand-pink))]">
      <div className="container-custom">
        <Card className="overflow-hidden border-none shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-10 md:py-14 px-8 md:px-12 lg:px-14 bg-white">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8 pl-4 md:pl-48 lg:pl-64">
              <EditableText
                siteTextId={bannerText.id}
                field="title"
                value={bannerText.title}
                as="h2"
                className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-[1.1] tracking-tight"
              />
              
              <EditableText
                siteTextId={bannerText.id}
                field="description"
                value={bannerText.description}
                as="p"
                className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
              />
              
              <Link to="/shop" className="block mt-4">
                <Button 
                  size="lg"
                  className="bg-[hsl(var(--brand-pink))] text-white hover:bg-[hsl(var(--brand-pink))]/90 hover:scale-105 font-bold px-8 py-6 shadow-lg transition-all duration-300"
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
            <div className="relative h-[400px] lg:h-[500px] -mr-8 md:-mr-12 lg:-mr-14">
              <EditableImage
                src="https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/1760125164235-26m74b.jpg"
                alt="Sister Storage organized jewelry display"
                className="w-full h-full object-cover rounded-l-2xl shadow-lg"
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PromotionalBanner;
