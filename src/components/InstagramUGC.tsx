
import React from 'react';
import { Instagram, Heart, MessageCircle, Share, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const instagramPosts = [
  {
    id: 1,
    color: "#E90064",
    username: "priya_organized",
    likes: 2847,
    image: "https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-27-scaled.jpg",
    caption: "POV: Your jewelry collection finally has a home that honors your heritage ✨💍",
    isReel: true
  },
  {
    id: 2,
    color: "#FF8021", 
    username: "meera_styles",
    likes: 1923,
    image: "https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-23-scaled.jpg",
    caption: "Watch me transform my chaotic vanity into organized bliss 🔄💫",
    isReel: true
  },
  {
    id: 3,
    color: "#FFDCBD",
    username: "anjali_decor",
    likes: 3156,
    image: "https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-31-scaled.jpg",
    caption: "The satisfying sound of organizing with Sister Storage 🎵✨",
    isReel: true
  },
  {
    id: 4,
    color: "#FE5FA2",
    username: "rani_jewels", 
    likes: 2634,
    image: "https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-13-scaled.jpg",
    caption: "Get ready with me but make it ✨organized✨ #GRWM",
    isReel: true
  }
];

const InstagramUGC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 bg-[#E90064] text-white text-sm font-bold rounded-full mb-4">
            Community Stories
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mt-2 mb-6 leading-tight">
            STYLED BY OUR<br />
            <span className="text-[#E90064]">SISTERS</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            See how our community celebrates organizing with culture, color, and love. 
            Real homes, real sisters, real style.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          {instagramPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Post Image */}
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={post.image}
                  alt={`Sister Storage styled by @${post.username}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 
                 {/* Reel Play Button */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                   <div className="bg-black/40 backdrop-blur-sm rounded-full p-3 group-hover:bg-black/60 transition-colors">
                     <Play className="h-6 w-6 text-white fill-white" />
                   </div>
                 </div>
                 
                 {/* Reel Label */}
                 <div className="absolute top-3 right-3">
                   <div className="bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                     <Play className="h-3 w-3 text-white" />
                     <span className="text-white text-xs font-medium">Reel</span>
                   </div>
                 </div>
                
                {/* Instagram Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex justify-end">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-white text-sm font-medium leading-relaxed">
                      {post.caption}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">@{post.username}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          <span className="text-white text-sm">{post.likes}</span>
                        </div>
                        <MessageCircle className="h-4 w-4 text-white" />
                        <Share className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Post Footer */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: post.color }}
                    >
                      <span className="text-white text-xs font-bold">SS</span>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">@{post.username}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    <span className="text-gray-600 text-sm">{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 md:mt-16">
          <Button 
            className="px-8 py-4 text-lg bg-gradient-to-r from-[#E90064] to-[#FF8021] hover:from-[#c50058] hover:to-[#e6721c] text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <a href="https://www.instagram.com/sisterstorage" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3">
              <Instagram className="h-5 w-5" />
              <span>Follow Our Sister Stories</span>
            </a>
          </Button>
          <p className="text-gray-500 text-sm mt-3">Join 10K+ sisters sharing their organized spaces</p>
        </div>
      </div>
    </section>
  );
};

export default InstagramUGC;
