import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2, MoveUp, MoveDown, Plus, Image as ImageIcon } from 'lucide-react';

interface HeroImage {
  id: string;
  image_url: string;
  position: 'spotlight' | 'gallery';
  display_order: number;
  is_active: boolean;
  alt_text: string | null;
}

interface UploadedImage {
  id: string;
  file_path: string;
  file_name: string;
}

export function HeroImagesManager() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHeroImages();
    fetchUploadedImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setHeroImages((data as HeroImage[]) || []);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      toast({
        title: 'Error',
        description: 'Failed to load hero images',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedImages = async () => {
    try {
      const { data, error } = await supabase
        .from('uploaded_images')
        .select('id, file_path, file_name')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setUploadedImages(data || []);
    } catch (error) {
      console.error('Error fetching uploaded images:', error);
    }
  };

  const addNewImage = async (imageUrl: string, position: 'spotlight' | 'gallery') => {
    try {
      const maxOrder = Math.max(...heroImages.map(img => img.display_order), 0);
      
      const { error } = await supabase
        .from('hero_images')
        .insert({
          image_url: imageUrl,
          position: position,
          display_order: maxOrder + 1,
          is_active: true,
          alt_text: 'Hero image',
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Image added to hero section',
      });
      
      fetchHeroImages();
      setShowImagePicker(false);
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: 'Error',
        description: 'Failed to add image',
        variant: 'destructive',
      });
    }
  };

  const updateImage = async (id: string, updates: Partial<HeroImage>) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setHeroImages(prev =>
        prev.map(img => (img.id === id ? { ...img, ...updates } : img))
      );

      toast({
        title: 'Success',
        description: 'Image updated',
      });
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: 'Error',
        description: 'Failed to update image',
        variant: 'destructive',
      });
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHeroImages(prev => prev.filter(img => img.id !== id));

      toast({
        title: 'Success',
        description: 'Image deleted',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  const moveImage = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = heroImages.findIndex(img => img.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= heroImages.length) return;

    const newOrder = [...heroImages];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];

    // Update display_order for both images
    try {
      const updates = newOrder.map((img, idx) => ({
        id: img.id,
        display_order: idx,
      }));

      for (const update of updates) {
        await supabase
          .from('hero_images')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      fetchHeroImages();
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder images',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hero Images</h2>
          <p className="text-muted-foreground">
            Manage images displayed on the home page hero section
          </p>
        </div>
        <Button onClick={() => setShowImagePicker(!showImagePicker)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>

      {showImagePicker && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Select Image to Add</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {uploadedImages.map((img) => {
              const imageUrl = `${supabase.storage.from('images').getPublicUrl(img.file_path).data.publicUrl}`;
              return (
                <div key={img.id} className="relative group">
                  <img
                    src={imageUrl}
                    alt={img.file_name}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-75 transition"
                  />
                  <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/50 rounded-lg">
                    <Button
                      size="sm"
                      onClick={() => addNewImage(`/lovable-uploads/${img.file_path}`, 'gallery')}
                    >
                      Add to Gallery
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold">Gallery Images</h3>
        {heroImages
          .filter(img => img.position === 'gallery')
          .map((image, index, array) => (
            <Card key={image.id} className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Hero image'}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>Alt Text</Label>
                      <Input
                        value={image.alt_text || ''}
                        onChange={(e) =>
                          updateImage(image.id, { alt_text: e.target.value })
                        }
                        placeholder="Describe this image"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Active</Label>
                      <Switch
                        checked={image.is_active}
                        onCheckedChange={(checked) =>
                          updateImage(image.id, { is_active: checked })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveImage(image.id, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveImage(image.id, 'down')}
                      disabled={index === array.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteImage(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
