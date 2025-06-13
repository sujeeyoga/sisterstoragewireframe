
import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import AnimatedText from '@/components/ui/animated-text';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  link: string;
  title: string;
}

interface MobileGalleryProps {
  items: GalleryItem[];
}

const MobileGallery: React.FC<MobileGalleryProps> = ({ items }) => {
  // Separate hero item (first item) from gallery items
  const heroItem = items[0];
  const galleryItems = items.slice(1);

  return (
    <div className="w-full space-y-8">
      {/* Hero Section - contained */}
      {heroItem && (
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedText
            as="div"
            className="w-full"
            animation="breath-fade-up-1"
            container
          >
            <Link to={heroItem.link} className="group block">
              <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={heroItem.src}
                  alt={heroItem.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-xl md:text-2xl font-bold font-poppins">{heroItem.title}</h3>
                </div>
              </div>
            </Link>
          </AnimatedText>
        </div>
      )}

      {/* Edge-to-Edge Horizontal Scrolling Gallery */}
      <AnimatedText
        as="div"
        className="w-full"
        animation="breath-fade-up-2"
        container
      >
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="gap-1">
            {galleryItems.map((item) => (
              <CarouselItem key={item.id} className="basis-4/5 md:basis-1/2 lg:basis-1/3">
                <Link to={item.link} className="group block">
                  <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h4 className="text-sm md:text-base font-semibold font-poppins">{item.title}</h4>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation arrows - hidden on mobile, visible on larger screens */}
          <div className="hidden md:block">
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </div>
        </Carousel>
      </AnimatedText>
    </div>
  );
};

export default MobileGallery;
