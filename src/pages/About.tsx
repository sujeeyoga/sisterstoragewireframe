
import React from "react";
import { Button } from "@/components/ui/button";
import Newsletter from "@/components/Newsletter";
import Layout from "@/components/layout/Layout";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import FlowchartItem from "@/components/about/FlowchartItem";

const flowchartItems = [
  {
    title: "Obsessed with Bangles",
    description: "We loved our bangles and had a growing collection—but nowhere to properly store them.",
    color: "bg-sister-soft-pink"
  },
  {
    title: "The Organized One",
    description: "My sister is the most organized person I know.",
    color: "bg-sister-soft-peach"
  },
  {
    title: "Still, No Solution",
    description: "Even she couldn't find them a proper home.",
    color: "bg-sister-soft-yellow"
  },
  {
    title: "Nothing Worked",
    description: "Not a ziplock bag or curtain hook could do the job.",
    color: "bg-sister-soft-green"
  },
  {
    title: "Hard to Ignore",
    description: "Watching her struggle stuck with me—I couldn't let it go.",
    color: "bg-sister-soft-blue"
  },
  {
    title: "In Search of Something Better",
    description: "I started looking for a real solution.",
    color: "bg-sister-soft-pink"
  },
  {
    title: "Finally, a Fix",
    description: "We finally found something that actually worked.",
    color: "bg-sister-soft-peach"
  },
  {
    title: "Simple, Yet Game-Changing",
    description: "It was clean, easy to use, and made for our kind of accessories.",
    color: "bg-sister-soft-yellow"
  },
  {
    title: "Sister-Approved!",
    description: "We tried it ourselves—and LOVED it!",
    color: "bg-sister-soft-green"
  },
  {
    title: "More Than Just Us",
    description: "That small win made us realize—we weren't the only ones with this problem.",
    color: "bg-sister-soft-blue"
  },
  {
    title: "What If We Shared It?",
    description: "What if other women were dealing with the same mess?",
    color: "bg-sister-soft-pink"
  },
  {
    title: "Taking the Leap",
    description: "We decided to share it—and that's how Sister Storage got its start.",
    color: "bg-sister-soft-peach"
  },
  {
    title: "Thanuska!!",
    description: "Thanuska—the queen of organization—loved our product.",
    color: "bg-sister-soft-yellow"
  },
  {
    title: "The First Share",
    description: "She posted about it, and people started reaching out!",
    color: "bg-sister-soft-green"
  },
  {
    title: "Grateful",
    description: "With every message, order, and share—Sister Storage became something real.",
    color: "bg-sister-soft-blue"
  }
];

const About = () => {
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-16 pb-12 bg-white">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-8">
              Proof that small ideas (and sisters) can do big things.
            </h1>
            
            <div className="flex justify-center mt-10 mb-4">
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              >
                <ArrowDown className="h-8 w-8 text-[#E90064]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Flowchart Timeline Section */}
      <div className="py-10 md:py-16 bg-white">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            {flowchartItems.map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
              >
                <FlowchartItem 
                  title={item.title}
                  description={item.description}
                  color={item.color}
                  index={index}
                  isLast={index === flowchartItems.length - 1}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Closing Section */}
      <div className="py-16 bg-white">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-medium italic mb-8">
              From that first bangle box to thousands of sisters organizing beautifully—
              <span className="block mt-2">this story is still being written.</span>
            </h2>
            
            <Button className="mt-6 px-8 py-6 text-lg flex items-center gap-2 group">
              Explore Our Storage
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Our Team Section - Simplified */}
      <div className="py-16 bg-sister-soft-gray">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Sisters Behind The Story</h2>
            <p className="text-gray-700 mb-8 text-lg">
              Meet the team who brought Sister Storage from a simple idea to reality.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">
            {[
              {
                name: "Priya Shah",
                role: "Co-Founder & Creative Director",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
                color: "bg-sister-soft-pink"
              },
              {
                name: "Divya Shah",
                role: "Co-Founder & Operations Director",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop",
                color: "bg-sister-soft-peach"
              }
            ].map((member, index) => (
              <motion.div 
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={`relative overflow-hidden mx-auto mb-5 rounded-full w-48 h-48 shadow-md transition-all duration-300 group-hover:shadow-xl ${member.color}`}>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-[#E90064]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 bg-[#E90064]">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Sister Community</h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Be the first to know about new collections, special offers, and organization tips from our team.
            </p>
            <Button variant="default" size="lg" className="bg-white text-[#E90064] hover:bg-gray-100 hover:text-[#E90064] transition-colors">
              Shop Our Collection
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <Newsletter />
    </Layout>
  );
};

export default About;
