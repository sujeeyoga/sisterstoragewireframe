import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LaunchCard } from "@/types/launch-card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import LaunchCardEditor from "./LaunchCardEditor";

const LaunchCardsManager = () => {
  const [editingCard, setEditingCard] = useState<LaunchCard | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data: cards, isLoading } = useQuery({
    queryKey: ['admin-launch-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('launch_cards')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data as LaunchCard[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('launch_cards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-launch-cards'] });
      queryClient.invalidateQueries({ queryKey: ['launch-cards'] });
      toast.success("Launch card deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this launch card?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Launch Cards</h1>
          <p className="text-muted-foreground">Manage upcoming collection showcases</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Collection
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collection Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Launch Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards?.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium">{card.collection_name}</TableCell>
                  <TableCell>
                    <Badge variant={card.status === 'upcoming' ? 'default' : 'secondary'}>
                      {card.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {card.launch_date ? format(new Date(card.launch_date), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell>{card.priority}</TableCell>
                  <TableCell>
                    <Badge variant={card.enabled ? 'default' : 'outline'}>
                      {card.enabled ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingCard(card)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {(isCreating || editingCard) && (
        <LaunchCardEditor
          card={editingCard}
          onClose={() => {
            setIsCreating(false);
            setEditingCard(null);
          }}
        />
      )}
    </div>
  );
};

export default LaunchCardsManager;
