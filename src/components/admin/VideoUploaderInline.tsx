import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, Film } from 'lucide-react';

interface VideoUploaderInlineProps {
  onUploadComplete: (videoUrl: string, videoPath: string) => void;
}

export const VideoUploaderInline = ({ onUploadComplete }: VideoUploaderInlineProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({ title: 'Invalid file', description: 'Please select a video file', variant: 'destructive' });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 100MB allowed', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setProgress(20);

    try {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `sister-stories/${timestamp}-${safeName}`;

      setProgress(40);

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      setProgress(80);

      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      setProgress(100);

      onUploadComplete(urlData.publicUrl, filePath);
      toast({ title: 'Video uploaded successfully' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleUpload}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading... {progress}%
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload Video File
          </>
        )}
      </Button>
      {uploading && (
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
