import React from 'react';
import FeaturedGridItem from './FeaturedGridItem';
import { supabase } from '@/integrations/supabase/client';
const getStorageUrl = (filename: string) => 
  supabase.storage.from('images').getPublicUrl(`hero-images/${filename}`).data.publicUrl;

const gridItems = [
  // Row 1
  {
    id: 1,
    image: getStorageUrl("0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png"),
    title: "Bangle Collection",
    span: "horizontal"
  },
  {
    id: 2,
    image: getStorageUrl("c44d4b5c-0104-4077-99dd-904d87ec4d8b.png"),
    title: "Jewelry Organization",
    span: "normal"
  },
  {
    id: 3,
    image: getStorageUrl("56a20345-d9f3-47ac-a645-23d19194af78.png"),
    title: "Instagram Inspiration",
    span: "vertical"
  },
  // Row 2
  {
    id: 4,
    image: getStorageUrl("f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.png"),
    title: "Social Showcase",
    span: "normal"
  },
  {
    id: 5,
    image: getStorageUrl("e1ae51b5-7916-4137-825e-7f197dff06a3.png"),
    title: "Golden Treasures",
    span: "normal"
  },
  {
    id: 6,
    image: getStorageUrl("8620f7af-c089-458c-bef9-78d6cd77f04e.png"),
    title: "Storage Solutions",
    span: "normal"
  },
  // Row 3
  {
    id: 7,
    image: getStorageUrl("ce6528ec-56be-4176-919f-4285946c18b2.png"),
    title: "Bangle Display",
    span: "vertical"
  },
  {
    id: 8,
    image: getStorageUrl("160b5d30-ba2c-4e66-8423-c4a6288d1af0.png"),
    title: "Friend Goals",
    span: "horizontal"
  },
  {
    id: 9,
    image: getStorageUrl("c6544fac-3f2f-4a6a-a01e-5ca149720fcb.png"),
    title: "Jewelry Party",
    span: "normal"
  },
  // Row 4
  {
    id: 10,
    image: getStorageUrl("b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png"),
    title: "Golden Elegance",
    span: "normal"
  },
  {
    id: 11,
    image: getStorageUrl("e9628188-8ef0-426b-9858-08b2848fd690.png"),
    title: "Sister Collection",
    span: "normal"
  },
  {
    id: 12,
    image: getStorageUrl("fb8da55a-c9bb-419e-a96f-175a667875e1.png"),
    title: "Organized Beauty",
    span: "normal"
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
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full auto-rows-[200px]">
        {gridItems.map((item) => (
          <FeaturedGridItem
            key={item.id}
            image={item.image}
            title={item.title}
            span={item.span as "normal" | "horizontal" | "vertical"}
          />
        ))}
      </div>
    </div>;
};
export default FeaturedGrid;