-- Add folder_path column to uploaded_images table
ALTER TABLE public.uploaded_images 
ADD COLUMN IF NOT EXISTS folder_path text;