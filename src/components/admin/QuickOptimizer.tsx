import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export function QuickOptimizer() {
  const [optimizing, setOptimizing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  const runOptimization = async () => {
    setOptimizing(true);
    setCompleted(false);

    try {
      const { data, error } = await supabase.functions.invoke('optimize-homepage-images');

      if (error) throw error;

      toast({
        title: 'Optimization Complete',
        description: `Successfully processed ${data.results.length} images`,
      });

      setCompleted(true);

    } catch (error: any) {
      console.error('Optimization error:', error);
      toast({
        title: 'Optimization Failed',
        description: error.message || 'Failed to optimize images',
        variant: 'destructive',
      });
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[hsl(var(--brand-pink))]" />
            Quick Homepage Optimizer
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Optimize and rename the 3 OrganizationGallery images with proper naming.
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
          <p className="font-semibold">Images to optimize:</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>e1ae51b5... → organized-jewelry-bangles.webp</li>
            <li>2a4c457a... → elegant-jewelry-storage.webp</li>
            <li>0e5fe1c0... → sister-storage-showcase.webp</li>
          </ul>
        </div>

        <Button
          onClick={runOptimization}
          disabled={optimizing || completed}
          className="w-full"
          size="lg"
        >
          {optimizing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {completed && <CheckCircle2 className="h-4 w-4 mr-2" />}
          {completed ? 'Optimization Complete!' : optimizing ? 'Optimizing...' : 'Optimize Now'}
        </Button>

        {completed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
            ✅ Images have been optimized and uploaded to the homepage folder!
          </div>
        )}
      </div>
    </Card>
  );
}
