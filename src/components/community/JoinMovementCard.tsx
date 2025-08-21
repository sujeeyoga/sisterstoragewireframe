import React from 'react';
import { Card } from '@/components/ui/card';

export const JoinMovementCard = () => {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Join the Movement</h3>
        <p className="text-muted-foreground">Become part of our growing sister community</p>
      </div>

      <Card className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8 md:p-12 text-center max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-2xl md:text-3xl font-bold">Share Your Style</h4>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tag us @sisterstorage and show us how you organize with soul! Your story could inspire thousands of sisters worldwide.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors flex-1 sm:flex-none">
              Share Your Story
            </button>
            <button className="border border-primary text-primary px-6 py-3 rounded-full font-medium hover:bg-primary/10 transition-colors flex-1 sm:flex-none">
              Follow @sisterstorage
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">1M+</div>
              <div className="text-sm text-muted-foreground">Posts Tagged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">100+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};