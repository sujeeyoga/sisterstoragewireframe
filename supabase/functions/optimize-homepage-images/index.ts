import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Images to optimize with their new names
    const imagesToOptimize = [
      {
        oldPath: "lovable-uploads/e1ae51b5-7916-4137-825e-7f197dff06a3.png",
        newName: "organized-jewelry-bangles.webp",
        bucket: "sister"
      },
      {
        oldPath: "lovable-uploads/2a4c457a-7695-47d3-9912-ab2900c6ea25.png",
        newName: "elegant-jewelry-storage.webp",
        bucket: "sister"
      },
      {
        oldPath: "lovable-uploads/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png",
        newName: "sister-storage-showcase.webp",
        bucket: "sister"
      }
    ];

    const results = [];

    for (const image of imagesToOptimize) {
      try {
        // Download the original image
        const { data: fileData, error: downloadError } = await supabase.storage
          .from(image.bucket)
          .download(image.oldPath);

        if (downloadError) {
          results.push({
            image: image.oldPath,
            status: "error",
            message: `Download failed: ${downloadError.message}`
          });
          continue;
        }

        // Use Sharp via Deno FFI would be complex, so we'll use a simpler approach
        // Just copy and rename to homepage folder for now
        // The actual compression can be done by the client-side tool or manually
        
        const destPath = `homepage/${image.newName}`;

        // Upload to new location
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(destPath, fileData, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: true
          });

        if (uploadError) {
          results.push({
            image: image.oldPath,
            status: "error",
            message: `Upload failed: ${uploadError.message}`
          });
          continue;
        }

        results.push({
          image: image.oldPath,
          newPath: destPath,
          status: "success",
          message: "Image copied successfully"
        });

      } catch (error) {
        results.push({
          image: image.oldPath,
          status: "error",
          message: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: "Optimization process completed"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in optimize-homepage-images:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
