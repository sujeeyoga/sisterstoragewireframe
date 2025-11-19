import React from "react";
import eidSleeve from "@/assets/sleeves/eid-sleeve.png";
import weddingSleeve from "@/assets/sleeves/wedding-sleeve.png";
import pregnancySleeve from "@/assets/sleeves/pregnancy-sleeve.png";
import bangleSleeve from "@/assets/sleeves/bangle-sleeve.png";
import standardSleeve from "@/assets/sleeves/standard-sleeve.png";

interface SleeveSelectorProps {
  selectedSleeve: string;
  setSelectedSleeve: (sleeve: string) => void;
}

const sleeveOptions = [
  { value: "none", label: "Your Choice", image: standardSleeve },
  { value: "eid", label: "Eid", image: eidSleeve },
  { value: "wedding", label: "Wedding", image: weddingSleeve },
  { value: "pregnancy", label: "Pregnancy", image: pregnancySleeve },
  { value: "bangle", label: "Bangle", image: bangleSleeve }
];

const SleeveSelector = ({ selectedSleeve, setSelectedSleeve }: SleeveSelectorProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold mb-2">Choose Your Sleeve:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {sleeveOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedSleeve(option.value)}
            className={`relative overflow-hidden border rounded-lg transition-all ${
              selectedSleeve === option.value
                ? 'border-primary border-2 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="aspect-square">
              <img 
                src={option.image} 
                alt={option.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                <span className="text-white text-xs font-semibold">{option.label}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SleeveSelector;
