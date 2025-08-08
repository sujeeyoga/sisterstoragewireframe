
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// A simplified version of the About component for the home page
const About = () => {
  return (
    <div className="w-full">{/* Spacing controlled by Section wrapper */}
      <div className="container-custom">
        <div className="text-center mb-10">
          <span className="text-[#E90064] font-medium">Our Story</span>
          <h2 className="font-bold mt-2 mb-3">About Sister Storage</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            From a simple idea to organized beauty - discover how two sisters turned a storage problem into a solution.
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-bold mb-4">Our Story</h3>
            <p className="text-gray-700 mb-4">
              We started with a bangle storage problem and created a solution that now helps thousands of sisters organize beautifully.
            </p>
            <div className="flex justify-center">
              <Link to="/about">
                <Button variant="outline" className="mt-2">
                  Read Our Full Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
