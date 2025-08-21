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
            <a 
              href="https://www.instagram.com/sisterstorage" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-primary text-primary px-6 py-3 rounded-full font-medium hover:bg-primary/10 transition-colors flex-1 sm:flex-none text-center inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @sisterstorage
            </a>
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