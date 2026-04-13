import React, { useMemo, useRef, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { slugsForFilter } from '@/hooks/useShopSections';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, ChevronDown, ChevronUp, Play, Plus, Edit, Trash2, X, Save, Upload, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { VideoUploaderInline } from './VideoUploaderInline';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SectionPreviewProps {
  title: string;
  subtitle: string | null;
  categoryFilter: string | null;
  layoutColumns: number;
  visible: boolean;
  sectionName?: string;
  backgroundColor?: string | null;
  sectionId?: string;
  productIds?: number[] | null;
  onProductIdsChange?: (ids: number[]) => void;
}

const colsClass: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

interface StoryFormData {
  title: string;
  author: string;
  description: string;
  video_url: string;
  video_path: string;
  display_order: number;
  is_active: boolean;
}

const emptyForm: StoryFormData = {
  title: '',
  author: '',
  description: '',
  video_url: '',
  video_path: '',
  display_order: 0,
  is_active: true,
};

const SisterStoryCard = ({
  story,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  story: any;
  onEdit: (story: any) => void;
  onDelete: (id: string) => void;
  onToggleActive: (story: any) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 w-24 rounded-lg overflow-hidden border bg-card group"
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
      {story.thumbnail_url && (
        <img
          src={story.thumbnail_url}
          alt={story.title}
          className={cn('absolute inset-0 w-full h-full object-cover', playing && 'opacity-0')}
        />
      )}
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

      {/* Overlay controls on hover */}
      <div className="absolute top-0 inset-x-0 p-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(story); }}
          className="bg-black/60 rounded p-0.5 hover:bg-black/80"
        >
          <Edit className="h-3 w-3 text-white" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleActive(story); }}
          className="bg-black/60 rounded p-0.5 hover:bg-black/80"
        >
          {story.is_active ? <Eye className="h-3 w-3 text-white" /> : <EyeOff className="h-3 w-3 text-red-400" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(story.id); }}
          className="bg-black/60 rounded p-0.5 hover:bg-red-600/80"
        >
          <Trash2 className="h-3 w-3 text-white" />
        </button>
      </div>

      {!story.is_active && (
        <div className="absolute top-1 left-1 bg-red-600/80 rounded px-1">
          <span className="text-[8px] text-white font-bold">HIDDEN</span>
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-[10px] font-medium text-white truncate">{story.author}</p>
      </div>
    </div>
  );
};

