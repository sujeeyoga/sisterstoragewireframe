import { useState } from 'react';
import { useShippingZones } from '@/hooks/useShippingZones';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { ZoneEditor } from './ZoneEditor';
import { FallbackSettings } from './FallbackSettings';
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

export const ShippingZonesManager = () => {
  const { zones, isLoading, deleteZone, updateZone, fallbackSettings } = useShippingZones();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (zoneToDelete) {
      deleteZone(zoneToDelete);
      setDeleteDialogOpen(false);
      setZoneToDelete(null);
    }
  };

  const handleToggleEnabled = (zoneId: string, currentEnabled: boolean) => {
    updateZone({ id: zoneId, enabled: !currentEnabled });
  };

  if (isLoading) {
    return <div className="p-6">Loading shipping zones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Shipping Zones</h2>
          <p className="text-muted-foreground mt-1">
            Manage geographic shipping zones and rates
          </p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Zone
        </Button>
      </div>

      <FallbackSettings />

      <div className="grid gap-4">
        {zones && zones.length > 0 ? (
          zones.map((zone) => (
            <Card key={zone.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">{zone.name}</h3>
                    <Badge variant={zone.enabled ? 'default' : 'secondary'}>
                      {zone.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Badge variant="outline">Priority: {zone.priority}</Badge>
                  </div>

                  {zone.description && (
                    <p className="text-muted-foreground mb-3">{zone.description}</p>
                  )}

                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Rules:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {zone.rules.map((rule) => (
                          <Badge key={rule.id} variant="outline">
                            {rule.rule_type}: {rule.rule_value}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium">Rates:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {zone.rates
                          .filter((r) => r.enabled)
                          .map((rate) => (
                            <Badge key={rate.id} variant="secondary">
                              {rate.method_name}: ${rate.rate_amount.toFixed(2)}
                              {rate.rate_type === 'free_threshold' &&
                                rate.free_threshold &&
                                ` (Free over $${rate.free_threshold})`}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    checked={zone.enabled}
                    onCheckedChange={() => handleToggleEnabled(zone.id, zone.enabled)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingZone(zone.id);
                      setIsEditorOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setZoneToDelete(zone.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No shipping zones yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first shipping zone to get started
            </p>
            <Button onClick={() => setIsEditorOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Zone
            </Button>
          </Card>
        )}
      </div>

      <ZoneEditor
        open={isEditorOpen}
        onOpenChange={(open) => {
          setIsEditorOpen(open);
          if (!open) setEditingZone(null);
        }}
        zoneId={editingZone}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shipping Zone</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this shipping zone? This action cannot be undone.
              All rules and rates associated with this zone will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
