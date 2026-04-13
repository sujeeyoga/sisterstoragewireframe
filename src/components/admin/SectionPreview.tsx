import React, { useMemo, useRef, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { slugsForFilter } from '@/hooks/useShopSections';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionPreviewProps {
  title: string;
  subtitle: string | null;
  categoryFilter: string | null;
  layoutColumns: number;
  visible: boolean;
  sectionName?: string;
}

const colsClass: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

const SisterStoryCard = ({ story }: { story: any }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 w-24 rounded-lg overflow-hidden border bg-card"
      style={{ aspectRatio: '9/16' }}
      onMouseEnter={() => {
        videoRef.current?.play();
        setPlaying(true);
      }}
      onMouseLeave={() => {
        videoRef.current?.pause();
        setPlaying(false);
      }}
    >
      {story.thumbnail_url ? (
        <img
          src={story.thumbnail_url}
          alt={story.title}
          className={cn('absolute inset-0 w-full h-full object-cover', playing && 'opacity-0')}
        />
      ) : null}
      <video
        ref={videoRef}
        src={story.video_url}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Play className="h-4 w-4 text-white fill-white" />
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-[10px] font-medium text-white truncate">{story.author}</p>
      </div>
    </div>
  );
};

export const SectionPreview: React.FC<SectionPreviewProps> = ({
  title,
  subtitle,
  categoryFilter,
  layoutColumns,
  visible,
  sectionName,
}) => {
  const [open, setOpen] = useState(true);
  const { data: allProducts = [] } = useProducts();

  const isStyledBySisters = sectionName === 'styled-by-sisters';

  const { data: sisterStories = [] } = useQuery({
    queryKey: ['sister-stories-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sister_stories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data;
    },
    enabled: isStyledBySisters,
  });

  const products = useMemo(() => {
    if (!categoryFilter) return [];
    const slugs = slugsForFilter(categoryFilter);
    return allProducts.filter((p) => slugs.includes(p.category));
  }, [allProducts, categoryFilter]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground">
          <span className="flex items-center gap-2">
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Section Preview
          </span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div
          className={cn(
            'mt-3 rounded-lg border p-4 transition-opacity',
            !visible && 'opacity-40 grayscale'
          )}
        >
          {!visible && (
            <div className="mb-2 text-xs font-medium text-destructive uppercase tracking-wide flex items-center gap-1">
              <EyeOff className="h-3 w-3" /> Hidden from shop
            </div>
          )}

          <h3 className="text-lg font-bold uppercase tracking-wide text-foreground">
            {title || 'Untitled Section'}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5 mb-3">
              {subtitle}
            </p>
          )}

          {/* Sister Stories carousel */}
          {isStyledBySisters ? (
            sisterStories.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 mt-2">
                {sisterStories.map((story) => (
                  <SisterStoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-4 text-center">
                No active sister stories found
              </p>
            )
          ) : products.length > 0 ? (
            <div className={cn('grid gap-3', colsClass[layoutColumns] || 'grid-cols-3')}>
              {products.slice(0, layoutColumns * 2).map((product) => (
                <div
                  key={product.id}
                  className="rounded-md border bg-card overflow-hidden"
                >
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${product.price?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic py-4 text-center">
              {categoryFilter
                ? `No products found for "${categoryFilter}"`
                : 'No category filter set'}
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
