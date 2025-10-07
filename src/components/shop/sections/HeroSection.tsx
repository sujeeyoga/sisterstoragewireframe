import React from "react";
import ShopHeroProduct from "@/components/shop/ShopHeroProduct";

interface HeroProductContent {
  qty: number;
  label: string;
  rodsEach: number;
  detail: string;
}

interface HeroProduct {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  compareAt?: number;
  ratingCount: number;
  image: string;
  badge: string;
  contents: HeroProductContent[];
}

interface HeroSectionProps {
  product: HeroProduct;
}

const HeroSection: React.FC<HeroSectionProps> = ({ product }) => {
  return (
    <section className="hero-section">
      <ShopHeroProduct product={product} />
    </section>
  );
};

export default HeroSection;
