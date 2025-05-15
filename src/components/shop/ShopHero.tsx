
import React from "react";

interface ShopHeroProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const ShopHero = ({ selectedCategory, setSelectedCategory, categories }: ShopHeroProps) => {
  return (
    <div className="relative pb-10 bg-pink-50">
      <div className="container-custom pt-10">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="font-bold text-3xl mb-4">Storage with Soul</h1>
          <p className="text-gray-700 text-center mx-auto mb-6">
            Discover storage that's designed for your bangles, jewelry, and keepsakes — made with the details that matter most to your cultural heritage.
          </p>
          <p className="text-sm text-pink-700 mb-6">
            Handcrafted with love, designed with intention.
          </p>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full capitalize transition-all ${
                selectedCategory === category
                  ? "bg-[#e90064] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-pink-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopHero;
