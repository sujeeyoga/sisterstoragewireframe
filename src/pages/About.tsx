
import React from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Newsletter from "@/components/Newsletter";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative pt-28 pb-20 bg-purple-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-[#E6007E] font-medium">Our Story</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">By Sisters, For Sisters</h1>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Sister Storage was created for the women who celebrate their culture boldly, 
                live beautifully, and organize powerfully. We believe in honoring our traditions 
                while designing for our modern lives.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium italic">
                "Designed with love, built for everyday beauty."
              </p>
            </div>
            <div className="order-1 lg:order-2 overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1556707752-481d500a2c58?q=80&w=1080&auto=format&fit=crop" 
                alt="The founders of Sister Storage" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Cultural Celebration",
                description: "Every piece we create celebrates and honors our cultural treasures and traditions.",
                icon: "✨"
              },
              {
                title: "Sustainable Materials",
                description: "We source high-quality, sustainable materials that are as durable as they are beautiful.",
                icon: "🌱"
              },
              {
                title: "Mindful Organization",
                description: "We believe organization isn't just about tidiness—it's about creating harmony in your living space.",
                icon: "🧘‍♀️"
              }
            ].map((value, index) => (
              <div key={index} className="bg-purple-50 p-8 rounded-lg text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Meet Our Sisters</h2>
          <p className="text-gray-700 text-center max-w-2xl mx-auto mb-12">
            The talented sisters who bring Sister Storage to life.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Priya Shah",
                role: "Co-Founder & Creative Director",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop"
              },
              {
                name: "Divya Shah",
                role: "Co-Founder & Operations Director",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop"
              },
              {
                name: "Meera Patel",
                role: "Product Development Lead",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop"
              },
              {
                name: "Anisha Joshi",
                role: "Community Manager",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="overflow-hidden rounded-full w-48 h-48 mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <Newsletter />
      
      <Footer />
    </div>
  );
};

export default About;
