import React from 'react';
import FeaturedGridItem from './FeaturedGridItem';
const gridItems = [
// Row 1 - Start with normal normal
{
  id: 1,
  image: "/lovable-uploads/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png",
  title: "Bangle Collection",
  span: "normal"
}, {
  id: 2,
  image: "/lovable-uploads/c44d4b5c-0104-4077-99dd-904d87ec4d8b.png",
  title: "Jewelry Organization",
  span: "normal"
},
// Row 2
{
  id: 3,
  image: "/lovable-uploads/e9628188-8ef0-426b-9858-08b2848fd690.png",
  title: "Sister Collection",
  span: "horizontal"
},
// Row 3
{
  id: 4,
  image: "/lovable-uploads/56a20345-d9f3-47ac-a645-23d19194af78.png",
  title: "Instagram Inspiration",
  span: "vertical"
}, {
  id: 5,
  image: "/lovable-uploads/f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.png",
  title: "Social Showcase",
  span: "normal"
}, {
  id: 6,
  image: "/lovable-uploads/e1ae51b5-7916-4137-825e-7f197dff06a3.png",
  title: "Golden Treasures",
  span: "normal"
},
// Row 4
{
  id: 7,
  image: "/lovable-uploads/8620f7af-c089-458c-bef9-78d6cd77f04e.png",
  title: "Storage Solutions",
  span: "normal"
}, {
  id: 8,
  image: "/lovable-uploads/ce6528ec-56be-4176-919f-4285946c18b2.png",
  title: "Bangle Display",
  span: "normal"
},
// Row 5
{
  id: 9,
  image: "/lovable-uploads/160b5d30-ba2c-4e66-8423-c4a6288d1af0.png",
  title: "Friend Goals",
  span: "horizontal"
},
// Row 6 - End with normal normal
{
  id: 10,
  image: "/lovable-uploads/c6544fac-3f2f-4a6a-a01e-5ca149720fcb.png",
  title: "Jewelry Party",
  span: "normal"
}, {
  id: 11,
  image: "/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png",
  title: "Golden Elegance",
  span: "normal"
}];
const FeaturedGrid = () => {
  return <div className="w-full" style={{ contain: 'layout paint' }}>
      <div className="text-center mb-8 md:mb-12 px-4">
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-thin font-poppins tracking-wide mb-4 uppercase">SUMMER END ORGANIZATION</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of storage solutions designed for the modern sister.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-0 w-full auto-rows-min">
        {gridItems.map((item, index) => (
          <FeaturedGridItem
            key={item.id}
            image={item.image}
            title={item.title}
            span={item.span as 'normal' | 'horizontal' | 'vertical'}
            delay={index * 200}
          />
        ))}
      </div>
    </div>;
};
export default FeaturedGrid;