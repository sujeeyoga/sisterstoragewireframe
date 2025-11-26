import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedImage {
  id: string;
  file_name: string;
  file_path: string;
  folder_path?: string;
  url: string;
}

interface ImagePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imageUrls: string[]) => void;
  selectedUrls?: string[];
}

export function ImagePickerDialog({ 
  open, 
  onOpenChange, 
  onSelect,
  selectedUrls = []
}: ImagePickerDialogProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set(selectedUrls));

  useEffect(() => {
    if (open) {
      fetchImages();
      setSelectedImages(new Set(selectedUrls));
    }
  }, [open, selectedUrls]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('uploaded_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

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
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (url: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    onSelect(Array.from(selectedImages));
    onOpenChange(false);
  };

  const filteredImages = images.filter(img => 
    img.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.folder_path?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedImages = filteredImages.reduce((acc, img) => {
    const folder = img.folder_path || 'Ungrouped';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(img);
    return acc;
  }, {} as Record<string, UploadedImage[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Images</DialogTitle>
          <DialogDescription>
            Choose images from your uploads ({selectedImages.size} selected)
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-6">
              {Object.entries(groupedImages).map(([folder, folderImages]) => (
                <div key={folder}>
                  <h3 className="text-sm font-semibold mb-3">
                    📁 {folder} ({folderImages.length})
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {folderImages.map((image) => (
                      <div
                        key={image.id}
                        className={cn(
                          "relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                          selectedImages.has(image.url)
                            ? "border-primary ring-2 ring-primary ring-offset-2"
                            : "border-transparent hover:border-muted-foreground/30"
                        )}
                        onClick={() => toggleImageSelection(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={image.file_name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Checkbox
                            checked={selectedImages.has(image.url)}
                            onCheckedChange={() => toggleImageSelection(image.url)}
                            className="bg-white border-2"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5">
                          <p className="text-xs text-white truncate">
                            {image.file_name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {filteredImages.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No images found
                </p>
              )}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Add Selected ({selectedImages.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
