import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Copy, Trash2 } from 'lucide-react';
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
  folder_path?: string;
  url: string;
  created_at: string;
}

export const ImageUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [deletedImages, setDeletedImages] = useState<Set<string>>(new Set());
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);
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

  const uploadImage = async (file: File, folderPath?: string) => {
    try {
      // Optimize the image
      const { blob, width, height, originalSize } = await optimizeImage(file);
      
      // Generate unique file name with optional folder path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save metadata to database with folder path
      const { error: dbError } = await supabase
        .from('uploaded_images')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_size: blob.size,
          original_size: originalSize,
          mime_type: 'image/jpeg',
          width,
          height,
          folder_path: folderPath
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

    const items = Array.from(e.dataTransfer.items);
    const allFiles: { file: File; folderPath: string }[] = [];

    // Process all items (files and folders)
    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await processEntry(entry, allFiles, '');
        }
      }
    }

    const imageFiles = allFiles.filter(({ file }) => file.type.startsWith('image/'));
    setUploadProgress({ current: 0, total: imageFiles.length });

    for (let i = 0; i < imageFiles.length; i++) {
      setUploadProgress({ current: i + 1, total: imageFiles.length });
      await uploadImage(imageFiles[i].file, imageFiles[i].folderPath);
    }

    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });
  }, []);

  // Helper to process directory entries recursively
  const processEntry = async (entry: any, files: { file: File; folderPath: string }[], path = ''): Promise<void> => {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) => {
        entry.file(resolve);
      });
      files.push({ file, folderPath: path });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const entries = await new Promise<any[]>((resolve) => {
        dirReader.readEntries(resolve);
      });
      
      const newPath = path ? `${path}/${entry.name}` : entry.name;
      for (const subEntry of entries) {
        await processEntry(subEntry, files, newPath);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    for (let i = 0; i < files.length; i++) {
      setUploadProgress({ current: i + 1, total: files.length });
      await uploadImage(files[i]);
    }

    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });
    e.target.value = '';
  };

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    // Extract folder path from webkitRelativePath
    for (let i = 0; i < files.length; i++) {
      setUploadProgress({ current: i + 1, total: files.length });
      const file = files[i];
      const relativePath = (file as any).webkitRelativePath || '';
      const folderPath = relativePath.split('/').slice(0, -1).join('/');
      await uploadImage(file, folderPath);
    }

    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });
    e.target.value = '';
  };

  const handleDelete = async (image: UploadedImage) => {
    // Mark as deleted temporarily
    setDeletedImages(prev => new Set([...prev, image.id]));
    
    // Clear any existing timeout
    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }

    // Show undo toast
    const { dismiss } = toast({
      title: 'Image deleted',
      description: 'Click undo to restore',
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDeletedImages(prev => {
              const newSet = new Set(prev);
              newSet.delete(image.id);
              return newSet;
            });
            if (undoTimeout) clearTimeout(undoTimeout);
            dismiss();
            toast({
              title: 'Deletion cancelled'
            });
          }}
        >
          Undo
        </Button>
      ),
    });

    // Set timeout for permanent deletion
    const timeout = setTimeout(async () => {
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

        setDeletedImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(image.id);
          return newSet;
        });

        fetchImages();
      } catch (error) {
        console.error('Delete error:', error);
        setDeletedImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(image.id);
          return newSet;
        });
        toast({
          title: 'Delete failed',
          description: error instanceof Error ? error.message : 'Failed to delete image',
          variant: 'destructive'
        });
      }
    }, 5000); // 5 second delay

    setUndoTimeout(timeout);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'URL copied to clipboard'
    });
  };

  const copySelectedUrls = () => {
    const selectedUrls = images
      .filter(img => selectedImages.has(img.id))
      .map(img => img.url)
      .join('\n');
    
    navigator.clipboard.writeText(selectedUrls);
    toast({
      title: `Copied ${selectedImages.size} URL(s) to clipboard`,
      description: 'Each URL is on a new line'
    });
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (selectedImages.size > 0) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const toggleSelectImage = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedImages.size === 0) return;

    const imagesToDelete = images.filter(img => selectedImages.has(img.id));
    
    // Mark all as deleted temporarily
    setDeletedImages(prev => new Set([...prev, ...imagesToDelete.map(img => img.id)]));
    
    // Clear any existing timeout
    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }

    // Show undo toast
    const { dismiss } = toast({
      title: `Deleting ${selectedImages.size} image(s)`,
      description: 'Click undo to restore',
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDeletedImages(prev => {
              const newSet = new Set(prev);
              imagesToDelete.forEach(img => newSet.delete(img.id));
              return newSet;
            });
            if (undoTimeout) clearTimeout(undoTimeout);
            dismiss();
            toast({
              title: 'Deletion cancelled'
            });
          }}
        >
          Undo
        </Button>
      ),
    });

    // Set timeout for permanent deletion
    const timeout = setTimeout(async () => {
      for (const image of imagesToDelete) {
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
        } catch (error) {
          console.error('Delete error:', error);
        }
      }

      setDeletedImages(prev => {
        const newSet = new Set(prev);
        imagesToDelete.forEach(img => newSet.delete(img.id));
        return newSet;
      });

      toast({
        title: `Deleted ${selectedImages.size} image(s)`
      });

      setSelectedImages(new Set());
      fetchImages();
    }, 5000); // 5 second delay

    setUndoTimeout(timeout);
  };

  return (
    <div className="space-y-6" onClick={handleCloseContextMenu}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Image Library</h2>
          <p className="text-muted-foreground">
            Upload and optimize images. Drag & drop or click to select files or folders.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedImages.size >= 2 && (
            <Button
              variant="outline"
              onClick={copySelectedUrls}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Copy {selectedImages.size} URLs
            </Button>
          )}
          <label>
            <input
              type="file"
              multiple
              {...({ webkitdirectory: '', directory: '' } as any)}
              className="hidden"
              onChange={handleFolderSelect}
              disabled={uploading}
            />
            <Button variant="outline" disabled={uploading} asChild>
              <span className="cursor-pointer">Upload Folder</span>
            </Button>
          </label>
        </div>
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
              {uploadProgress.total > 0 && (
                <p className="text-sm text-muted-foreground">
                  {uploadProgress.current} of {uploadProgress.total} images
                </p>
              )}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Uploaded Images ({images.length})</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
              >
                {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedImages.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelected}
                >
                  Delete Selected ({selectedImages.size})
                </Button>
              )}
              {deletedImages.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (undoTimeout) clearTimeout(undoTimeout);
                    setDeletedImages(new Set());
                    toast({
                      title: 'Deletion cancelled'
                    });
                  }}
                >
                  Undo ({deletedImages.size})
                </Button>
              )}
            </div>
          </div>

          {/* Group images by folder */}
          {(() => {
            const grouped = images.reduce((acc, img) => {
              const folder = img.folder_path || 'Ungrouped';
              if (!acc[folder]) acc[folder] = [];
              acc[folder].push(img);
              return acc;
            }, {} as Record<string, UploadedImage[]>);

            return Object.entries(grouped).map(([folder, folderImages]) => (
              <div key={folder} className="mb-8">
                <h4 className="text-md font-semibold mb-3 text-muted-foreground">
                  {folder === 'Ungrouped' ? '📁 Ungrouped' : `📁 ${folder}`} ({folderImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" onContextMenu={handleContextMenu}>
            {folderImages.map((image) => {
              const isDeleted = deletedImages.has(image.id);
              return (
              <Card 
                key={image.id} 
                className={cn(
                  "overflow-hidden group relative cursor-pointer transition-all",
                  selectedImages.has(image.id) && "ring-2 ring-primary",
                  isDeleted && "opacity-50"
                )}
                onClick={() => !isDeleted && toggleSelectImage(image.id)}
              >
                <div className="aspect-square relative bg-muted">
                  <img
                    src={image.url}
                    alt={image.file_name}
                    className="w-full h-full object-cover"
                  />
                  {isDeleted && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <span className="text-white font-semibold">Deleting...</span>
                    </div>
                  )}
                  {selectedImages.has(image.id) && !isDeleted && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
                      <X className="h-4 w-4" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedImages.size > 1) {
                          copySelectedUrls();
                        } else {
                          copyUrl(image.url);
                        }
                      }}
                    >
                      <ImageIcon className="h-4 w-4 mr-1" />
                      {selectedImages.size > 1 ? `Copy ${selectedImages.size} URLs` : 'Copy URL'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image);
                      }}
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
            );
            })}
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
};
