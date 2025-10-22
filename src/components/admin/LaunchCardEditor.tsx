import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LaunchCard } from "@/types/launch-card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface LaunchCardEditorProps {
  card: LaunchCard | null;
  onClose: () => void;
}

const LaunchCardEditor = ({ card, onClose }: LaunchCardEditorProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!card;

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      collection_name: card?.collection_name || '',
      tagline: card?.tagline || '',
      description: card?.description || '',
      launch_date: card?.launch_date || '',
      status: card?.status || 'upcoming',
      waitlist_link: card?.waitlist_link || '',
      preview_link: card?.preview_link || '',
      cta_label: card?.cta_label || 'Join the Waitlist',
      gradient_c1: card?.gradient_c1 || '#FFB7C5',
      gradient_c2: card?.gradient_c2 || '#FFD6E0',
      gradient_c3: card?.gradient_c3 || '#FFF5F8',
      shimmer_speed: card?.shimmer_speed || 18,
      blur_level: card?.blur_level || 55,
      priority: card?.priority || 1,
      enabled: card?.enabled ?? true,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        const { error } = await supabase
          .from('launch_cards')
          .update(data)
          .eq('id', card.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('launch_cards')
          .insert([data]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-launch-cards'] });
      queryClient.invalidateQueries({ queryKey: ['launch-cards'] });
      toast.success(isEditing ? "Launch card updated" : "Launch card created");
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Launch Card' : 'Create Launch Card'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Collection Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Collection Details</h3>
            
            <div>
              <Label htmlFor="collection_name">Collection Name *</Label>
              <Input id="collection_name" {...register('collection_name', { required: true })} />
            </div>

            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" {...register('tagline')} />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" {...register('description', { required: true })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="launch_date">Launch Date</Label>
                <Input id="launch_date" type="date" {...register('launch_date')} />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Links</h3>
            
            <div>
              <Label htmlFor="waitlist_link">Waitlist Link *</Label>
              <Input id="waitlist_link" type="url" {...register('waitlist_link', { required: true })} />
            </div>

            <div>
              <Label htmlFor="preview_link">Preview Link</Label>
              <Input id="preview_link" type="url" {...register('preview_link')} />
            </div>

            <div>
              <Label htmlFor="cta_label">CTA Label</Label>
              <Input id="cta_label" {...register('cta_label')} />
            </div>
          </div>

          {/* Gradient Colors */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Gradient Colors</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="gradient_c1">Color 1</Label>
                <Input id="gradient_c1" type="color" {...register('gradient_c1')} />
              </div>

              <div>
                <Label htmlFor="gradient_c2">Color 2</Label>
                <Input id="gradient_c2" type="color" {...register('gradient_c2')} />
              </div>

              <div>
                <Label htmlFor="gradient_c3">Color 3</Label>
                <Input id="gradient_c3" type="color" {...register('gradient_c3')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shimmer_speed">Shimmer Speed (seconds)</Label>
                <Input id="shimmer_speed" type="number" step="0.1" {...register('shimmer_speed')} />
              </div>

              <div>
                <Label htmlFor="blur_level">Blur Level (px)</Label>
                <Input id="blur_level" type="number" {...register('blur_level')} />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input id="priority" type="number" {...register('priority')} />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="enabled"
                  checked={watch('enabled')}
                  onCheckedChange={(checked) => setValue('enabled', checked)}
                />
                <Label htmlFor="enabled">Enabled</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchCardEditor;
