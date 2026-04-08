import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Edit2, Plus, Trash2, Video, Eye, EyeOff, GripVertical } from 'lucide-react';

interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  video_url: string | null;
  image_url: string | null;
  display_order: number;
  enabled: boolean;
}

const PAGE_OPTIONS = [
  { slug: 'culture', label: 'Culture' },
  { slug: 'our-story', label: 'Our Story' },
  { slug: 'home', label: 'Home' },
  { slug: 'shop', label: 'Shop' },
  { slug: 'gallery', label: 'Gallery' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'gift', label: 'Gift' },
];

export const PageContentManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('culture');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: allContent, isLoading } = useQuery({
    queryKey: ['admin-page-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as PageContent[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (item: PageContent) => {
      const { error } = await supabase
        .from('page_content')
        .update({
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          button_text: item.button_text,
          video_url: item.video_url,
          image_url: item.image_url,
          display_order: item.display_order,
          enabled: item.enabled,
        })
        .eq('id', item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Content updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['admin-page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      setEditingId(null);
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update', description: error.message, variant: 'destructive' });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<PageContent, 'id'>) => {
      const { error } = await supabase
        .from('page_content')
        .insert(item);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Content created successfully' });
      queryClient.invalidateQueries({ queryKey: ['admin-page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      setShowAddForm(false);
    },
    onError: (error: any) => {
      toast({ title: 'Failed to create', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Content deleted' });
      queryClient.invalidateQueries({ queryKey: ['admin-page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
    },
  });

  const [editedItems, setEditedItems] = useState<Record<string, PageContent>>({});
  const [newItem, setNewItem] = useState<Omit<PageContent, 'id'>>({
    page_slug: 'culture',
    section_key: '',
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    video_url: '',
    image_url: '',
    display_order: 0,
    enabled: true,
  });

  const handleEdit = (item: PageContent) => {
    setEditingId(item.id);
    setEditedItems((prev) => ({ ...prev, [item.id]: { ...item } }));
  };

  const handleSave = (id: string) => {
    const item = editedItems[id];
    if (item) updateMutation.mutate(item);
  };

  const handleChange = (id: string, field: keyof PageContent, value: any) => {
    setEditedItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleToggleEnabled = async (item: PageContent) => {
    updateMutation.mutate({ ...item, enabled: !item.enabled });
  };

  const filteredContent = allContent?.filter((c) => c.page_slug === activeTab) || [];

  if (isLoading) {
    return <div className="p-8"><p>Loading page content...</p></div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Page Content</h1>
          <p className="text-muted-foreground text-sm">
            Edit sections with video previews. Changes update instantly.
          </p>
        </div>
        <Button size="sm" onClick={() => { setShowAddForm(true); setNewItem({ ...newItem, page_slug: activeTab }); }}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="mb-4 md:mb-6 w-max">
            {PAGE_OPTIONS.map((page) => {
              const count = allContent?.filter((c) => c.page_slug === page.slug).length || 0;
              return (
                <TabsTrigger key={page.slug} value={page.slug} className="gap-1 text-xs md:text-sm px-2 md:px-3">
                  {page.label}
                  {count > 0 && (
                    <span className="bg-primary/10 text-primary text-[10px] rounded-full px-1.5 py-0.5">
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {PAGE_OPTIONS.map((page) => (
          <TabsContent key={page.slug} value={page.slug}>
            {showAddForm && activeTab === page.slug && (
              <Card className="mb-4 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">New Content Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Section Key *</Label>
                      <Input
                        placeholder="e.g., feature_4, hero_banner"
                        value={newItem.section_key}
                        onChange={(e) => setNewItem({ ...newItem, section_key: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        value={newItem.display_order}
                        onChange={(e) => setNewItem({ ...newItem, display_order: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={newItem.title || ''} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input value={newItem.subtitle || ''} onChange={(e) => setNewItem({ ...newItem, subtitle: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={newItem.description || ''} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} rows={3} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Video className="h-4 w-4" /> Video URL</Label>
                      <Input placeholder="https://..." value={newItem.video_url || ''} onChange={(e) => setNewItem({ ...newItem, video_url: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Button Text</Label>
                      <Input value={newItem.button_text || ''} onChange={(e) => setNewItem({ ...newItem, button_text: e.target.value })} />
                    </div>
                  </div>

                  {newItem.video_url && (
                    <div className="space-y-2">
                      <Label>Video Preview</Label>
                      <div className="w-[120px] h-[180px] md:w-[160px] md:h-[240px] rounded-lg overflow-hidden bg-muted border">
                        <video src={newItem.video_url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={() => createMutation.mutate(newItem)} size="sm">
                      <Save className="mr-2 h-4 w-4" /> Create
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {filteredContent.length === 0 && !showAddForm && (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No content sections for this page yet. Click "Add Section" to create one.
                  </CardContent>
                </Card>
              )}

              {filteredContent.map((item) => {
                const isEditing = editingId === item.id;
                const edited = editedItems[item.id] || item;

                return (
                  <Card key={item.id} className={`transition-all ${!item.enabled ? 'opacity-60' : ''}`}>
                    <CardHeader className="p-3 md:p-6 flex flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
                        <div className="min-w-0">
                          <CardTitle className="text-sm md:text-lg flex items-center gap-1.5 truncate">
                            {item.title || item.section_key}
                            {item.video_url && <Video className="h-3.5 w-3.5 text-primary shrink-0" />}
                          </CardTitle>
                          <CardDescription className="text-xs">{item.section_key} · #{item.display_order}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${item.enabled ? 'text-green-600' : 'text-muted-foreground'}`}
                          onClick={() => handleToggleEnabled(item)}
                        >
                          {item.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => {
                            if (confirm('Delete this section?')) deleteMutation.mutate(item.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 md:p-6 md:pt-0 space-y-3">
                      {/* Compact video preview */}
                      {(isEditing ? edited.video_url : item.video_url) && (
                        <div className="flex items-start gap-3">
                          <div className="w-[80px] h-[120px] md:w-[120px] md:h-[180px] rounded-lg overflow-hidden bg-muted border shrink-0">
                            <video
                              key={isEditing ? edited.video_url : item.video_url}
                              src={isEditing ? edited.video_url! : item.video_url!}
                              className="w-full h-full object-cover"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          </div>
                          {!isEditing && item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-4 pt-1">{item.description}</p>
                          )}
                        </div>
                      )}

                      {isEditing ? (
                        <>
                          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Title</Label>
                              <Input className="h-9 text-sm" value={edited.title || ''} onChange={(e) => handleChange(item.id, 'title', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Subtitle</Label>
                              <Input className="h-9 text-sm" value={edited.subtitle || ''} onChange={(e) => handleChange(item.id, 'subtitle', e.target.value)} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Description</Label>
                            <Textarea className="text-sm" value={edited.description || ''} onChange={(e) => handleChange(item.id, 'description', e.target.value)} rows={2} />
                          </div>

                          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label className="text-xs flex items-center gap-1"><Video className="h-3 w-3" /> Video URL</Label>
                              <Input className="h-9 text-sm" value={edited.video_url || ''} onChange={(e) => handleChange(item.id, 'video_url', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Image URL</Label>
                              <Input className="h-9 text-sm" value={edited.image_url || ''} onChange={(e) => handleChange(item.id, 'image_url', e.target.value)} />
                            </div>
                          </div>

                          <div className="grid gap-3 grid-cols-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Button Text</Label>
                              <Input className="h-9 text-sm" value={edited.button_text || ''} onChange={(e) => handleChange(item.id, 'button_text', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Order</Label>
                              <Input className="h-9 text-sm" type="number" value={edited.display_order} onChange={(e) => handleChange(item.id, 'display_order', parseInt(e.target.value) || 0)} />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={() => handleSave(item.id)} size="sm" className="text-xs h-8">
                              <Save className="mr-1 h-3.5 w-3.5" /> Save
                            </Button>
                            <Button variant="outline" onClick={() => setEditingId(null)} size="sm" className="text-xs h-8">Cancel</Button>
                          </div>
                        </>
                      ) : (
                        <>
                          {!item.video_url && (
                            <>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                {item.title && <div><span className="text-muted-foreground">Title:</span> {item.title}</div>}
                                {item.subtitle && <div><span className="text-muted-foreground">Sub:</span> {item.subtitle}</div>}
                                {item.button_text && <div><span className="text-muted-foreground">Btn:</span> {item.button_text}</div>}
                              </div>
                              {item.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                              )}
                            </>
                          )}
                          <Button variant="outline" onClick={() => handleEdit(item)} size="sm" className="text-xs h-8">
                            <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
