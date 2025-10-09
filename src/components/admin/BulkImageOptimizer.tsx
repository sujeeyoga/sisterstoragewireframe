import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { optimizeImage } from '@/lib/imageOptimizer';
import { Loader2, Image as ImageIcon, RefreshCw } from 'lucide-react';

interface StorageImage {
  name: string;          // full path for display
  id: string;            // unique per bucket+path
  size: number;
  url: string;
  metadata?: any;
  path?: string;         // storage path within bucket
  isStatic?: boolean;
  staticPath?: string;
}

export function BulkImageOptimizer() {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState(0.8);
  const [maxDimension, setMaxDimension] = useState(1920);
  const [bucket, setBucket] = useState<'images' | 'sister'>('images');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, [bucket]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      
      // Fetch all folders and files recursively from storage
      const allImages: StorageImage[] = [];
      
      const fetchFolder = async (path: string = '') => {
        const { data: items, error } = await supabase.storage
          .from(bucket)
          .list(path, {
            limit: 1000,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (error) throw error;

        for (const item of items) {
          const fullPath = path ? `${path}/${item.name}` : item.name;
          
          // If it's a folder (id is null), recurse into it
          if (item.id === null) {
            await fetchFolder(fullPath);
          } 
          // If it's an image file, add it to our list
          else if (item.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
            allImages.push({
              name: fullPath,
              id: `${bucket}:${fullPath}`,
              size: item.metadata?.size || 0,
              url: supabase.storage.from(bucket).getPublicUrl(fullPath).data.publicUrl,
              metadata: item.metadata,
              path: fullPath,
              isStatic: false,
            });
          }
        }
      };

      await fetchFolder();

      // Also fetch hero images from database to check for static files
      const { data: heroImages } = await supabase
        .from('hero_images')
        .select('image_url')
        .eq('position', 'gallery')
        .eq('is_active', true);

      if (heroImages) {
        for (const hero of heroImages) {
          if (hero.image_url.startsWith('/lovable-uploads/')) {
            const filename = hero.image_url.replace('/lovable-uploads/', '');
            allImages.push({
              name: filename,
              id: `static-${filename}`,
              size: 0, // Unknown size for static files
              url: hero.image_url,
              isStatic: true,
              staticPath: hero.image_url,
            });
          }
        }
      }

      setImages(allImages);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: 'Error',
        description: 'Failed to load images',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const selectAll = () => {
    setSelectedImages(new Set(images.map(img => img.id)));
  };

  const deselectAll = () => {
    setSelectedImages(new Set());
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const optimizeSelectedImages = async () => {
    if (selectedImages.size === 0) {
      toast({
        title: 'No images selected',
        description: 'Please select images to optimize',
        variant: 'destructive',
      });
      return;
    }

    setOptimizing(true);
    setProgress(0);

    const selectedImagesList = images.filter(img => selectedImages.has(img.id));
    let completed = 0;
    let totalSaved = 0;

    for (const image of selectedImagesList) {
      try {
        // Download the image
        const response = await fetch(image.url);
        const blob = await response.blob();
        const file = new File([blob], image.name, { type: blob.type });

        // Create an image element to get dimensions
        const img = document.createElement('img');
        const imageUrl = URL.createObjectURL(file);
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });

        // Optimize the image
        const optimized = await optimizeImage(file, maxDimension, maxDimension, quality);
        
        URL.revokeObjectURL(imageUrl);

        const originalSize = file.size;
        const newSize = optimized.blob.size;
        totalSaved += (originalSize - newSize);

        // Only upload if the optimized version is smaller
        if (newSize < originalSize) {
          // Determine destination bucket and path
          const destBucket = image.isStatic ? 'images' : bucket;
          const baseName = image.name.split('/').pop() || image.name;
          const destPath = image.isStatic ? `hero-images/${baseName}` : (image.path || image.name);

          // Upload the optimized image (replace the original)
          const { error: uploadError } = await supabase.storage
            .from(destBucket)
            .upload(destPath, optimized.blob, {
              cacheControl: '3600',
              upsert: true,
            });

          if (uploadError) throw uploadError;

          // Update the metadata in the database (if tracked)
          const { error: updateError } = await supabase
            .from('uploaded_images')
            .update({
              file_size: newSize,
              original_size: originalSize,
              width: optimized.width,
              height: optimized.height,
              updated_at: new Date().toISOString(),
            })
            .eq('file_path', image.path || image.name);

          if (updateError) console.warn('Metadata update skipped/failed:', updateError);
        }

        completed++;
        setProgress((completed / selectedImagesList.length) * 100);
      } catch (error) {
        console.error(`Error optimizing ${image.name}:`, error);
      }
    }

    setOptimizing(false);
    setProgress(0);
    setSelectedImages(new Set());

    toast({
      title: 'Optimization Complete',
      description: `Optimized ${completed} images. Saved ${formatFileSize(totalSaved)} total.`,
    });

    // Refresh the image list
    fetchImages();
  };

  const totalSelected = selectedImages.size;
  const totalSize = images
    .filter(img => selectedImages.has(img.id))
    .reduce((sum, img) => sum + img.size, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bulk Image Optimizer</h2>
        <p className="text-muted-foreground">
          Select images to compress and reduce file sizes
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex gap-4 flex-wrap items-center justify-between">
          <div className="flex items-center gap-2">
            <Label>Bucket</Label>
            <Select value={bucket} onValueChange={(v) => setBucket(v as 'images' | 'sister')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Bucket" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="images">images</SelectItem>
                <SelectItem value="sister">sister</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-64">
            <Input
              placeholder="Search filenames or folders"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Quality: {Math.round(quality * 100)}%</Label>
            <Slider
              value={[quality * 100]}
              onValueChange={([value]) => setQuality(value / 100)}
              min={50}
              max={100}
              step={5}
              disabled={optimizing}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Higher quality = larger file size. 80% recommended.
            </p>
          </div>

          <div>
            <Label>Max Dimension: {maxDimension}px</Label>
            <Slider
              value={[maxDimension]}
              onValueChange={([value]) => setMaxDimension(value)}
              min={512}
              max={3840}
              step={128}
              disabled={optimizing}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Images larger than this will be resized. Aspect ratio preserved.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={selectAll} variant="outline" disabled={optimizing}>
            Select All
          </Button>
          <Button onClick={deselectAll} variant="outline" disabled={optimizing}>
            Deselect All
          </Button>
          <Button onClick={fetchImages} variant="outline" disabled={optimizing}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="font-semibold">
              {totalSelected} image{totalSelected !== 1 ? 's' : ''} selected
            </p>
            <p className="text-sm text-muted-foreground">
              Total size: {formatFileSize(totalSize)}
            </p>
          </div>
          <Button
            onClick={optimizeSelectedImages}
            disabled={optimizing || totalSelected === 0}
          >
            {optimizing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4 mr-2" />
                Optimize Selected
              </>
            )}
          </Button>
        </div>

        {optimizing && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images
          .filter((img) => img.name.toLowerCase().includes(search.toLowerCase()))
          .map((image) => (
          <Card
            key={image.id}
            className={`p-2 cursor-pointer transition-all ${
              selectedImages.has(image.id) ? 'ring-2 ring-primary' : ''
            } ${image.isStatic ? 'border-yellow-500 border-2' : ''}`}
            onClick={() => !optimizing && toggleImageSelection(image.id)}
          >
            <div className="relative">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <Checkbox
                checked={selectedImages.has(image.id)}
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleImageSelection(image.id);
                }}
              />
              {image.isStatic && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Static
                </div>
              )}
            </div>
            <p className="text-xs font-medium truncate" title={image.name}>
              {image.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {image.size > 0 ? formatFileSize(image.size) : 'Static file'}
            </p>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No images found in storage</p>
        </div>
      )}
    </div>
  );
}
