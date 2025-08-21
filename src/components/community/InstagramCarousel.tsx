import React from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Instagram, Heart, MessageCircle, Share, Play } from 'lucide-react';

const instagramPosts = [
  {
    id: 1,
    color: "#E90064",
    username: "priya_organized",
    likes: 2847,
    video: "https://dl.snapcdn.app/get?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL3Njb250ZW50LmNkbmluc3RhZ3JhbS5jb20vbzEvdi90Mi9mMi9tODYvQVFNNjJ1bjZWYjFNRDQ2RGJYRWJsbU9NVDU1OFpkUFV0My1kNWpEUzVTLVhqUVlPXzNQV1R4dXNWd050d0ROUjhkY0lCRi00TTVNbm9PWTFuVVhtNm5yejo1RFdGY29WQnZTRnAxYy5tcDQ_X25jX2NhdD0xMTEmX25jX3NpZD01ZTk4NTEmX25jX2h0PXNjb250ZW50LWhlbDMtMS5jZG5pbnN0YWdyYW0uY29tJl9uY19vaGM9N2tFQTdMUU02WVVRN2tOdndFVGl5X3kmZWZnPWV5SjJaVzVqYjJSbFgzUmhaeUk2SW5od2RsOXdjbTluY21WemMybDJaUzVKVGxOVVFVZFNRVTB1UTB4SlVGTXVRekl1TnpJd0xtUmhjMmhmWW1GelpXeHBibVZmTVY5Mk1DSXNJbmh3ZGw5aGMzTmxkRjlwWkNJNk1USTJPRFkxTURBek5UQXdNREV3TkN3aWRtbGZkWE5sWTJGelpWOXBaQ0k2TVRBd085aUUsaWRIVnlZWEZwYjI1ZmN5STZNalVzSW5WeWJHeHVaMV96YjNWeVkyVWlPaUozZDNkSWJqRSZjY2I9MTctMSZ2cz0yMDY1MWU4NTE5MDY2YjYwJl9uY192cz1IQmtzRlFJWVVtbG5YM2h3ZGw5eVpXVnNjMTl3WlhKeVlXNWxiblJmYzNKZmNISnZaQzlDUmpReVJVUTVSa1l4T0VGQlJqTTRSVVUwUVVZd05rSTRSVGt3TnpZNU5WOTJhV1JsYjE5a1lYTm9hVzVwZEM1dGNEUlZBQUxJQVJJQUZRSVlPbkJoYzNOMGFISnZkV2RvWDJWMlpYSnpkRzl5WlM5SVRVNTBWbmd0T1hOeWQzQjJhV3RHUUU4ZldVcHJlRWgwVERoNFluRmZSVUZCUVVZVkFnTElBUklBS0FBWUFCc0NpQWQxYzJWZll6RTZWQmlFU2NISnZaM0psYzNOcGRtVmZjbVZqYVhCbEFERVZBQUFtMUV6eHFwUDF3QVFWQWlnQ1EzUXNGMHE1MVQ5ODdaRm9HQkprWVhOb1gySmhjMlZzYVc1bFh6RmZkakVSQUhYX0IyWG1uUUVBJl9uY19naWQ9b3k0aFU5ZXlRbjcwVWowV05RdTVFQSZfbmNfenQ9Mjgmb2g9MDBfQWZWVVNrc1dTTWNrZ2I5RnNULTZfVjg5akZUREVkMTNqRTdLcUx6enIzdTdfQSZvZT02OEE5NTA0NCIsImZpbGVuYW1lIjoiU25hcEluc3RhLnRvX0FRTTYydW42VmIxTUQ0NkRiWEVibG1PTVQ1NThaZFBVdDMtZDVqRFM1Uy1YalFZT18zUFdUeHVzVndOdHdETlI4ZGNJQkYtNE01TW5vT1kxblVYbTZucnpqNURXRmNvVkJ2U0ZwMWMubXA0IiwibmJmIjoxNzU1ODA1MTU1LCJleHAiOjE3NTU4MDg3NTUsImlhdCI6MTc1NTgwNTE1NX0.js9VlqNeFDamrXTf0XfwnVuFqw706DKFgx0R-rZ1_4w",
    caption: "POV: Your jewelry collection finally has a home that honors your heritage ✨💍",
    isReel: true,
    isVideo: true
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

export const InstagramCarousel = () => {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Instagram Stories</h3>
        <p className="text-muted-foreground">Follow our sisters on Instagram for daily inspiration</p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {instagramPosts.map((post) => (
            <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm group cursor-pointer hover:bg-card/80 transition-all duration-500">
                <div className="relative aspect-[9/16] overflow-hidden">
                  {post.isVideo ? (
                    <video 
                      src={post.video}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img 
                      src={post.image}
                      alt={`Sister Storage styled by @${post.username}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play Button */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/40 backdrop-blur-sm rounded-full p-3">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                  
                  {/* Reel Label */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Instagram className="h-3 w-3 text-white" />
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
                      <span className="text-foreground font-medium text-sm">@{post.username}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                      <span className="text-muted-foreground text-sm">{post.likes}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};