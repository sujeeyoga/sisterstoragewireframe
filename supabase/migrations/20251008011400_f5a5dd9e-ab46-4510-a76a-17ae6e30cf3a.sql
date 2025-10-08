-- Remove Video-524.mp4 from sister storage bucket
DELETE FROM storage.objects 
WHERE bucket_id = 'sister' 
AND name = 'Video-524.mp4';