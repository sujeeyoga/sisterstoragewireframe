
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  featured?: boolean;
  trending?: boolean;
  editorsPick?: boolean;
  mostShared?: boolean;
}

interface BlogPostCardProps {
  post: BlogPost;
  difficultyColors: Record<string, string>;
}

const BlogPostCard = ({ post, difficultyColors }: BlogPostCardProps) => {
  return (
    <div key={post.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="overflow-hidden h-48">
        <div 
          style={{ backgroundColor: post.color }} 
          className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform duration-500"
        >
          <span className="text-white text-sm font-bold">Sister Storage</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-3 py-1 bg-[#FE5FA4] text-white rounded-full text-xs font-medium">
            {post.category}
          </span>
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: difficultyColors[post.difficulty] }}
            >
              {post.difficulty}
            </span>
            <span className="text-xs text-gray-600">
              {post.readingTime}
            </span>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">
            By {post.author} • {post.date}
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link to={`/blog/${post.id}`}>Read More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
