import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { videoPath, title, author, description } = await req.json();

    // Increment all existing display orders by 1
    const { error: updateError } = await supabaseClient.rpc('exec_sql', {
      sql: 'UPDATE sister_stories SET display_order = display_order + 1'
    });

    // Since rpc might not be available, use a direct update approach
    // Get all existing stories
    const { data: existingStories, error: fetchError } = await supabaseClient
      .from('sister_stories')
      .select('id, display_order')
      .order('display_order', { ascending: false });

    if (fetchError) throw fetchError;

    // Update each story's display_order
    for (const story of existingStories || []) {
      await supabaseClient
        .from('sister_stories')
        .update({ display_order: story.display_order + 1 })
        .eq('id', story.id);
    }

    // Construct the video URL
    // Check if videoPath is already a full path (starts with / or http)
    let videoUrl: string;
    if (videoPath.startsWith('http')) {
      videoUrl = videoPath;
    } else if (videoPath.startsWith('/')) {
      // It's a path from public folder
      videoUrl = videoPath;
    } else {
      // It's just a filename, assume it's in the videos bucket
      videoUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/videos/${videoPath}`;
    }

    // Insert the new story at position 0
    const { data: newStory, error: insertError } = await supabaseClient
      .from('sister_stories')
      .insert({
        title,
        author,
        description,
        video_url: videoUrl,
        video_path: videoPath,
        display_order: 0,
        is_active: true
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true, story: newStory }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
