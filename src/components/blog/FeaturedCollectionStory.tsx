
import React from "react";
import { Button } from "@/components/ui/button";

interface Collection {
  id: string;
  title: string;
  description: string;
  color: string;
  slug: string;
  textDark?: boolean;
}

interface FeaturedCollectionStoryProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  collections: Collection[];
}

const FeaturedCollectionStory = ({ 
  selectedCategory, 
  setSelectedCategory, 
  collections 
}: FeaturedCollectionStoryProps) => {
  // Only show if a collection is selected
  if (selectedCategory === "All" || !collections.find(c => c.title === selectedCategory)) {
    return null;
  }

  return (
    <div className="bg-[#F4F4F4] py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            {(() => {
              const collection = collections.find(c => c.title === selectedCategory);
              return collection ? (
                <div className="rounded-lg overflow-hidden">
                  <div 
                    style={{ backgroundColor: collection.color }} 
                    className="aspect-square flex flex-col items-center justify-center p-8 text-center"
                  >
                    <h2 className={`text-3xl font-bold mb-4 ${collection.textDark ? "text-gray-800" : "text-white"}`}>
                      {collection.title}
                    </h2>
                    <p className={`${collection.textDark ? "text-gray-700" : "text-white"}`}>
                      {collection.description}
                    </p>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-2xl font-bold mb-3">Featured Stories</h3>
            <p className="text-gray-600 mb-6">
              Explore our curated collection of articles, tips, and stories related to {selectedCategory}.
            </p>
            <Button 
              onClick={() => setSelectedCategory("All")} 
              className="bg-[#E90064] hover:bg-[#FE5FA4]"
            >
              Back to All Categories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollectionStory;
