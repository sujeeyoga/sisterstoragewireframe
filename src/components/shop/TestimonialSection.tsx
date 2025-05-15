
import React from "react";
import { Star } from "lucide-react";

const TestimonialSection = () => {
  return (
    <div className="mt-16 text-center max-w-2xl mx-auto">
      <div className="flex justify-center mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="h-4 w-4 text-amber-500 fill-amber-500" />
        ))}
      </div>
      <p className="italic mb-4 text-gray-700">"I've been looking for storage options that honor my cultural pieces for years. Sister Storage not only protects my items but celebrates them with thoughtful design."</p>
      <p className="font-semibold">- Priya S., Loyal Customer</p>
    </div>
  );
};

export default TestimonialSection;
