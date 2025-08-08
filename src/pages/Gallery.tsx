import React, { useState } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import Section from '@/components/layout/Section';
import { products } from '@/data/products';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [itemsToShow, setItemsToShow] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  // Create expanded gallery items (duplicate products for demo)
  const expandedProducts = [
    ...products,
    ...products.map(p => ({ ...p, id: `${p.id}_dup`, name: `${p.name} Collection` })),
    ...products.slice(0, 3).map(p => ({ ...p, id: `${p.id}_ext`, name: `${p.name} Premium` }))
  ];

  const filteredItems = selectedCategory === 'all' 
    ? expandedProducts.slice(0, itemsToShow)
    : expandedProducts.filter(product => product.category === selectedCategory).slice(0, itemsToShow);

  const hasMoreItems = (selectedCategory === 'all' ? expandedProducts.length : expandedProducts.filter(product => product.category === selectedCategory).length) > itemsToShow;

  const categories = ['all', 'bangles', 'jewelry', 'keepsakes'];

  const loadMore = async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setItemsToShow(prev => prev + 5);
    setIsLoading(false);
  };

  const getGridClass = (index: number) => {
    const position = index % 5;
    const gridClasses = [
      'col-span-1 row-span-1', // box1
      'col-span-1 row-span-1', // box2  
      'col-span-1 row-span-1', // box3
      'col-span-2 row-span-1', // box4
      'col-span-1 row-span-1', // box5
    ];
    return gridClasses[position];
  };

  return (
    <BaseLayout variant="standard" pageId="gallery" spacing="normal">
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

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          className="gallery-grid grid grid-cols-3 gap-2.5 w-[min(1100px,92%)] mx-auto"
          style={{ gridTemplateRows: `repeat(${Math.ceil(filteredItems.length / 5) * 2}, 200px)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence>
            {filteredItems.map((product, index) => {
              return (
                <motion.div
                  key={`${selectedCategory}-${product.id}`}
                  className={`${getGridClass(index)} relative overflow-hidden rounded-md group cursor-pointer`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="w-full h-full">
                        <div 
                          className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden"
                          style={{ backgroundColor: `${product.color}15` }}
                        >
                          <div 
                            className="absolute inset-0 opacity-20"
                            style={{ backgroundColor: product.color }}
                          />
                          
                          {/* Product Info Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-white font-semibold text-sm md:text-base mb-1">
                                {product.name}
                              </h3>
                              <p className="text-white/80 text-xs md:text-sm line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-white font-bold text-sm md:text-base">
                                  ${product.price}
                                </span>
                                <div className="flex gap-1">
                                  {product.bestSeller && (
                                    <Badge variant="secondary" className="text-xs">
                                      Best Seller
                                    </Badge>
                                  )}
                                  {product.newArrival && (
                                    <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                                      New
                                    </Badge>
                                  )}
                                  {product.limitedEdition && (
                                    <Badge variant="destructive" className="text-xs">
                                      Limited
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Decorative Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-current" />
                            <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full border border-current" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-current rounded-lg rotate-45" />
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-4xl">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div 
                          className="aspect-square rounded-lg"
                          style={{ backgroundColor: `${product.color}15` }}
                        >
                          <div 
                            className="w-full h-full rounded-lg relative"
                            style={{ backgroundColor: product.color, opacity: 0.1 }}
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                              {product.name}
                            </h2>
                            <p className="text-muted-foreground">
                              {product.description}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-3xl font-bold text-foreground">
                              ${product.price}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Material: {product.material}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Stock: {product.stock} available
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold text-foreground">Features:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {product.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-2 pt-4">
                            {product.bestSeller && (
                              <Badge variant="secondary">Best Seller</Badge>
                            )}
                            {product.newArrival && (
                              <Badge variant="outline">New Arrival</Badge>
                            )}
                            {product.limitedEdition && (
                              <Badge variant="destructive">Limited Edition</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              );
            })}
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
                `Load More Photos (${(selectedCategory === 'all' ? expandedProducts.length : expandedProducts.filter(product => product.category === selectedCategory).length) - itemsToShow} remaining)`
              )}
            </Button>
          </motion.div>
        )}

        {/* Mobile Responsive Grid */}
        <style>{`
          @media (max-width: 768px) {
            .gallery-grid {
              display: grid !important;
              grid-template-columns: 1fr !important;
              grid-template-rows: auto !important;
              height: auto !important;
            }
            
            .gallery-grid > div {
              grid-column: auto !important;
              grid-row: auto !important;
              height: 200px !important;
            }
          }
        `}</style>
      </Section>
    </BaseLayout>
  );
};

export default Gallery;