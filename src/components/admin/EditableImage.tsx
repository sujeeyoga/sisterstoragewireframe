import { useState, useRef, useEffect } from 'react';
import { useAdminEditMode } from '@/contexts/AdminEditModeContext';
import { Upload, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditableImageProps {
  heroImageId?: string;
  src: string;
  alt?: string;
  className?: string;
  onImageChange?: (newSrc: string) => void;
}

export function EditableImage({ 
  heroImageId, 
  src, 
  alt = '', 
  className = '',
  onImageChange 
}: EditableImageProps) {
  const { isEditMode, updateHeroImage } = useAdminEditMode();
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const touchCapable = typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
    setIsTouch(touchCapable);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG, PNG, WebP, or GIF image",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10485760) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Organize uploads by type and date for better management
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 9);
      
      // Determine folder based on context
      const folder = heroImageId ? 'hero-images' : 'site-content';
      const fileName = `${timestamp}-${randomId}.${fileExt}`;
      const filePath = `${folder}/${date}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('admin-content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('admin-content')
        .getPublicUrl(filePath);

      // Update database if hero image
      if (heroImageId) {
        await updateHeroImage(heroImageId, publicUrl, alt);
      }

      // Call callback if provided
      if (onImageChange) {
        onImageChange(publicUrl);
      }

      toast({
        title: "Success",
        description: "Image uploaded and optimized successfully"
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = "Failed to upload image";
      if (error.message?.includes('policies')) {
        errorMessage = "Upload permission denied. Please ensure you're logged in as an admin.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!isEditMode) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={src} 
        alt={alt} 
        className={`${className} ${isEditMode ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {(isHovered || isUploading) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
          {isUploading ? (
            <div className="text-white text-sm">Uploading...</div>
          ) : (
            <div className="flex flex-col items-center text-white">
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm">Click to change</span>
            </div>
          )}
        </div>
      )}
      {(isHovered || isTouch) && !isUploading && (
        <Pencil className="absolute top-2 right-2 w-6 h-6 text-white bg-primary rounded-full p-1 border-2 border-white" />
      )}
    </div>
  );
}
