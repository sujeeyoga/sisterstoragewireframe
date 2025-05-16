
import React from "react";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  return (
    <div className="py-16 bg-[#FFDCBD]">
      <div className="container-custom max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Get Organization Tips Delivered</h2>
        <p className="text-gray-700 mb-6">
          Join our newsletter to receive monthly organization tips, exclusive offers, and early access to new products.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="px-4 py-3 rounded-md border border-gray-300 flex-grow focus:outline-none focus:ring-2 focus:ring-[#E90064]"
          />
          <Button className="bg-[#E90064] hover:bg-[#FE5FA4] text-white">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
