import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SisterStory {
  id: string;
  title: string;
  author: string;
  description: string | null;
  video_url: string;
  video_path: string;
  thumbnail_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

interface StoryFormData {
  title: string;
  author: string;
  description: string;
  video_url: string;
  video_path: string;
  display_order: number;
  is_active: boolean;
}

export const SisterStoriesManager = () => {
  const [stories, setStories] = useState<SisterStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState<SisterStory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    author: '',
    description: '',
    video_url: '',
    video_path: '',
    display_order: 0,
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sister_stories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching stories',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setStories(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStory) {
      // Update existing story
      const { error } = await supabase
        .from('sister_stories')
        .update(formData)
        .eq('id', editingStory.id);

      if (error) {
        toast({
          title: 'Error updating story',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Story updated successfully' });
        resetForm();
        fetchStories();
      }
    } else {
      // Create new story
      const { error } = await supabase
        .from('sister_stories')
        .insert([formData]);

      if (error) {
        toast({
          title: 'Error creating story',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Story created successfully' });
        resetForm();
        fetchStories();
      }
    }
  };

  const handleEdit = (story: SisterStory) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      author: story.author,
      description: story.description || '',
      video_url: story.video_url,
      video_path: story.video_path,
      display_order: story.display_order,
      is_active: story.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    const { error } = await supabase
      .from('sister_stories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting story',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Story deleted successfully' });
      fetchStories();
    }
  };

  const toggleActive = async (story: SisterStory) => {
    const { error } = await supabase
      .from('sister_stories')
      .update({ is_active: !story.is_active })
      .eq('id', story.id);

    if (error) {
      toast({
        title: 'Error updating story',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      fetchStories();
    }
  };

  const resetForm = () => {
    setEditingStory(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      video_url: '',
      video_path: '',
      display_order: 0,
      is_active: true,
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Sister Stories</h2>
          <p className="text-muted-foreground">
            Manage videos displayed in the Sister Stories carousel
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStory ? 'Edit Story' : 'Add New Story'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="@username"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="video_url">Video URL *</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) =>
                    setFormData({ ...formData, video_url: e.target.value })
                  }
                  placeholder="https://..."
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use videos from the Videos library or sister storage bucket
                </p>
              </div>

              <div>
                <Label htmlFor="video_path">Video Path *</Label>
                <Input
                  id="video_path"
                  value={formData.video_path}
                  onChange={(e) =>
                    setFormData({ ...formData, video_path: e.target.value })
                  }
                  placeholder="filename.mp4"
                  required
                />
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Active (visible on website)</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingStory ? 'Update' : 'Create'} Story
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stories List */}
      {loading ? (
        <div className="text-center py-8">Loading stories...</div>
      ) : stories.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No stories yet. Add your first Sister Story!
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {stories.map((story) => (
            <Card key={story.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="aspect-[9/16] w-24 bg-muted rounded overflow-hidden flex-shrink-0">
                  <video
                    src={story.video_url}
                    className="w-full h-full object-cover"
                    muted
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{story.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {story.author}
                      </p>
                      {story.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {story.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Order: {story.display_order}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(story)}
                        title={story.is_active ? 'Hide' : 'Show'}
                      >
                        {story.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(story)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(story.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};