import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  GripVertical,
  Save,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  EyeOff,
  Eye,
} from 'lucide-react';
import { SectionPreview } from './SectionPreview';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Section = {
  id: string;
  name: string;
  title: string;
  subtitle: string | null;
  background_color: string;
  display_order: number;
  visible: boolean;
  layout_columns: number;
  category_filter: string | null;
  product_ids: number[] | null;
};

const COLOR_PRESETS = [
  { label: 'Default', value: 'bg-background', color: '#ffffff' },
  { label: 'White', value: 'bg-white', color: '#ffffff' },
  { label: 'Gray 50', value: 'bg-gray-50', color: '#f9fafb' },
  { label: 'Stone 100', value: 'bg-stone-100', color: '#f5f5f4' },
  { label: 'Pink 50', value: 'bg-pink-50', color: '#fdf2f8' },
  { label: 'Orange 50', value: 'bg-orange-50', color: '#fff7ed' },
  { label: 'Rose 50', value: 'bg-rose-50', color: '#fff1f2' },
  { label: 'Amber 50', value: 'bg-amber-50', color: '#fffbeb' },
];

const bgToHex = (bg: string | null) => {
  const preset = COLOR_PRESETS.find((p) => p.value === bg);
  if (preset) return preset.color;
  if (bg?.startsWith('#')) return bg;
  return '#ffffff';
};

// ── Sortable Section Card ──────────────────────────────────────────

