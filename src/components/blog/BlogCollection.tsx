
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Collection {
  id: string;
  title: string;
  description: string;
  color: string;
  slug: string;
  textDark?: boolean;
}

interface BlogCollectionProps {
  collections: Collection[];
  setSelectedCategory: (category: string) => void;
}

const BlogCollection = ({ collections, setSelectedCategory }: BlogCollectionProps) => {
  const [showAllCollections, setShowAllCollections] = useState(false);
  
  // Determine which collections to display
  const displayedCollections = showAllCollections ? collections : collections.slice(0, 6);

  return (
    <div className="bg-white py-16 border-b border-gray-100">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-3">Sister Collections</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
          Explore our culturally inspired collections, featuring stories and organization tips that celebrate our heritage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          {displayedCollections.map((collection) => (
            <div 
              key={collection.id}
              className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] cursor-pointer"
              onClick={() => setSelectedCategory(collection.title)}
            >
              <div 
                style={{ backgroundColor: collection.color }} 
                className="p-8 flex flex-col justify-between h-48"
              >
                <h3 className={`text-xl font-bold ${collection.textDark ? "text-gray-800" : "text-white"}`}>
                  {collection.title}
                </h3>
                <p className={`text-sm mt-2 ${collection.textDark ? "text-gray-700" : "text-white"}`}>
                  {collection.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {collections.length > 6 && (
          <div className="text-center">
            <Button 
              onClick={() => setShowAllCollections(!showAllCollections)}
              variant="secondary"
              className="inline-flex items-center gap-2"
            >
              {showAllCollections ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show All Collections <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCollection;
