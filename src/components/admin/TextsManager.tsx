import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Edit2, Plus } from 'lucide-react';

type SiteText = {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  enabled: boolean;
};

export const TextsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newText, setNewText] = useState(false);

  const { data: texts, isLoading } = useQuery({
    queryKey: ['site-texts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_texts')
        .select('*')
        .order('section_key');
      if (error) throw error;
      return data as SiteText[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (text: SiteText) => {
      const { error } = await supabase
        .from('site_texts')
        .upsert({
          id: text.id,
          section_key: text.section_key,
          title: text.title,
          subtitle: text.subtitle,
          description: text.description,
          button_text: text.button_text,
          enabled: text.enabled,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Text updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['site-texts'] });
      setEditingId(null);
      setNewText(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update text',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const [editedTexts, setEditedTexts] = useState<Record<string, SiteText>>({});

  const handleEdit = (text: SiteText) => {
    setEditingId(text.id);
    setEditedTexts((prev) => ({ ...prev, [text.id]: { ...text } }));
  };

  const handleSave = (id: string) => {
    const text = editedTexts[id];
    if (text) {
      updateMutation.mutate(text);
    }
  };

  const handleChange = (id: string, field: keyof SiteText, value: any) => {
    setEditedTexts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleAddNew = () => {
    const newId = 'new-text';
    setNewText(true);
    setEditingId(newId);
    setEditedTexts({
      ...editedTexts,
      [newId]: {
        id: newId,
        section_key: '',
        title: '',
        subtitle: '',
        description: '',
        button_text: '',
        enabled: true,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Loading texts...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Site Content</h1>
          <p className="text-muted-foreground">
            Manage all text content displayed across your website
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Text
        </Button>
      </div>

      <div className="space-y-4">
        {newText && editingId === 'new-text' && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-lg">New Content Section</CardTitle>
              <CardDescription>Create a new text content section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Key *</Label>
                <Input
                  placeholder="e.g., hero_main, footer_text"
                  value={editedTexts['new-text']?.section_key || ''}
                  onChange={(e) =>
                    handleChange('new-text', 'section_key', e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for this content (use lowercase with underscores)
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editedTexts['new-text']?.title || ''}
                    onChange={(e) =>
                      handleChange('new-text', 'title', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={editedTexts['new-text']?.subtitle || ''}
                    onChange={(e) =>
                      handleChange('new-text', 'subtitle', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editedTexts['new-text']?.description || ''}
                  onChange={(e) =>
                    handleChange('new-text', 'description', e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={editedTexts['new-text']?.button_text || ''}
                  onChange={(e) =>
                    handleChange('new-text', 'button_text', e.target.value)
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editedTexts['new-text']?.enabled}
                  onCheckedChange={(checked) =>
                    handleChange('new-text', 'enabled', checked)
                  }
                />
                <Label>Enabled</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleSave('new-text')} size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save New Text
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewText(false);
                    setEditingId(null);
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {texts?.map((text) => {
          const isEditing = editingId === text.id;
          const editedText = editedTexts[text.id] || text;

          return (
            <Card key={text.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{text.section_key}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Section identifier
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editedText.enabled}
                    onCheckedChange={(checked) =>
                      handleChange(text.id, 'enabled', checked)
                    }
                  />
                  <Label className="text-sm">Enabled</Label>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editedText.title || ''}
                      onChange={(e) =>
                        handleChange(text.id, 'title', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={editedText.subtitle || ''}
                      onChange={(e) =>
                        handleChange(text.id, 'subtitle', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editedText.description || ''}
                    onChange={(e) =>
                      handleChange(text.id, 'description', e.target.value)
                    }
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={editedText.button_text || ''}
                    onChange={(e) =>
                      handleChange(text.id, 'button_text', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={() => handleSave(text.id)} size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(text)}
                      size="sm"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
