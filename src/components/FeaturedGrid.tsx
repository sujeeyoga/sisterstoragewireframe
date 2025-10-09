import React, { useState, useEffect } from 'react';
import FeaturedGridItem from './FeaturedGridItem';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useViewportHeight } from '@/hooks/use-viewport-height';

const gridItems = [
  // Row 1
  {
    id: 1,
    image: "/lovable-uploads/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png",
    title: "Bangle Collection",
    span: "horizontal"
  },
  {
    id: 2,
    image: "/lovable-uploads/c44d4b5c-0104-4077-99dd-904d87ec4d8b.png",
    title: "Jewelry Organization",
    span: "normal"
  },
  {
    id: 3,
    image: "/lovable-uploads/56a20345-d9f3-47ac-a645-23d19194af78.png",
    title: "Instagram Inspiration",
    span: "vertical"
  },
  // Row 2
  {
    id: 4,
    image: "/lovable-uploads/f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.png",
    title: "Social Showcase",
    span: "normal"
  },
  {
    id: 5,
    image: "/lovable-uploads/e1ae51b5-7916-4137-825e-7f197dff06a3.png",
    title: "Golden Treasures",
    span: "normal"
  },
  {
    id: 6,
    image: "/lovable-uploads/8620f7af-c089-458c-bef9-78d6cd77f04e.png",
    title: "Storage Solutions",
    span: "normal"
  },
  // Row 3
  {
    id: 7,
    image: "/lovable-uploads/ce6528ec-56be-4176-919f-4285946c18b2.png",
    title: "Bangle Display",
    span: "vertical"
  },
  {
    id: 8,
    image: "/lovable-uploads/160b5d30-ba2c-4e66-8423-c4a6288d1af0.png",
    title: "Friend Goals",
    span: "horizontal"
  },
  {
    id: 9,
    image: "/lovable-uploads/c6544fac-3f2f-4a6a-a01e-5ca149720fcb.png",
    title: "Jewelry Party",
    span: "normal"
  },
  // Row 4
  {
    id: 10,
    image: "/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png",
    title: "Golden Elegance",
    span: "normal"
  },
  {
    id: 11,
    image: "/lovable-uploads/e9628188-8ef0-426b-9858-08b2848fd690.png",
    title: "Sister Collection",
    span: "normal"
  },
  {
    id: 12,
    image: "/lovable-uploads/fb8da55a-c9bb-419e-a96f-175a667875e1.png",
    title: "Organized Beauty",
    span: "normal"
  }
];
const FeaturedGrid = () => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  useViewportHeight();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!selectedImage) return;
    
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [selectedImage]);

  return (
    <>
      <div className="w-full px-4 md:px-8 py-12 md:py-16">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-thin font-poppins tracking-wide mb-3 uppercase">SUMMER END ORGANIZATION</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of storage solutions designed for the modern sister.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full auto-rows-[200px]">
        {gridItems.map((item) => (
          <FeaturedGridItem
            key={item.id}
            image={item.image}
            title={item.title}
            span={item.span as "normal" | "horizontal" | "vertical"}
            onClick={() => setSelectedImage({ url: item.image, title: item.title })}
          />
        ))}
      </div>
    </div>

    {/* Lightbox Modal */}
    <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
      <DialogContent 
        className="fixed inset-0 left-0 top-0 translate-x-0 translate-y-0 z-[60] w-screen h-screen max-w-none m-0 p-0 rounded-none border-0 bg-black/95 flex items-center justify-center"
        aria-describedby="lightbox-description"
      >
        <span id="lightbox-description" className="sr-only">
          Full size image viewer
        </span>
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-4 right-4 z-[70] p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close lightbox"
        >
          <X className="h-6 w-6 text-white" />
        </button>
        {selectedImage && (
          <img
            src={selectedImage.url}
            alt={selectedImage.title}
            className="max-w-[95vw] max-h-[calc(var(--vh,1vh)*95)] w-auto h-auto object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  </>
);
};
export default FeaturedGrid;