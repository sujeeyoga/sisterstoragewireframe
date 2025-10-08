-- Remove Video-154.mp4 from sister storage bucket
DELETE FROM storage.objects 
WHERE bucket_id = 'sister' 
AND name = 'Video-154.mp4';