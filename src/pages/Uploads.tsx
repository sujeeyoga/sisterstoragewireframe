import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LayoutGrid, List, Copy, Trash2, Eye, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UploadedImage {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  original_size: number;
  folder_path?: string;
  width?: number;
  height?: number;
  url: string;
  created_at: string;
}

const Uploads = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  // Two-finger tap detection for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartTime = 0;
    let touchCount = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchStartTime = Date.now();
        touchCount = e.touches.length;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchDuration = Date.now() - touchStartTime;
      
      // Detect two-finger tap (quick touch with 2 fingers, less than 300ms)
      if (touchCount === 2 && touchDuration < 300 && e.changedTouches.length === 2) {
        e.preventDefault();
        setSelectionMode(prev => {
          const newMode = !prev;
          if (!newMode) {
            setSelectedImages(new Set());
          }
          toast({
            title: newMode ? 'Selection mode enabled' : 'Selection mode disabled',
            description: newMode ? 'Tap images to select them' : undefined,
          });
          return newMode;
        });
      }
      touchCount = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [toast]);

  const fetchImages = async () => {
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
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'URL copied to clipboard'
    });
  };

  const deleteImage = async (image: UploadedImage) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([image.file_path]);

      if (storageError) throw storageError;

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

  const previewImage = (image: UploadedImage) => {
    if (selectionMode) {
      toggleImageSelection(image.id);
    } else {
      setSelectedImage(image);
      setPreviewOpen(true);
    }
  };

  const handleCardPress = (imageId: string, e: React.TouchEvent | React.MouseEvent) => {
    if (selectionMode) {
      toggleImageSelection(imageId);
      return;
    }

    // For regular clicks/taps when not in selection mode
    const image = images.find(img => img.id === imageId);
    if (image) {
      setSelectedImage(image);
      setPreviewOpen(true);
    }
  };

  const handleLongPress = (imageId: string) => {
    // Enable selection mode and select this image
    setSelectionMode(true);
    setSelectedImages(new Set([imageId]));
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    toast({
      title: 'Selection mode enabled',
      description: 'Tap images to select more',
    });
  };

  const createLongPressHandlers = (imageId: string) => {
    let timeout: NodeJS.Timeout;
    let longPressTriggered = false;

    const start = (event: React.TouchEvent | React.MouseEvent) => {
      if (selectionMode) return;
      
      longPressTriggered = false;
      timeout = setTimeout(() => {
        handleLongPress(imageId);
        longPressTriggered = true;
      }, 500);
    };

    const clear = (event: React.TouchEvent | React.MouseEvent, shouldTriggerClick = true) => {
      if (timeout) clearTimeout(timeout);
      
      if (shouldTriggerClick && !longPressTriggered) {
        handleCardPress(imageId, event);
      }
    };

    return {
      onMouseDown: start,
      onMouseUp: (e: React.MouseEvent) => clear(e),
      onMouseLeave: (e: React.MouseEvent) => clear(e, false),
      onTouchStart: start,
      onTouchEnd: (e: React.TouchEvent) => clear(e),
    };
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const deleteSelectedImages = async () => {
    const imagesToDelete = images.filter(img => selectedImages.has(img.id));
    
    try {
      for (const image of imagesToDelete) {
        await supabase.storage.from('images').remove([image.file_path]);
        await supabase.from('uploaded_images').delete().eq('id', image.id);
      }

      toast({
        title: `${imagesToDelete.length} images deleted`,
      });

      setSelectedImages(new Set());
      setSelectionMode(false);
      fetchImages();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Failed to delete images',
        variant: 'destructive',
      });
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Uploads</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all uploaded images ({images.length} total)
            {selectionMode && ` • ${selectedImages.size} selected`}
          </p>
          {!selectionMode && (
            <p className="text-xs text-muted-foreground mt-1">
              💡 Tip: Long-press any card or use two-finger tap to select multiple
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {selectionMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectionMode(false);
                setSelectedImages(new Set());
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Selection
            </Button>
          )}
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4 mr-2" />
            Table View
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* Grid View */
        <div>
          {(() => {
            const grouped = images.reduce((acc, img) => {
              const folder = img.folder_path || 'Ungrouped';
              if (!acc[folder]) acc[folder] = [];
              acc[folder].push(img);
              return acc;
            }, {} as Record<string, UploadedImage[]>);

            return Object.entries(grouped).map(([folder, folderImages]) => (
              <div key={folder} className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  {folder === 'Ungrouped' ? '📁 Ungrouped' : `📁 ${folder}`} ({folderImages.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {folderImages.map((image) => {
                    const longPressHandlers = createLongPressHandlers(image.id);
                    
                    return (
                      <Card 
                        key={image.id} 
                        className={cn(
                          "overflow-hidden group relative",
                          selectedImages.has(image.id) && "ring-2 ring-primary"
                        )}
                      >
                        {selectionMode && (
                          <div className="absolute top-2 left-2 z-10">
                            <Checkbox
                              checked={selectedImages.has(image.id)}
                              onCheckedChange={() => toggleImageSelection(image.id)}
                              className="bg-white border-2"
                            />
                          </div>
                        )}
                        <div 
                          className="aspect-square relative bg-muted"
                          {...longPressHandlers}
                        >
                          <img
                            src={image.url}
                            alt={image.file_name}
                            className="w-full h-full object-cover cursor-pointer select-none"
                            draggable={false}
                          />
                          {!selectionMode && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 pointer-events-none">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="pointer-events-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  previewImage(image);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="pointer-events-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyUrl(image.url);
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="pointer-events-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteImage(image);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium truncate">{image.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(image.file_size / 1024).toFixed(1)}KB
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>
      ) : (
        /* Table View */
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Folder</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Compression</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <img
                      src={image.url}
                      alt={image.file_name}
                      className="w-16 h-16 object-cover rounded cursor-pointer"
                      onClick={() => previewImage(image)}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {image.file_name}
                  </TableCell>
                  <TableCell>
                    {image.folder_path || '-'}
                  </TableCell>
                  <TableCell>
                    {image.width && image.height ? `${image.width} × ${image.height}` : '-'}
                  </TableCell>
                  <TableCell>
                    {(image.file_size / 1024).toFixed(1)}KB
                  </TableCell>
                  <TableCell>
                    {image.original_size > image.file_size ? (
                      <span className="text-green-600">
                        -{Math.round(((image.original_size - image.file_size) / image.original_size) * 100)}%
                      </span>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(image.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => previewImage(image)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyUrl(image.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteImage(image)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.file_name}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.file_name}
                className="w-full rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Dimensions</p>
                  <p className="font-medium">
                    {selectedImage.width} × {selectedImage.height}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">File Size</p>
                  <p className="font-medium">
                    {(selectedImage.file_size / 1024).toFixed(1)}KB
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Compression</p>
                  <p className="font-medium text-green-600">
                    {selectedImage.original_size > selectedImage.file_size
                      ? `-${Math.round(((selectedImage.original_size - selectedImage.file_size) / selectedImage.original_size) * 100)}%`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded</p>
                  <p className="font-medium">
                    {format(new Date(selectedImage.created_at), 'PPP')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => copyUrl(selectedImage.url)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteImage(selectedImage);
                    setPreviewOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Bar */}
      {selectionMode && selectedImages.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-sm font-medium">
              {selectedImages.size} image{selectedImages.size !== 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedImages(new Set());
                }}
              >
                Deselect All
              </Button>
              <Button
                variant="destructive"
                onClick={deleteSelectedImages}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Uploads;
