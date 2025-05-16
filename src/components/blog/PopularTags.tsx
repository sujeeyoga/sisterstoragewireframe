
import React from "react";

interface Collection {
  id: string;
  title: string;
  description: string;
  color: string;
  slug: string;
  textDark?: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  color: string;
  readingTime: string;
  difficulty: string;
}

interface PopularTagsProps {
  blogPosts: BlogPost[];
  collections: Collection[];
  setSelectedCategory: (category: string) => void;
}

const PopularTags = ({ blogPosts, collections, setSelectedCategory }: PopularTagsProps) => {
  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-6">Popular Tags</h2>
      <div className="flex flex-wrap gap-2">
        {Array.from(new Set([...blogPosts.map(post => post.category), ...collections.map(c => c.title)])).map((category) => {
          // Find a post with this category to get the color or use collection color
          const categoryPost = blogPosts.find(post => post.category === category);
          const categoryCollection = collections.find(c => c.title === category);
          const color = categoryCollection ? categoryCollection.color : 
                      categoryPost ? categoryPost.color : "#E90064";
          const textDark = categoryCollection?.textDark;
          
          return (
            <span
              key={category}
              style={{ backgroundColor: color }}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${textDark ? "text-gray-800" : "text-white"}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PopularTags;
