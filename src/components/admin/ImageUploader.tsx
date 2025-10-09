import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { optimizeImage } from '@/lib/imageOptimizer';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UploadedImage {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  original_size: number;
  url: string;
  created_at: string;
}

export const ImageUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const { toast } = useToast();

  // Fetch uploaded images
  const fetchImages = useCallback(async () => {
    const { data, error } = await supabase
      .from('uploaded_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
      return;
    }

    const imagesWithUrls = await Promise.all(
      (data || []).map(async (img) => {
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(img.file_path);
        
        return {
          ...img,
          url: urlData.publicUrl
        };
      })
    );

    setImages(imagesWithUrls);
  }, []);

  // Load images on mount
  useState(() => {
    fetchImages();
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadImage = async (file: File) => {
    try {
      // Optimize the image
      const { blob, width, height, originalSize } = await optimizeImage(file);
      
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('uploaded_images')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_size: blob.size,
          original_size: originalSize,
          mime_type: 'image/jpeg',
          width,
          height
        });

      if (dbError) throw dbError;

      const compressionPercent = Math.round(((originalSize - blob.size) / originalSize) * 100);
      
      toast({
        title: 'Image uploaded',
        description: `Compressed by ${compressionPercent}% (${(originalSize / 1024).toFixed(1)}KB → ${(blob.size / 1024).toFixed(1)}KB)`
      });

      fetchImages();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive'
      });
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploading(true);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    for (const file of files) {
      await uploadImage(file);
    }

    setUploading(false);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);

    for (const file of files) {
      await uploadImage(file);
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (image: UploadedImage) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([image.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploaded_images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      toast({
        title: 'Image deleted'
      });

      fetchImages();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Failed to delete image',
        variant: 'destructive'
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'URL copied to clipboard'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Image Library</h2>
        <p className="text-muted-foreground">
          Upload and optimize images. Drag & drop or click to select files.
        </p>
      </div>

      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragging ? 'border-primary bg-primary/5' : 'border-border',
          uploading && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
              <p className="text-lg font-medium">Optimizing and uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-1">Drop images here or click to browse</p>
              <p className="text-sm text-muted-foreground">Images will be automatically optimized</p>
            </>
          )}
        </label>
      </Card>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Uploaded Images ({images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group relative">
                <div className="aspect-square relative bg-muted">
                  <img
                    src={image.url}
                    alt={image.file_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyUrl(image.url)}
                    >
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Copy URL
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{image.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(image.file_size / 1024).toFixed(1)}KB
                    {image.original_size > image.file_size && (
                      <span className="text-green-600 ml-1">
                        (-{Math.round(((image.original_size - image.file_size) / image.original_size) * 100)}%)
                      </span>
                    )}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