const SortableSectionCard = ({
  section,
  editedSections,
  onSave,
  onChange,
  onReset,
  onDelete,
  onDuplicate,
  productCount,
  isSaving,
}: {
  section: Section;
  editedSections: Record<string, Section>;
  onSave: (id: string) => void;
  onChange: (id: string, field: keyof Section, value: any) => void;
  onReset: (id: string) => void;
  onDelete: (s: Section) => void;
  onDuplicate: (s: Section) => void;
  productCount: number | null;
  isSaving: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const editedSection = editedSections[section.id] || section;
  const hasChanges = JSON.stringify(editedSection) !== JSON.stringify(section);

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </button>
            <CardTitle className="text-lg flex items-center gap-2">
              {section.name}
              {productCount !== null && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {productCount} {section.name === 'styled-by-sisters' ? 'stories' : 'products'}
                </Badge>
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/shop#section-${section.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="View on Shop"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              onClick={() => onDuplicate(section)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Duplicate section"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(section)}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Delete section"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5 ml-2">
              <Switch
                checked={editedSection.visible}
                onCheckedChange={(checked) => {
                  onChange(section.id, 'visible', checked);
                  // auto-save visibility toggle
                  const updated = { ...(editedSections[section.id] || section), visible: checked };
                  supabase.from('shop_sections').update({ visible: checked }).eq('id', section.id).then(() => {});
                }}
              />
              <Label className="text-sm">Visible</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editedSection.title}
                onChange={(e) => onChange(section.id, 'title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={editedSection.subtitle || ''}
                onChange={(e) => onChange(section.id, 'subtitle', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category Filter</Label>
              <Input
                value={editedSection.category_filter || ''}
                onChange={(e) => onChange(section.id, 'category_filter', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Layout Columns</Label>
              <Input
                type="number"
                value={editedSection.layout_columns}
                onChange={(e) => onChange(section.id, 'layout_columns', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <span
                      className="h-4 w-4 rounded border"
                      style={{ backgroundColor: bgToHex(editedSection.background_color) }}
                    />
                    <span className="text-sm truncate">{editedSection.background_color || 'bg-background'}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        title={preset.label}
                        onClick={() => onChange(section.id, 'background_color', preset.value)}
                        className="h-8 w-8 rounded border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: preset.color,
                          borderColor: editedSection.background_color === preset.value ? '#000' : '#e5e7eb',
                        }}
                      />
                    ))}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Custom class / hex</Label>
                    <Input
                      value={editedSection.background_color || ''}
                      onChange={(e) => onChange(section.id, 'background_color', e.target.value)}
                      placeholder="bg-background or #hex"
                      className="h-8 text-xs"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {hasChanges && (
            <div className="flex gap-2">
              <Button onClick={() => onSave(section.id)} size="sm" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save & Publish'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => onReset(section.id)}>
                Undo Changes
              </Button>
            </div>
          )}

          <SectionPreview
            title={editedSection.title}
            subtitle={editedSection.subtitle}
            categoryFilter={editedSection.category_filter}
            layoutColumns={editedSection.layout_columns}
            visible={editedSection.visible}
            sectionName={editedSection.name}
            backgroundColor={editedSection.background_color}
            sectionId={section.id}
            productIds={editedSection.product_ids}
            onProductIdsChange={(ids) => onChange(section.id, 'product_ids', ids)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────

export const SectionsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editedSections, setEditedSections] = useState<Record<string, Section>>({});
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);
  const [newSection, setNewSection] = useState({ name: '', title: '', subtitle: '', category_filter: '', layout_columns: 3 });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['admin-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_sections')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as Section[];
    },
  });

  // Fetch product counts per category
  const { data: productCounts = {} } = useQuery({
    queryKey: ['admin-section-product-counts'],
    queryFn: async () => {
      const { data: products } = await supabase.from('woocommerce_products').select('categories').eq('visible', true);
      const { data: stories } = await supabase.from('sister_stories').select('id');
      return { _products: products || [], _stories: stories?.length || 0 };
    },
  });

  const getProductCount = useCallback((section: Section): number | null => {
    if (section.name === 'styled-by-sisters') return (productCounts as any)?._stories ?? null;
    if (!section.category_filter) return null;
    const products = (productCounts as any)?._products || [];
    const count = products.filter((p: any) => {
      const cats = p.categories || [];
      return cats.some((c: any) => c.name === section.category_filter || c.slug === section.category_filter);
    }).length;
    return count;
  }, [productCounts]);

  const updateMutation = useMutation({
    mutationFn: async (section: Section) => {
      const { error } = await supabase
        .from('shop_sections')
        .update({
          title: section.title,
          subtitle: section.subtitle,
          background_color: section.background_color,
          visible: section.visible,
          layout_columns: section.layout_columns,
          category_filter: section.category_filter,
          display_order: section.display_order,
          product_ids: section.product_ids,
        })
        .eq('id', section.id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast({ title: 'Section saved & published!' });
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
      queryClient.invalidateQueries({ queryKey: ['shop-sections'] });
      // Clear edited state for this section
      setEditedSections((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
    },
    onError: (error) => {
      toast({ title: 'Failed to update section', description: error.message, variant: 'destructive' });
    },
  });

  const handleSave = (id: string) => {
    const section = editedSections[id];
    if (section) updateMutation.mutate(section);
  };

  const handleReset = (id: string) => {
    setEditedSections((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleChange = (id: string, field: keyof Section, value: any) => {
    setEditedSections((prev) => {
      const current = prev[id] || sections.find((s) => s.id === id)!;
      return { ...prev, [id]: { ...current, [field]: value } };
    });
  };

  // ── Drag & Drop ──
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex);

    // Optimistic update
    queryClient.setQueryData(['admin-sections'], reordered.map((s, i) => ({ ...s, display_order: i })));

    // Batch update display_order
    const updates = reordered.map((s, i) =>
      supabase.from('shop_sections').update({ display_order: i }).eq('id', s.id)
    );
    await Promise.all(updates);
    queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
  };

  // ── Add Section ──
  const handleAddSection = async () => {
    if (!newSection.name || !newSection.title) return;
    const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.display_order)) + 1 : 0;
    const { error } = await supabase.from('shop_sections').insert([{
      name: newSection.name,
      title: newSection.title,
      subtitle: newSection.subtitle || null,
      category_filter: newSection.category_filter || null,
      layout_columns: newSection.layout_columns,
      display_order: maxOrder,
    }]);
    if (error) {
      toast({ title: 'Failed to add section', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Section added' });
      setAddDialogOpen(false);
      setNewSection({ name: '', title: '', subtitle: '', category_filter: '', layout_columns: 3 });
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
    }
  };

  // ── Delete Section ──
  const handleDeleteSection = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from('shop_sections').delete().eq('id', deleteTarget.id);
    if (error) {
      toast({ title: 'Failed to delete section', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Section deleted' });
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
    }
    setDeleteTarget(null);
  };

  // ── Duplicate Section ──
  const handleDuplicate = async (section: Section) => {
    const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.display_order)) + 1 : 0;
    const { error } = await supabase.from('shop_sections').insert([{
      name: section.name + '-copy',
      title: section.title + ' (Copy)',
      subtitle: section.subtitle,
      background_color: section.background_color,
      layout_columns: section.layout_columns,
      category_filter: section.category_filter,
      display_order: maxOrder,
      visible: false,
    }]);
    if (error) {
      toast({ title: 'Failed to duplicate', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Section duplicated' });
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
    }
  };

  // ── Bulk Visibility ──
  const handleBulkVisibility = async (visible: boolean) => {
    const ids = sections.map((s) => s.id);
    const updates = ids.map((id) => supabase.from('shop_sections').update({ visible }).eq('id', id));
    await Promise.all(updates);
    toast({ title: visible ? 'All sections shown' : 'All sections hidden' });
    queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
  };

  if (isLoading) {
    return <div className="p-8"><p>Loading sections...</p></div>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Shop Sections</h1>
          <p className="text-muted-foreground">Manage the sections displayed on your shop page</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => handleBulkVisibility(true)}>
            <Eye className="h-4 w-4 mr-1" /> Show All
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkVisibility(false)}>
            <EyeOff className="h-4 w-4 mr-1" /> Hide All
          </Button>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Section
          </Button>
        </div>
      </div>

      {/* Sortable list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {sections.map((section) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                editedSections={editedSections}
                onSave={handleSave}
                onChange={handleChange}
                onReset={handleReset}
                onDelete={setDeleteTarget}
                onDuplicate={handleDuplicate}
                productCount={getProductCount(section)}
                isSaving={updateMutation.isPending}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Section Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Name (slug)</Label>
              <Input value={newSection.name} onChange={(e) => setNewSection((p) => ({ ...p, name: e.target.value }))} placeholder="my-section" />
            </div>
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={newSection.title} onChange={(e) => setNewSection((p) => ({ ...p, title: e.target.value }))} placeholder="Section Title" />
            </div>
            <div className="space-y-1">
              <Label>Subtitle</Label>
              <Input value={newSection.subtitle} onChange={(e) => setNewSection((p) => ({ ...p, subtitle: e.target.value }))} placeholder="Optional subtitle" />
            </div>
            <div className="space-y-1">
              <Label>Category Filter</Label>
              <Input value={newSection.category_filter} onChange={(e) => setNewSection((p) => ({ ...p, category_filter: e.target.value }))} placeholder="e.g. Bangle Boxes" />
            </div>
            <div className="space-y-1">
              <Label>Layout Columns</Label>
              <Input type="number" value={newSection.layout_columns} onChange={(e) => setNewSection((p) => ({ ...p, layout_columns: parseInt(e.target.value) || 3 }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSection} disabled={!newSection.name || !newSection.title}>Add Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this section from the shop. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSection} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