const StoryEditDialog = ({
  open,
  onOpenChange,
  editingStory,
  formData,
  setFormData,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingStory: any | null;
  formData: StoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<StoryFormData>>;
  onSave: () => void;
  saving: boolean;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{editingStory ? 'Edit Story' : 'Add Sister Story'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs">Author Handle</Label>
          <Input
            value={formData.author}
            onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))}
            placeholder="@username"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            placeholder="Story title"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Upload Video</Label>
          <VideoUploaderInline
            onUploadComplete={(videoUrl, videoPath) => {
              setFormData((p) => ({ ...p, video_url: videoUrl, video_path: videoPath }));
            }}
          />
        </div>
        {formData.video_url && (
          <div className="space-y-1">
            <Label className="text-xs">Video URL</Label>
            <Input
              value={formData.video_url}
              onChange={(e) => setFormData((p) => ({ ...p, video_url: e.target.value }))}
              placeholder="Or paste video URL"
            />
            <video src={formData.video_url} className="w-full rounded-md aspect-[9/16] object-cover mt-1" muted playsInline preload="metadata" />
          </div>
        )}
        {!formData.video_url && (
          <div className="space-y-1">
            <Label className="text-xs">Or Paste Video URL</Label>
            <Input
              value={formData.video_url}
              onChange={(e) => setFormData((p) => ({ ...p, video_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        )}
        <div className="space-y-1">
          <Label className="text-xs">Video Path</Label>
          <Input
            value={formData.video_path}
            onChange={(e) => setFormData((p) => ({ ...p, video_path: e.target.value }))}
            placeholder="sister-stories/file.mp4"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.is_active}
            onCheckedChange={(v) => setFormData((p) => ({ ...p, is_active: v }))}
          />
          <Label className="text-xs">Active</Label>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={onSave} disabled={saving || !formData.video_url || !formData.author || !formData.title}>
            <Save className="h-3.5 w-3.5 mr-1" />
            {saving ? 'Saving...' : editingStory ? 'Update' : 'Add Story'}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export const SectionPreview: React.FC<SectionPreviewProps> = ({
  title,
  subtitle,
  categoryFilter,
  layoutColumns,
  visible,
  sectionName,
  backgroundColor,
  sectionId,
  productIds,
  onProductIdsChange,
}) => {
  const [open, setOpen] = useState(true);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const { data: allProducts = [] } = useProducts();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isHero = sectionName === 'hero';
  const isStyledBySisters = sectionName === 'styled-by-sisters';

  // Resolve bg color for inline style
  const bgStyle = React.useMemo(() => {
    if (!backgroundColor) return {};
    const hexMatch = backgroundColor.match(/bg-\[([^\]]+)\]/);
    if (hexMatch) return { backgroundColor: hexMatch[1] };
    if (backgroundColor.startsWith('#')) return { backgroundColor };
    return {};
  }, [backgroundColor]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<any | null>(null);
  const [formData, setFormData] = useState<StoryFormData>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [heroImageUploading, setHeroImageUploading] = useState(false);

  // Fetch hero image URL from store_settings
  const { data: heroImageUrl, refetch: refetchHeroImage } = useQuery({
    queryKey: ['shop-hero-image'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('setting_value')
        .eq('setting_key', 'shop_hero_image')
        .maybeSingle();
      const val = data?.setting_value;
      if (typeof val === 'object' && val !== null && 'url' in (val as any)) return (val as any).url as string;
      return 'https://sisterstorage.com/assets/hero-bg-main-Ck3XcIBP.jpg';
    },
    enabled: isHero,
  });

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroImageUploading(true);
    try {
      const filePath = `hero/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
      const newUrl = urlData.publicUrl;

      // Upsert into store_settings
      const { data: existing } = await supabase
        .from('store_settings')
        .select('id')
        .eq('setting_key', 'shop_hero_image')
        .maybeSingle();

      if (existing) {
        await supabase.from('store_settings').update({ setting_value: { url: newUrl } as any, enabled: true }).eq('setting_key', 'shop_hero_image');
      } else {
        await supabase.from('store_settings').insert([{ setting_key: 'shop_hero_image', setting_value: { url: newUrl } as any, enabled: true }]);
      }

      toast({ title: 'Hero image updated' });
      refetchHeroImage();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setHeroImageUploading(false);
    }
  };

  const handleHeroImageUrlChange = async (url: string) => {
    const { data: existing } = await supabase
      .from('store_settings')
      .select('id')
      .eq('setting_key', 'shop_hero_image')
      .maybeSingle();

    if (existing) {
      await supabase.from('store_settings').update({ setting_value: { url } as any, enabled: true }).eq('setting_key', 'shop_hero_image');
    } else {
      await supabase.from('store_settings').insert([{ setting_key: 'shop_hero_image', setting_value: { url } as any, enabled: true }]);
    }
    toast({ title: 'Hero image URL updated' });
    refetchHeroImage();
  };

  const { data: sisterStories = [], refetch: refetchStories } = useQuery({
    queryKey: ['sister-stories-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sister_stories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data;
    },
    enabled: isStyledBySisters,
  });

  // Products: use explicit productIds if set, otherwise filter by category
  const products = useMemo(() => {
    if (productIds && productIds.length > 0) {
      return allProducts.filter((p) => productIds.includes(Number(p.id)));
    }
    if (!categoryFilter) return [];
    const slugs = slugsForFilter(categoryFilter);
    return allProducts.filter((p) => slugs.includes(p.category));
  }, [allProducts, categoryFilter, productIds]);

  // Products available to add (not already in section)
  const availableProducts = useMemo(() => {
    const currentIds = productIds && productIds.length > 0 ? productIds : products.map((p) => Number(p.id));
    return allProducts.filter((p) => !currentIds.includes(Number(p.id)));
  }, [allProducts, products, productIds]);

  const handleRemoveProduct = (productId: number) => {
    if (!onProductIdsChange) return;
    const currentIds: number[] = productIds && productIds.length > 0 ? [...productIds] : products.map((p) => Number(p.id));
    onProductIdsChange(currentIds.filter((id) => id !== productId));
  };

  const handleAddProduct = (productId: number) => {
    if (!onProductIdsChange) return;
    const currentIds: number[] = productIds && productIds.length > 0 ? [...productIds] : products.map((p) => Number(p.id));
    onProductIdsChange([...currentIds, productId]);
    setAddProductOpen(false);
  };

  const handleEdit = (story: any) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      author: story.author,
      description: story.description || '',
      video_url: story.video_url,
      video_path: story.video_path,
      display_order: story.display_order ?? 0,
      is_active: story.is_active,
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingStory(null);
    const nextOrder = sisterStories.length > 0
      ? Math.max(...sisterStories.map((s: any) => s.display_order ?? 0)) + 1
      : 0;
    setFormData({ ...emptyForm, display_order: nextOrder });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingStory) {
        const { error } = await supabase
          .from('sister_stories')
          .update(formData)
          .eq('id', editingStory.id);
        if (error) throw error;
        toast({ title: 'Story updated' });
      } else {
        const { error } = await supabase
          .from('sister_stories')
          .insert([formData]);
        if (error) throw error;
        toast({ title: 'Story added' });
      }
      setDialogOpen(false);
      refetchStories();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this story?')) return;
    const { error } = await supabase.from('sister_stories').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Story deleted' });
      refetchStories();
    }
  };

  const handleToggleActive = async (story: any) => {
    const { error } = await supabase
      .from('sister_stories')
      .update({ is_active: !story.is_active })
      .eq('id', story.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      refetchStories();
    }
  };

  return (
    <>
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
              'mt-3 rounded-lg border p-4 transition-opacity overflow-hidden',
              !visible && 'opacity-40 grayscale'
            )}
            style={bgStyle}
          >
            {!visible && (
              <div className="mb-2 text-xs font-medium text-destructive uppercase tracking-wide flex items-center gap-1">
                <EyeOff className="h-3 w-3" /> Hidden from shop
              </div>
            )}

            {/* Hero preview */}
            {isHero ? (
              <div className="space-y-3">
                <div className="relative text-center py-10 rounded-lg overflow-hidden">
                  <img
                    src={heroImageUrl || 'https://sisterstorage.com/assets/hero-bg-main-Ck3XcIBP.jpg'}
                    alt="Hero background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-[0.9] text-white drop-shadow-lg">
                      {title || 'Untitled Section'}
                    </h3>
                    {subtitle && (
                      <p className="text-sm text-white/90 uppercase tracking-wide mt-2 font-medium drop-shadow">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hero image edit controls */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleHeroImageUpload}
                      disabled={heroImageUploading}
                    />
                    <Button variant="outline" size="sm" asChild disabled={heroImageUploading}>
                      <span>
                        <Upload className="h-3.5 w-3.5 mr-1" />
                        {heroImageUploading ? 'Uploading...' : 'Change Image'}
                      </span>
                    </Button>
                  </label>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={heroImageUrl || ''}
                      placeholder="https://..."
                      className="text-xs h-8"
                      onBlur={(e) => {
                        if (e.target.value && e.target.value !== heroImageUrl) {
                          handleHeroImageUrlChange(e.target.value);
                        }
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold uppercase tracking-wide text-foreground">
                  {title || 'Untitled Section'}
                </h3>
                {subtitle && (
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5 mb-3">
                    {subtitle}
                  </p>
                )}
              </>
            )}

            {/* Sister Stories carousel with inline controls */}
            {isStyledBySisters ? (
              <div className="space-y-3 mt-2">
                {sisterStories.length > 0 ? (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {sisterStories.map((story: any) => (
                      <SisterStoryCard
                        key={story.id}
                        story={story}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic py-4 text-center">
                    No sister stories yet
                  </p>
                )}
                <Button variant="outline" size="sm" onClick={handleAdd} className="w-full">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Sister Story
                </Button>
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-3">
                <div className={cn('grid gap-3', colsClass[layoutColumns] || 'grid-cols-3')}>
                  {products.map((product) => (
                    <div key={product.id} className="rounded-md border bg-card overflow-hidden relative group">
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
                        <p className="text-xs text-muted-foreground">${product.price?.toFixed(2)}</p>
                      </div>
                      {onProductIdsChange && (
                        <button
                          onClick={() => handleRemoveProduct(Number(product.id))}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove from section"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {onProductIdsChange && (
                  <Popover open={addProductOpen} onOpenChange={setAddProductOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Product
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 max-h-64 overflow-y-auto p-2" align="start">
                      {availableProducts.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-2">No more products to add</p>
                      ) : (
                        <div className="space-y-1">
                          {availableProducts.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => handleAddProduct(Number(p.id))}
                              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-accent text-left"
                            >
                              {p.images?.[0] && (
                                <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded object-cover" />
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-medium truncate">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground">${p.price?.toFixed(2)}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                )}
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

      {/* Edit/Add dialog */}
      {isStyledBySisters && (
        <StoryEditDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingStory={editingStory}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </>
  );
};
