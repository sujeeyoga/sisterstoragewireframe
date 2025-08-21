
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// A simplified version of the About component for the home page
const About = () => {
  return (
    <div className="w-full">{/* Spacing controlled by Section wrapper */}
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Header Section */}
          <div className="text-center md:text-left">
            <span className="text-[#E90064] font-medium">Our Story</span>
            <h2 className="font-bold mt-2 mb-3">About Sister Storage</h2>
            <p className="text-gray-600">
              From a simple idea to organized beauty - discover how two sisters turned a storage problem into a solution.
            </p>
          </div>
          
          {/* Right Column - Story Card */}
          <div className="flex justify-center md:justify-end">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
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
    </div>
  );
};

export default About;
