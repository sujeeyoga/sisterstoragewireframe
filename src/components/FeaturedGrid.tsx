import React from 'react';
import FeaturedGridItem from './FeaturedGridItem';
const gridItems = [
  {
    id: 1,
    image: "/lovable-uploads/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png",
    title: "Bangle Collection"
  },
  {
    id: 2,
    image: "/lovable-uploads/c44d4b5c-0104-4077-99dd-904d87ec4d8b.png",
    title: "Jewelry Organization"
  },
  {
    id: 3,
    image: "/lovable-uploads/56a20345-d9f3-47ac-a645-23d19194af78.png",
    title: "Instagram Inspiration"
  },
  {
    id: 4,
    image: "/lovable-uploads/f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.png",
    title: "Social Showcase"
  }
];
const FeaturedGrid = () => {
  return <div className="w-full" style={{ contain: 'layout paint' }}>
      <div className="text-center mb-6 md:mb-8 px-4">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-thin font-poppins tracking-wide mb-3 uppercase">SUMMER END ORGANIZATION</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of storage solutions designed for the modern sister.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
        {gridItems.map((item) => (
          <FeaturedGridItem
            key={item.id}
            image={item.image}
            title={item.title}
            span="normal"
          />
        ))}
      </div>
    </div>;
};
export default FeaturedGrid;