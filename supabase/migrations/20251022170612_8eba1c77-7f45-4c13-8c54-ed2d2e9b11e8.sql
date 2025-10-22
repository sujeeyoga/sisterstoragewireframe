
-- Shift all existing sister stories down by 1 to make room for new first story
UPDATE sister_stories 
SET display_order = display_order + 1;

-- Insert the new sister story as the first one
INSERT INTO sister_stories (
  title,
  author,
  description,
  video_url,
  video_path,
  thumbnail_url,
  display_order,
  is_active
) VALUES (
  'The Perfect Solution for Brown Girls',
  'Sister Storage Customer',
  'The perfect solution for us brown girls and our bangles collection! Also makes for a perfect gift.',
  '/lovable-uploads/sister-story-brown-girls-bangles.mp4',
  '/lovable-uploads/sister-story-brown-girls-bangles.mp4',
  '/lovable-uploads/sister-story-brown-girls-bangles.mp4',
  0,
  true
);
