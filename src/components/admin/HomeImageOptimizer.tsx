import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { optimizeImage } from '@/lib/imageOptimizer';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ImageInfo {
  path: string;
  size: number;
  url: string;
  type: 'upload' | 'hero';
}

const HomeImageOptimizer = () => {
  const [optimizing, setOptimizing] = useState(false);
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const HOME_IMAGES = [
    '/lovable-uploads/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.png',
    '/lovable-uploads/fb8da55a-c9bb-419e-a96f-175a667875e1.png',
    '/lovable-uploads/4ef08ea3-3380-4111-b4a1-eb939cba275b.png'
  ];

  const fetchImageSizes = async () => {
    setLoading(true);
    const imageInfos: ImageInfo[] = [];

    for (const imagePath of HOME_IMAGES) {
      try {
        const response = await fetch(imagePath);
        const blob = await response.blob();
        imageInfos.push({
          path: imagePath,
          size: blob.size,
          url: imagePath,
          type: 'upload'
        });
      } catch (error) {
        console.error(`Error fetching ${imagePath}:`, error);
      }
    }

    // Fetch hero images from database
    const { data: heroImages } = await supabase
      .from('hero_images')
      .select('image_url')
      .eq('position', 'gallery')
      .eq('is_active', true);

    if (heroImages) {
      for (const hero of heroImages) {
        try {
          const response = await fetch(hero.image_url);
          const blob = await response.blob();
          imageInfos.push({
            path: hero.image_url,
            size: blob.size,
            url: hero.image_url,
            type: 'hero'
          });
        } catch (error) {
          console.error(`Error fetching ${hero.image_url}:`, error);
        }
      }
    }

    setImages(imageInfos.filter(img => img.size > 500000)); // Show images over 500KB
    setLoading(false);
  };

  const optimizeHomeImages = async () => {
    setOptimizing(true);
    let optimizedCount = 0;

    for (const image of images) {
      try {
        // Download the image
        const response = await fetch(image.url);
        const blob = await response.blob();
        const file = new File([blob], image.path.split('/').pop() || 'image.jpg', { 
          type: blob.type 
        });

        // Optimize the image
        const { blob: optimizedBlob } = await optimizeImage(file, 1920, 1920, 0.75);
        
        // Extract the storage path
        const pathParts = image.path.split('/');
        const fileName = pathParts[pathParts.length - 1];
        const bucketPath = pathParts.includes('lovable-uploads') 
          ? `lovable-uploads/${fileName}`
          : fileName;

        // Upload optimized version
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(bucketPath, optimizedBlob, {
            upsert: true,
            contentType: 'image/jpeg'
          });

        if (uploadError) {
          console.error(`Error uploading ${fileName}:`, uploadError);
          continue;
        }

        optimizedCount++;
        
        toast({
          title: "Image Optimized",
          description: `${fileName} - ${Math.round(image.size / 1024)}KB → ${Math.round(optimizedBlob.size / 1024)}KB`
        });
      } catch (error) {
        console.error('Error optimizing image:', error);
      }
    }

    setOptimizing(false);
    toast({
      title: "Optimization Complete",
      description: `Optimized ${optimizedCount} images on the homepage`
    });

    // Refresh the list
    fetchImageSizes();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Homepage Image Optimizer</h2>
      <p className="text-muted-foreground mb-4">
        Automatically finds and optimizes large images (over 500KB) on your homepage.
      </p>

      <div className="flex gap-4 mb-6">
        <Button onClick={fetchImageSizes} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Scan Homepage Images
        </Button>
        
        {images.length > 0 && (
          <Button onClick={optimizeHomeImages} disabled={optimizing}>
            {optimizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Optimize {images.length} Large Images
          </Button>
        )}
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Large Images Found:</h3>
          {images.map((img, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <img src={img.url} alt="" className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-medium text-sm">{img.path.split('/').pop()}</p>
                  <p className="text-xs text-muted-foreground">{img.type}</p>
                </div>
              </div>
              <span className="text-sm font-semibold">{formatFileSize(img.size)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default HomeImageOptimizer;
