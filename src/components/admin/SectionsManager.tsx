import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { GripVertical, Save } from 'lucide-react';

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
};

export const SectionsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: sections, isLoading } = useQuery({
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
        })
        .eq('id', section.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Section updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
      setEditingId(null);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update section',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const [editedSections, setEditedSections] = useState<Record<string, Section>>({});

  const handleEdit = (section: Section) => {
    setEditingId(section.id);
    setEditedSections((prev) => ({ ...prev, [section.id]: { ...section } }));
  };

  const handleSave = (id: string) => {
    const section = editedSections[id];
    if (section) {
      updateMutation.mutate(section);
    }
  };

  const handleChange = (id: string, field: keyof Section, value: any) => {
    setEditedSections((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Loading sections...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Shop Sections</h1>
        <p className="text-muted-foreground">
          Manage the sections displayed on your shop page
        </p>
      </div>

      <div className="space-y-4">
        {sections?.map((section) => {
          const isEditing = editingId === section.id;
          const editedSection = editedSections[section.id] || section;

          return (
            <Card key={section.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <CardTitle className="text-lg">{section.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editedSection.visible}
                    onCheckedChange={(checked) =>
                      handleChange(section.id, 'visible', checked)
                    }
                  />
                  <Label className="text-sm">Visible</Label>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editedSection.title}
                      onChange={(e) =>
                        handleChange(section.id, 'title', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={editedSection.subtitle || ''}
                      onChange={(e) =>
                        handleChange(section.id, 'subtitle', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category Filter</Label>
                    <Input
                      value={editedSection.category_filter || ''}
                      onChange={(e) =>
                        handleChange(section.id, 'category_filter', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Layout Columns</Label>
                    <Input
                      type="number"
                      value={editedSection.layout_columns}
                      onChange={(e) =>
                        handleChange(section.id, 'layout_columns', parseInt(e.target.value))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={editedSection.display_order}
                      onChange={(e) =>
                        handleChange(section.id, 'display_order', parseInt(e.target.value))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={() => handleSave(section.id)} size="sm">
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
                      onClick={() => handleEdit(section)}
                      size="sm"
                    >
                      Edit Section
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
