import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AnimatedText from '@/components/ui/animated-text';
import { Loader2 } from 'lucide-react';

interface GalleryImage {
  id: string;
  file_path: string;
  file_name: string;
  width: number;
  height: number;
  url?: string;
}

const BrandGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('uploaded_images')
          .select('id, file_path, file_name, width, height')
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) throw error;

        if (data) {
          // Get public URLs for all images
          const imagesWithUrls = data.map(img => ({
            ...img,
            url: supabase.storage.from('images').getPublicUrl(img.file_path).data.publicUrl
          }));
          setImages(imagesWithUrls);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--brand-pink))]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12 text-center">
        <AnimatedText
          as="h2"
          className="text-3xl md:text-4xl font-bold mb-4 font-poppins"
          animation="breath-fade-up"
        >
          Brand in Action
        </AnimatedText>
        <AnimatedText
          as="p"
          className="text-lg font-thin text-gray-600 font-poppins max-w-2xl mx-auto"
          animation="breath-fade-up-2"
        >
          See how our bold aesthetic comes to life across product photography and lifestyle imagery
        </AnimatedText>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative overflow-hidden bg-gray-100 aspect-square"
            style={{ 
              borderRadius: '0px',
              animationDelay: `${index * 0.05}s`
            }}
          >
            <img
              src={image.url}
              alt={image.file_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-xs font-medium truncate font-poppins">
                  {image.file_name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 font-poppins">No images available yet</p>
        </div>
      )}
    </div>
  );
};

export default BrandGallery;
