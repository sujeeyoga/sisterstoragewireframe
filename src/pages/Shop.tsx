
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
      
      {/* Products Grid - Pinterest Style */}
      <div className="bg-white py-12">
        <div className="container-custom">
          <ProductsGrid products={filteredProducts} />
          
          <div className="mt-10 flex justify-center">
            <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
              Load more
            </button>
          </div>
          
          <BenefitsSection benefits={benefits} />
          
          <TestimonialSection />
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
