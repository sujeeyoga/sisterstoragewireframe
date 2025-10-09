import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Check } from 'lucide-react';

export function MigrateHeroImages() {
  const [migrating, setMigrating] = useState(false);
  const [migrated, setMigrated] = useState(false);
  const { toast } = useToast();

  const migrateImages = async () => {
    setMigrating(true);
    
    try {
      // Get current hero images from database
      const { data: currentImages, error: fetchError } = await supabase
        .from('hero_images')
        .select('*')
        .eq('position', 'gallery');

      if (fetchError) throw fetchError;

      if (!currentImages || currentImages.length === 0) {
        toast({
          title: 'No images to migrate',
          description: 'Hero images table is empty',
        });
        setMigrating(false);
        return;
      }

      let successCount = 0;

      for (const image of currentImages) {
        // Check if image URL is from /lovable-uploads
        if (!image.image_url.startsWith('/lovable-uploads/')) {
          console.log(`Skipping ${image.image_url} - already migrated`);
          continue;
        }

        try {
          // Extract filename from the URL
          const filename = image.image_url.replace('/lovable-uploads/', '');
          const publicPath = `/lovable-uploads/${filename}`;

          // Fetch the image from public folder
          const response = await fetch(publicPath);
          if (!response.ok) {
            console.error(`Failed to fetch ${publicPath}`);
            continue;
          }

          const blob = await response.blob();
          const file = new File([blob], filename, { type: blob.type });

          // Upload to Supabase storage under 'hero-images' folder
          const storagePath = `hero-images/${filename}`;
          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(storagePath, file, {
              cacheControl: '3600',
              upsert: true,
            });

          if (uploadError) throw uploadError;

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(storagePath);

          // Update the database with new URL
          const { error: updateError } = await supabase
            .from('hero_images')
            .update({ 
              image_url: publicUrl,
              updated_at: new Date().toISOString(),
            })
            .eq('id', image.id);

          if (updateError) throw updateError;

          successCount++;
          console.log(`Migrated ${filename} successfully`);
        } catch (error) {
          console.error(`Error migrating ${image.image_url}:`, error);
        }
      }

      setMigrated(true);
      toast({
        title: 'Migration Complete',
        description: `Successfully migrated ${successCount} hero images to Supabase Storage`,
      });
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: 'Migration Failed',
        description: 'Failed to migrate hero images',
        variant: 'destructive',
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Migrate Hero Images to Storage</h3>
        <p className="text-sm text-muted-foreground">
          This will move your hero images from static files to Supabase Storage, 
          making them manageable through the admin panel.
        </p>
      </div>

      <Button
        onClick={migrateImages}
        disabled={migrating || migrated}
        className="w-full"
      >
        {migrating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Migrating Images...
          </>
        ) : migrated ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Migration Complete
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Start Migration
          </>
        )}
      </Button>

      {migrated && (
        <p className="text-sm text-green-600">
          ✓ Your hero images have been migrated to Supabase Storage. 
          You can now manage them in the Hero Images page.
        </p>
      )}
    </Card>
  );
}
