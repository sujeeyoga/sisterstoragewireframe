
import React from "react";

interface BlogHeroProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const BlogHero = ({ selectedCategory, setSelectedCategory, categories }: BlogHeroProps) => {
  return (
    <div className="relative pb-16 bg-[#F4F4F4]">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Organization & Inspiration</h1>
        <p className="text-gray-700 text-center max-w-2xl mx-auto mb-10">
          Tips, strategies, and inspiration to help you create beautifully organized spaces that bring joy to your everyday life.
        </p>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === category
                  ? "bg-[#E90064] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-[#FE5FA4] hover:text-white hover:border-[#FE5FA4]"
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

export default BlogHero;
