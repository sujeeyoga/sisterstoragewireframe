
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const instagramPosts = [
  {
    id: 1,
    color: "#E90064",
    username: "priya_organized",
    likes: 456
  },
  {
    id: 2,
    color: "#FF8021",
    username: "meera_styles",
    likes: 389
  },
  {
    id: 3,
    color: "#FFDCBD",
    username: "anjali_decor",
    likes: 512
  },
  {
    id: 4,
    color: "#FE5FA2",
    username: "rani_jewels",
    likes: 347
  }
];

const InstagramUGC = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-[#E90064] font-medium">Community</span>
          <h2 className="font-bold mt-2 mb-4">Styled By Our Sisters</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            See how our community celebrates organizing with culture, color, and love.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {instagramPosts.map((post) => (
            <div 
              key={post.id} 
              className="relative group overflow-hidden rounded-lg aspect-square"
              style={{ backgroundColor: post.color }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white font-bold">Sister Storage</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white font-medium mb-2">@{post.username}</span>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-white text-sm">{post.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button size="lg">
            <Instagram className="mr-2 h-5 w-5" />
            Follow Us on Instagram
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstagramUGC;
