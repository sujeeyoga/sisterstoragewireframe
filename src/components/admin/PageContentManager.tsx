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
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Page Content</h1>
          <p className="text-muted-foreground">
            Edit page sections with live video previews. Changes update the site immediately.
          </p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setNewItem({ ...newItem, page_slug: activeTab }); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          {PAGE_OPTIONS.map((page) => {
            const count = allContent?.filter((c) => c.page_slug === page.slug).length || 0;
            return (
              <TabsTrigger key={page.slug} value={page.slug} className="gap-2">
                {page.label}
                {count > 0 && (
                  <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

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
                      <div className="w-[200px] h-[300px] rounded-lg overflow-hidden bg-muted border">
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
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {item.title || item.section_key}
                            {item.video_url && <Video className="h-4 w-4 text-primary" />}
                          </CardTitle>
                          <CardDescription>{item.section_key} · Order: {item.display_order}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleEnabled(item)}
                          className={item.enabled ? 'text-green-600' : 'text-muted-foreground'}
                        >
                          {item.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Delete this section?')) deleteMutation.mutate(item.id);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(isEditing ? edited.video_url : item.video_url) && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Video className="h-4 w-4" /> Video Preview
                          </Label>
                          <div className="w-[160px] h-[240px] md:w-[200px] md:h-[300px] rounded-lg overflow-hidden bg-muted border">
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
                        </div>
                      )}

                      {isEditing ? (
                        <>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input value={edited.title || ''} onChange={(e) => handleChange(item.id, 'title', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Subtitle</Label>
                              <Input value={edited.subtitle || ''} onChange={(e) => handleChange(item.id, 'subtitle', e.target.value)} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={edited.description || ''} onChange={(e) => handleChange(item.id, 'description', e.target.value)} rows={3} />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2"><Video className="h-4 w-4" /> Video URL</Label>
                              <Input value={edited.video_url || ''} onChange={(e) => handleChange(item.id, 'video_url', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Image URL</Label>
                              <Input value={edited.image_url || ''} onChange={(e) => handleChange(item.id, 'image_url', e.target.value)} />
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Button Text</Label>
                              <Input value={edited.button_text || ''} onChange={(e) => handleChange(item.id, 'button_text', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Display Order</Label>
                              <Input type="number" value={edited.display_order} onChange={(e) => handleChange(item.id, 'display_order', parseInt(e.target.value) || 0)} />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={() => handleSave(item.id)} size="sm">
                              <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setEditingId(null)} size="sm">Cancel</Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid gap-2 md:grid-cols-2 text-sm">
                            {item.title && <div><span className="text-muted-foreground">Title:</span> {item.title}</div>}
                            {item.subtitle && <div><span className="text-muted-foreground">Subtitle:</span> {item.subtitle}</div>}
                            {item.button_text && <div><span className="text-muted-foreground">Button:</span> {item.button_text}</div>}
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          )}
                          <Button variant="outline" onClick={() => handleEdit(item)} size="sm">
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
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
