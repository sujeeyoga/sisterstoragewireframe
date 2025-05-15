
import React from "react";

interface Benefit {
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  benefits: Benefit[];
}

const BenefitsSection = ({ benefits }: BenefitsSectionProps) => {
  return (
    <div className="mt-16 bg-pink-50 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-8">Why Sister Storage?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="text-center">
            <h3 className="font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600 text-sm">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection;
