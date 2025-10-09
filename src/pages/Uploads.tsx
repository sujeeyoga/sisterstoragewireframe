import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LayoutGrid, List, Copy, Trash2, Eye } from 'lucide-react';
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
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

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
    setSelectedImage(image);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Uploads</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all uploaded images ({images.length} total)
          </p>
        </div>
        <div className="flex gap-2">
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
                  {folderImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden group">
                      <div className="aspect-square relative bg-muted">
                        <img
                          src={image.url}
                          alt={image.file_name}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => previewImage(image)}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => previewImage(image)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => copyUrl(image.url)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteImage(image)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{image.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(image.file_size / 1024).toFixed(1)}KB
                        </p>
                      </div>
                    </Card>
                  ))}
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
    </div>
  );
};

export default Uploads;
