import PerformanceImage from '@/components/ui/performance-image';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const OrganizationGallery = () => {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const galleryImages = [
    {
      src: '/lovable-uploads/e1ae51b5-7916-4137-825e-7f197dff06a3.png',
      alt: 'Organized jewelry display with bangles'
    },
    {
      src: '/lovable-uploads/2a4c457a-7695-47d3-9912-ab2900c6ea25.png',
      alt: 'Elegant jewelry storage solution'
    },
    {
      src: '/lovable-uploads/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png',
      alt: 'Sister Storage product showcase'
    }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 tracking-tight leading-tight">
            ORGANIZATION MADE <span className="text-[hsl(var(--brand-pink))]">BEAUTIFUL</span>
          </h2>
          <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            See how our storage solutions transform your space
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center max-w-[2304px] mx-auto px-5">
          {/* First Image */}
          <div 
            onClick={() => navigate('/shop')}
            className="relative w-full aspect-square rounded-3xl shadow-lg md:hover:shadow-2xl transition-shadow duration-300 group overflow-hidden animate-fade-in cursor-pointer"
          >
            {!loadedImages[0] && (
              <Skeleton className="absolute inset-0" />
            )}
            <PerformanceImage
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              className="w-full h-full object-cover block md:group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              onLoad={() => setLoadedImages(prev => ({ ...prev, 0: true }))}
            />
          </div>

          {/* Second Image */}
          <div 
            onClick={() => navigate('/shop')}
            className="relative w-full aspect-[3/4] rounded-3xl shadow-lg md:hover:shadow-2xl transition-shadow duration-300 group overflow-hidden animate-fade-in cursor-pointer"
          >
            {!loadedImages[1] && (
              <Skeleton className="absolute inset-0" />
            )}
            <PerformanceImage
              src={galleryImages[1].src}
              alt={galleryImages[1].alt}
              className="w-full h-full object-cover block md:group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              onLoad={() => setLoadedImages(prev => ({ ...prev, 1: true }))}
          />
          </div>

          {/* Third Image */}
          <div 
            onClick={() => navigate('/shop')}
            className="relative w-full aspect-square rounded-3xl shadow-lg md:hover:shadow-2xl transition-shadow duration-300 group overflow-hidden animate-fade-in cursor-pointer"
          >
            {!loadedImages[2] && (
              <Skeleton className="absolute inset-0" />
            )}
            <PerformanceImage
              src={galleryImages[2].src}
              alt={galleryImages[2].alt}
              className="w-full h-full object-cover block md:group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              onLoad={() => setLoadedImages(prev => ({ ...prev, 2: true }))}
            />
            {/* Instagram Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 md:group-hover:bg-black/30 transition-colors duration-300">
              <svg
                className="w-24 h-24 md:w-40 md:h-40 text-white drop-shadow-2xl md:group-hover:scale-110 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationGallery;
