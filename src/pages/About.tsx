
import React from "react";
import { Button } from "@/components/ui/button";
import Newsletter from "@/components/Newsletter";
import Layout from "@/components/layout/Layout";
import { ArrowRight, CheckCircle, Users, Heart, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-16 pb-20 bg-gradient-to-b from-sister-soft-gray to-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="bg-[#E90064] mb-2 hover:bg-[#E90064]/90">Our Story</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Built on Love and Practicality</h1>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Sister Storage began when two sisters, Emma and Sarah, couldn't find beautiful 
                storage solutions that matched their homes. What started as handcrafted boxes for their own 
                treasured items evolved into a brand dedicated to bringing organization and beauty into every home.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium italic">
                "Designed with love, built for everyday beauty."
              </p>
              <Button className="mt-2 flex items-center gap-2 group">
                Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="order-1 lg:order-2 overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1556707752-481d500a2c58?q=80&w=1080&auto=format&fit=crop" 
                alt="The founders of Sister Storage" 
                className="w-full h-auto rounded-lg shadow-lg hover:scale-[1.02] transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Philosophy & Benefits Section */}
      <div className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <Badge className="bg-[#FF8021] hover:bg-[#FF8021]/90 mb-3">Our Philosophy</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Each piece in our collection is thoughtfully designed with both function and elegance in mind</h2>
            <p className="text-gray-600 text-lg">
              Our mission is to transform organizing from a chore into an experience that enhances your space and brings joy to your daily rituals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Sustainable Materials",
                description: "Responsibly sourced materials that are as beautiful as they are durable",
                icon: Leaf,
                color: "bg-sister-soft-green"
              },
              {
                title: "Complementary Design",
                description: "Designs that enhance your existing decor rather than competing with it",
                icon: Heart,
                color: "bg-sister-soft-pink"
              },
              {
                title: "Versatile Solutions",
                description: "Versatile organization solutions that adapt to your changing needs",
                icon: CheckCircle,
                color: "bg-sister-soft-blue"
              },
              {
                title: "Beautiful Practicality",
                description: "Created with the belief that practical items should also be beautiful",
                icon: Users,
                color: "bg-sister-soft-peach"
              }
            ].map((benefit, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`${benefit.color} p-3 rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                    <benefit.icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Visual Identity Section */}
      <div className="py-20 bg-sister-soft-gray">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-lg h-48 md:h-64 bg-[#E90064] flex items-center justify-center transform transition-transform hover:scale-[1.03] shadow-lg">
                  <span className="text-white text-xl font-bold">Sister</span>
                </div>
                <div className="rounded-lg h-32 md:h-40 bg-[#FFDCBD] flex items-center justify-center transform transition-transform hover:scale-[1.03] shadow-lg">
                  <span className="text-[#000000] text-xl font-bold">Storage</span>
                </div>
              </div>
              <div className="space-y-4 mt-6 md:mt-8">
                <div className="rounded-lg h-32 md:h-40 bg-[#FF8021] flex items-center justify-center transform transition-transform hover:scale-[1.03] shadow-lg">
                  <span className="text-white text-xl font-bold">Organize</span>
                </div>
                <div className="rounded-lg h-48 md:h-64 bg-[#FE5FA2] flex items-center justify-center transform transition-transform hover:scale-[1.03] shadow-lg">
                  <span className="text-white text-xl font-bold">Beautifully</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 px-4 md:px-0">
              <Badge className="mb-3 bg-[#FE5FA2] hover:bg-[#FE5FA2]/90">Our Approach</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-5">Built on Love and Practicality</h2>
              <p className="text-gray-700 mb-5 leading-relaxed">
                Sister Storage began when two sisters, Emma and Sarah, couldn't find beautiful storage solutions that matched their homes and aesthetic. What started as handcrafted boxes for their own treasured items evolved into a brand dedicated to bringing organization and beauty into every home.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Each piece in our collection is thoughtfully designed with both function and elegance in mind. Our mission is to transform organizing from a chore into an experience that enhances your space and brings joy to your daily rituals.
              </p>
              <Button variant="secondary" className="mt-2 flex items-center gap-2 group">
                Our Design Process <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="bg-[#E90064] hover:bg-[#E90064]/90 mb-3">Meet Our Team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Talented Sisters Behind the Brand</h2>
            <p className="text-gray-700 mb-8 text-lg">
              The passionate team who bring Sister Storage to life with creativity, dedication and an eye for beautiful organization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                name: "Priya Shah",
                role: "Co-Founder & Creative Director",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
                initial: "PS"
              },
              {
                name: "Divya Shah",
                role: "Co-Founder & Operations Director",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop",
                initial: "DS"
              },
              {
                name: "Meera Patel",
                role: "Product Development Lead",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
                initial: "MP"
              },
              {
                name: "Anisha Joshi",
                role: "Community Manager",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
                initial: "AJ"
              }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative overflow-hidden mx-auto mb-5 rounded-full w-48 h-48 shadow-md transition-all duration-300 group-hover:shadow-xl">
                  <Avatar className="w-full h-full">
                    <AvatarImage 
                      src={member.image} 
                      alt={member.name} 
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <AvatarFallback>{member.initial}</AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-[#E90064]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Values Section */}
      <div className="py-20 bg-sister-soft-gray">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-3 bg-[#FF8021] hover:bg-[#FF8021]/90">Our Core Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Stand For</h2>
            <p className="text-gray-700 text-lg">
              The principles that guide everything we create and every decision we make.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Cultural Celebration",
                description: "Every piece we create celebrates and honors our cultural treasures and traditions.",
                color: "from-sister-soft-pink to-white"
              },
              {
                title: "Sustainable Materials",
                description: "We source high-quality, sustainable materials that are as durable as they are beautiful.",
                color: "from-sister-soft-green to-white"
              },
              {
                title: "Mindful Organization",
                description: "We believe organization isn't just about tidiness—it's about creating harmony in your living space.",
                color: "from-sister-soft-blue to-white"
              }
            ].map((value, index) => (
              <Card key={index} className={`bg-gradient-to-b ${value.color} border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden`}>
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-[#E90064]">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Sister Community</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Be the first to know about new collections, special offers, and organization tips from our team.
          </p>
          <Button variant="default" size="lg" className="bg-white text-[#E90064] hover:bg-gray-100 hover:text-[#E90064] transition-colors">
            Shop Our Collection
          </Button>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <Newsletter />
    </Layout>
  );
};

export default About;
