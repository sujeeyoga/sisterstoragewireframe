import { useState } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import Section from '@/components/layout/Section';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

const Gallery = () => {
  const [itemsToShow, setItemsToShow] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  // Gallery images from storage (optimized JPG versions)
  const galleryImages = [
    { id: 1, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.jpg", title: "Bangle Collection" },
    { id: 2, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/c44d4b5c-0104-4077-99dd-904d87ec4d8b.jpg", title: "Jewelry Organization" },
    { id: 3, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/56a20345-d9f3-47ac-a645-23d19194af78.jpg", title: "Instagram Inspiration" },
    { id: 4, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.jpg", title: "Social Showcase" },
    { id: 5, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/e1ae51b5-7916-4137-825e-7f197dff06a3.jpg", title: "Golden Treasures" },
    { id: 6, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/8620f7af-c089-458c-bef9-78d6cd77f04e.jpg", title: "Storage Solutions" },
    { id: 7, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/ce6528ec-56be-4176-919f-4285946c18b2.jpg", title: "Bangle Display" },
    { id: 8, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/160b5d30-ba2c-4e66-8423-c4a6288d1af0.jpg", title: "Friend Goals" },
    { id: 9, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/c6544fac-3f2f-4a6a-a01e-5ca149720fcb.jpg", title: "Jewelry Party" },
    { id: 10, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.jpg", title: "Golden Elegance" },
    { id: 11, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/e9628188-8ef0-426b-9858-08b2848fd690.jpg", title: "Sister Collection" },
    { id: 12, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/ff4988e3-c51c-4391-a440-95e03d111656.jpg", title: "Organized Beauty" },
    { id: 13, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/2a4c457a-7695-47d3-9912-ab2900c6ea25.jpg", title: "Bundle Collection" },
    { id: 14, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/76c5f6ac-f27b-4f26-8377-759dfc17c71d.jpg", title: "Travel Set" },
    { id: 15, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/b32a7860-b957-41e7-9c5c-cbd348260cf2.jpg", title: "Everyday Staples" },
    { id: 16, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/03cc68a5-5bfc-4417-bf01-d43578ffa321.jpg", title: "Forever Collection" },
    { id: 17, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/3e91b1f2-e5b6-4cee-a7b7-806a5815546b.jpg", title: "Premium Storage" },
    { id: 18, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/4ef08ea3-3380-4111-b4a1-eb939cba275b.jpg", title: "Luxury Box" },
    { id: 19, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.jpg", title: "Classic Design" },
    { id: 20, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/c3b682be-b949-4e16-8aff-82cc8e879642.jpg", title: "Modern Style" },
    { id: 21, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/e60a5afe-c0c9-4913-bf6a-eff94188c606.jpg", title: "Elegant Touch" },
    { id: 22, url: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/homepage/fb8da55a-c9bb-419e-a96f-175a667875e1.jpg", title: "Refined Beauty" }
  ];

  const filteredItems = galleryImages.slice(0, itemsToShow);
  const hasMoreItems = galleryImages.length > itemsToShow;

  const loadMore = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setItemsToShow(prev => prev + 12);
    setIsLoading(false);
  };

  return (
    <BaseLayout variant="standard" pageId="gallery" spacing="normal">
      <div className="focus:outline-none" tabIndex={-1}>
        <Section spacing="lg" width="contained" background="white">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Gallery Collection
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Discover our curated collection of premium storage solutions designed with intention and crafted for beauty.
            </motion.p>
          </div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence>
            {filteredItems.map((image, index) => (
              <motion.div
                key={image.id}
                className="relative overflow-hidden rounded-lg group cursor-pointer aspect-square"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: (index % 12) * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="w-full h-full">
                      <img 
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-semibold text-sm md:text-base">
                            {image.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-4xl">
                    <div className="w-full">
                      <img 
                        src={image.url}
                        alt={image.title}
                        className="w-full h-auto rounded-lg"
                      />
                      <h2 className="text-2xl font-bold text-foreground mt-4">
                        {image.title}
                      </h2>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {hasMoreItems && (
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              onClick={loadMore}
              disabled={isLoading}
              className="px-8 py-3 text-base"
              variant="outline"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                `Load More Photos (${galleryImages.length - itemsToShow} remaining)`
              )}
            </Button>
          </motion.div>
        )}

        </Section>
      </div>
    </BaseLayout>
  );
};

export default Gallery;
