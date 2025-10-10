import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { optimizeImage } from '@/lib/imageOptimizer';
import { Progress } from '@/components/ui/progress';

interface ImageToMigrate {
  filename: string;
  sourcePath: string;
  targetPath: string;
}

const ImageMigrationTool = () => {
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [results, setResults] = useState<{ success: number; failed: number; skipped: number }>({
    success: 0,
    failed: 0,
    skipped: 0
  });

  const imagesToMigrate: ImageToMigrate[] = [
    // FeaturedGrid images
    { filename: '0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png', sourcePath: 'lovable-uploads/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png', targetPath: 'homepage/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.webp' },
    { filename: 'c44d4b5c-0104-4077-99dd-904d87ec4d8b.png', sourcePath: 'lovable-uploads/c44d4b5c-0104-4077-99dd-904d87ec4d8b.png', targetPath: 'homepage/c44d4b5c-0104-4077-99dd-904d87ec4d8b.webp' },
    { filename: '56a20345-d9f3-47ac-a645-23d19194af78.png', sourcePath: 'lovable-uploads/56a20345-d9f3-47ac-a645-23d19194af78.png', targetPath: 'homepage/56a20345-d9f3-47ac-a645-23d19194af78.webp' },
    { filename: 'f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.png', sourcePath: 'lovable-uploads/f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.png', targetPath: 'homepage/f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.webp' },
    { filename: 'e1ae51b5-7916-4137-825e-7f197dff06a3.png', sourcePath: 'lovable-uploads/e1ae51b5-7916-4137-825e-7f197dff06a3.png', targetPath: 'homepage/e1ae51b5-7916-4137-825e-7f197dff06a3.webp' },
    { filename: '8620f7af-c089-458c-bef9-78d6cd77f04e.png', sourcePath: 'lovable-uploads/8620f7af-c089-458c-bef9-78d6cd77f04e.png', targetPath: 'homepage/8620f7af-c089-458c-bef9-78d6cd77f04e.webp' },
    
    // Other homepage images
    { filename: 'b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png', sourcePath: 'lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png', targetPath: 'homepage/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.webp' },
    { filename: 'c3b682be-b949-4e16-8aff-82cc8e879642.png', sourcePath: 'lovable-uploads/c3b682be-b949-4e16-8aff-82cc8e879642.png', targetPath: 'homepage/c3b682be-b949-4e16-8aff-82cc8e879642.webp' },
    { filename: 'ce6528ec-56be-4176-919f-4285946c18b2.png', sourcePath: 'lovable-uploads/ce6528ec-56be-4176-919f-4285946c18b2.png', targetPath: 'homepage/ce6528ec-56be-4176-919f-4285946c18b2.webp' },
    { filename: 'c6544fac-3f2f-4a6a-a01e-5ca149720fcb.png', sourcePath: 'lovable-uploads/c6544fac-3f2f-4a6a-a01e-5ca149720fcb.png', targetPath: 'homepage/c6544fac-3f2f-4a6a-a01e-5ca149720fcb.webp' },
    { filename: '3e91b1f2-e5b6-4cee-a7b7-806a5815546b.png', sourcePath: 'lovable-uploads/3e91b1f2-e5b6-4cee-a7b7-806a5815546b.png', targetPath: 'homepage/3e91b1f2-e5b6-4cee-a7b7-806a5815546b.webp' },
    
    // Gallery images
    { filename: '160b5d30-ba2c-4e66-8423-c4a6288d1af0.png', sourcePath: 'lovable-uploads/160b5d30-ba2c-4e66-8423-c4a6288d1af0.png', targetPath: 'homepage/160b5d30-ba2c-4e66-8423-c4a6288d1af0.webp' },
    { filename: 'e9628188-8ef0-426b-9858-08b2848fd690.png', sourcePath: 'lovable-uploads/e9628188-8ef0-426b-9858-08b2848fd690.png', targetPath: 'homepage/e9628188-8ef0-426b-9858-08b2848fd690.webp' },
    { filename: 'ff4988e3-c51c-4391-a440-95e03d111656.png', sourcePath: 'lovable-uploads/ff4988e3-c51c-4391-a440-95e03d111656.png', targetPath: 'homepage/ff4988e3-c51c-4391-a440-95e03d111656.webp' },
    { filename: '2a4c457a-7695-47d3-9912-ab2900c6ea25.png', sourcePath: 'lovable-uploads/2a4c457a-7695-47d3-9912-ab2900c6ea25.png', targetPath: 'homepage/2a4c457a-7695-47d3-9912-ab2900c6ea25.webp' },
    { filename: '76c5f6ac-f27b-4f26-8377-759dfc17c71d.png', sourcePath: 'lovable-uploads/76c5f6ac-f27b-4f26-8377-759dfc17c71d.png', targetPath: 'homepage/76c5f6ac-f27b-4f26-8377-759dfc17c71d.webp' },
    { filename: 'b32a7860-b957-41e7-9c5c-cbd348260cf2.png', sourcePath: 'lovable-uploads/b32a7860-b957-41e7-9c5c-cbd348260cf2.png', targetPath: 'homepage/b32a7860-b957-41e7-9c5c-cbd348260cf2.webp' },
    { filename: '03cc68a5-5bfc-4417-bf01-d43578ffa321.png', sourcePath: 'lovable-uploads/03cc68a5-5bfc-4417-bf01-d43578ffa321.png', targetPath: 'homepage/03cc68a5-5bfc-4417-bf01-d43578ffa321.webp' },
    { filename: '4ef08ea3-3380-4111-b4a1-eb939cba275b.png', sourcePath: 'lovable-uploads/4ef08ea3-3380-4111-b4a1-eb939cba275b.png', targetPath: 'homepage/4ef08ea3-3380-4111-b4a1-eb939cba275b.webp' },
    { filename: 'a501115d-f6f4-4f74-bdbe-1b73ba1bc625.png', sourcePath: 'lovable-uploads/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.png', targetPath: 'homepage/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.webp' },
    { filename: 'e60a5afe-c0c9-4913-bf6a-eff94188c606.png', sourcePath: 'lovable-uploads/e60a5afe-c0c9-4913-bf6a-eff94188c606.png', targetPath: 'homepage/e60a5afe-c0c9-4913-bf6a-eff94188c606.webp' },
    { filename: 'fb8da55a-c9bb-419e-a96f-175a667875e1.png', sourcePath: 'lovable-uploads/fb8da55a-c9bb-419e-a96f-175a667875e1.png', targetPath: 'homepage/fb8da55a-c9bb-419e-a96f-175a667875e1.webp' }
  ];

  const migrateImages = async () => {
    setMigrating(true);
    setResults({ success: 0, failed: 0, skipped: 0 });
    setProgress(0);

    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < imagesToMigrate.length; i++) {
      const image = imagesToMigrate[i];
      setCurrentFile(image.filename);
      setProgress(Math.round(((i + 1) / imagesToMigrate.length) * 100));

      try {
        // Check if target already exists
        const { data: existingFile } = await supabase.storage
          .from('images')
          .list(image.targetPath.split('/')[0], {
            search: image.targetPath.split('/').pop()
          });

        if (existingFile && existingFile.length > 0) {
          console.log(`Skipping ${image.filename} - already exists`);
          skippedCount++;
          continue;
        }

        // Download source image from public folder
        const response = await fetch(`/${image.sourcePath}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${image.sourcePath}`);
        }

        const blob = await response.blob();
        const file = new File([blob], image.filename, { type: blob.type });

        // Optimize the image (convert to WebP, compress)
        const optimized = await optimizeImage(file, 1920, 1920, 0.85);

        // Upload to storage bucket as WebP
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(image.targetPath, optimized.blob, {
            contentType: 'image/webp',
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        console.log(`✓ Migrated ${image.filename} → ${image.targetPath}`);
        successCount++;

      } catch (error) {
        console.error(`✗ Failed to migrate ${image.filename}:`, error);
        failedCount++;
      }

      setResults({ success: successCount, failed: failedCount, skipped: skippedCount });
    }

    setMigrating(false);
    setCurrentFile('');
    
    toast.success(`Migration complete! Success: ${successCount}, Failed: ${failedCount}, Skipped: ${skippedCount}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Migration & Optimization Tool</CardTitle>
        <CardDescription>
          Migrate images from public/lovable-uploads to optimized WebP versions in Supabase Storage.
          This will convert {imagesToMigrate.length} images to WebP format and upload them to the images bucket.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={migrateImages} 
            disabled={migrating}
            size="lg"
          >
            {migrating ? 'Migrating...' : 'Start Migration'}
          </Button>
          
          {migrating && (
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {currentFile && `Processing: ${currentFile}`}
              </p>
            </div>
          )}
        </div>

        {(results.success > 0 || results.failed > 0 || results.skipped > 0) && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <h4 className="font-semibold">Migration Results:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-600 font-bold">{results.success}</span> Successful
              </div>
              <div>
                <span className="text-red-600 font-bold">{results.failed}</span> Failed
              </div>
              <div>
                <span className="text-yellow-600 font-bold">{results.skipped}</span> Skipped
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>What this tool does:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Downloads images from /lovable-uploads/</li>
            <li>Converts to WebP format for 70-90% smaller file sizes</li>
            <li>Optimizes with 85% quality and max 1920px dimension</li>
            <li>Uploads to images/homepage/ in Supabase Storage</li>
            <li>Skips files that already exist</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageMigrationTool;

