
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ShopHero from "@/components/shop/ShopHero";
import ProductsGrid from "@/components/shop/ProductsGrid";
import BenefitsSection from "@/components/shop/BenefitsSection";
import TestimonialSection from "@/components/shop/TestimonialSection";
import { products, categories, benefits } from "@/data/products";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <Layout>
      <ShopHero 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />
      
      {/* Products Grid */}
      <div className="bg-white py-12">
        <div className="container-custom">
          <ProductsGrid products={filteredProducts} />
          
          <BenefitsSection benefits={benefits} />
          
          <TestimonialSection />
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
