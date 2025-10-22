import React, { useState } from "react";
import { LaunchCard as LaunchCardType } from "@/types/launch-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LaunchCardProps {
  card: LaunchCardType;
}

const LaunchCard = ({ card }: LaunchCardProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist_signups')
        .insert({
          name: name.trim(),
          email: email.trim(),
          collection_name: card.collection_name,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("You're already on the waitlist!");
        } else {
          throw error;
        }
      } else {
        toast.success("You're on the list! We'll email you when it drops.");
        setName("");
        setEmail("");
      }
    } catch (error) {
      console.error('Waitlist signup error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-12 bg-[hsl(var(--brand-pink))] text-white shadow-xl">
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Collection name */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 uppercase tracking-wide text-center">
          {card.collection_name}
        </h2>
        
        {/* Tagline */}
        {card.tagline && (
          <p className="text-lg sm:text-xl md:text-2xl font-medium italic mb-4 text-center">
            {card.tagline}
          </p>
        )}
        
        {/* Description */}
        <p className="text-base sm:text-lg mb-6 sm:mb-8 text-center max-w-2xl mx-auto px-4">
          {card.description}
        </p>
        
        {/* Inline Email Collection Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto px-4">
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 bg-white/90 text-gray-900 placeholder:text-gray-500 border-white/50 h-11 sm:h-12 text-sm sm:text-base"
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 bg-white/90 text-gray-900 placeholder:text-gray-500 border-white/50 h-11 sm:h-12 text-sm sm:text-base"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/90 font-semibold uppercase tracking-wide h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
          >
            {isSubmitting ? "Joining..." : card.cta_label || "Join Waitlist"}
          </Button>
        </form>
      </div>
    </article>
  );
};

export default LaunchCard;
