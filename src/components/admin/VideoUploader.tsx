import { useState, useCallback } from 'react';
import { Upload, X, Video, Loader2, Copy, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UploadedVideo {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  duration?: number;
  width?: number;
  height?: number;
  folder_path?: string;
  url: string;
  created_at: string;
}

export const VideoUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [videos, setVideos] = useState<UploadedVideo[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [deletedVideos, setDeletedVideos] = useState<Set<string>>(new Set());
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Fetch uploaded videos
  const fetchVideos = useCallback(async () => {
    const { data, error } = await supabase
      .from('uploaded_videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return;
    }

    const videosWithUrls = await Promise.all(
      (data || []).map(async (vid) => {
        const { data: urlData } = supabase.storage
          .from('videos')
          .getPublicUrl(vid.file_path);
        
        return {
          ...vid,
          url: urlData.publicUrl
        };
      })
    );

    setVideos(videosWithUrls);
  }, []);

  // Load videos on mount
  useState(() => {
    fetchVideos();
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Get video metadata using a video element
  const getVideoMetadata = (file: File): Promise<{ duration: number; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight
        });
      };

      video.onerror = () => {
        reject(new Error('Failed to load video metadata'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const uploadVideo = async (file: File, folderPath?: string) => {
    try {
      // Validate video file type
      const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid video format. Please upload MP4, WebM, or MOV files.');
      }

      // Get video metadata
      const metadata = await getVideoMetadata(file);
      
      // Sanitize folder path
      const sanitizedFolderPath = folderPath
        ?.replace(/[×]/g, 'x')
        ?.replace(/[^\w\s\-\/]/g, '')
        ?.replace(/\s+/g, '-')
        ?.replace(/-+/g, '-')
        ?.trim();
      
      // Sanitize file name
      const sanitizedFileName = file.name
        .replace(/[×]/g, 'x')
        .replace(/[^\w\s\-\.]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = sanitizedFolderPath ? `${sanitizedFolderPath}/${fileName}` : fileName;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('uploaded_videos')
        .insert({
          file_name: sanitizedFileName,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          duration: metadata.duration,
          width: metadata.width,
          height: metadata.height,
          folder_path: sanitizedFolderPath
        });

      if (dbError) throw dbError;

      toast({
        title: 'Video uploaded',
        description: `${sanitizedFileName} (${(file.size / (1024 * 1024)).toFixed(2)}MB, ${Math.round(metadata.duration)}s)`
      });

      fetchVideos();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload video',
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

    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await processEntry(entry, allFiles, '');
        }
      }
    }

    const videoFiles = allFiles.filter(({ file }) => 
      file.type.startsWith('video/')
    );
    setUploadProgress({ current: 0, total: videoFiles.length });

    for (let i = 0; i < videoFiles.length; i++) {
      setUploadProgress({ current: i + 1, total: videoFiles.length });
      await uploadVideo(videoFiles[i].file, videoFiles[i].folderPath);
    }

    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });
  }, []);

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
      await uploadVideo(files[i]);
    }

    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });
    e.target.value = '';
  };

  const handleDelete = async (video: UploadedVideo) => {
    setDeletedVideos(prev => new Set([...prev, video.id]));
    
    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }

    const { dismiss } = toast({
      title: 'Video deleted',
      description: 'Click undo to restore',
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDeletedVideos(prev => {
              const newSet = new Set(prev);
              newSet.delete(video.id);
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

    const timeout = setTimeout(async () => {
      try {
        const { error: storageError } = await supabase.storage
          .from('videos')
          .remove([video.file_path]);

        if (storageError) throw storageError;

        const { error: dbError } = await supabase
          .from('uploaded_videos')
          .delete()
          .eq('id', video.id);

        if (dbError) throw dbError;

        setDeletedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(video.id);
          return newSet;
        });

        fetchVideos();
      } catch (error) {
        console.error('Delete error:', error);
        setDeletedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(video.id);
          return newSet;
        });
        toast({
          title: 'Delete failed',
          description: error instanceof Error ? error.message : 'Failed to delete video',
          variant: 'destructive'
        });
      }
    }, 5000);

    setUndoTimeout(timeout);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'URL copied to clipboard'
    });
  };

  const toggleSelectVideo = (videoId: string) => {
    const newSelected = new Set(selectedVideos);
    if (newSelected.has(videoId)) {
      newSelected.delete(videoId);
    } else {
      newSelected.add(videoId);
    }
    setSelectedVideos(newSelected);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)}KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Video Library</h2>
          <p className="text-muted-foreground">
            Upload and manage videos. Supports MP4, WebM, and MOV formats.
          </p>
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
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
              <p className="text-lg font-medium">Uploading videos...</p>
              {uploadProgress.total > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {uploadProgress.current} of {uploadProgress.total}
                </p>
              )}
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Drop videos here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Supports MP4, WebM, and MOV formats
              </p>
            </>
          )}
        </label>
      </Card>

      {/* Video Grid */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos
            .filter(video => !deletedVideos.has(video.id))
            .map((video) => (
              <Card
                key={video.id}
                className={cn(
                  'overflow-hidden cursor-pointer transition-all',
                  selectedVideos.has(video.id) && 'ring-2 ring-primary'
                )}
                onClick={() => toggleSelectVideo(video.id)}
              >
                <div className="aspect-video bg-muted relative group">
                  <video
                    src={video.url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-medium truncate mb-2">{video.file_name}</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Size: {formatFileSize(video.file_size)}</p>
                    <p>Duration: {formatDuration(video.duration)}</p>
                    {video.width && video.height && (
                      <p>Resolution: {video.width}×{video.height}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyUrl(video.url);
                      }}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(video);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {videos.length === 0 && !uploading && (
        <div className="text-center py-12 text-muted-foreground">
          <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No videos uploaded yet</p>
        </div>
      )}
    </div>
  );
};