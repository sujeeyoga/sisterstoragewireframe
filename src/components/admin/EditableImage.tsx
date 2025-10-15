import { useState, useRef } from 'react';
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

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
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
        description: "Image uploaded successfully"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
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
      {isHovered && !isUploading && (
        <Pencil className="absolute top-2 right-2 w-6 h-6 text-white bg-primary rounded-full p-1 border-2 border-white" />
      )}
    </div>
  );
}
