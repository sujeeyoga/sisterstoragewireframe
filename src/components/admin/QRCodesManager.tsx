import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Copy, Download, QrCode, BarChart3, Settings } from 'lucide-react';
import { generateUniqueShortCode, buildShortUrl, buildShortUrlSync, downloadQRCodeImage } from '@/lib/qrCodeUtils';
import { format } from 'date-fns';

interface QRCode {
  id: string;
  short_code: string;
  name: string;
  destination_url: string;
  scan_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const QRCodesManager = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
  const [productionDomain, setProductionDomain] = useState('');
  const [linkType, setLinkType] = useState<'short' | 'direct'>('short');
  const [formData, setFormData] = useState({
    name: '',
    destination_url: '',
    is_active: true,
  });

  // Fetch production domain setting
  const { data: domainSetting } = useQuery({
    queryKey: ['production-domain'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('setting_value')
        .eq('setting_key', 'production_domain')
        .eq('enabled', true)
        .single();
      
      if (data?.setting_value && typeof data.setting_value === 'object' && 'domain' in data.setting_value) {
        setProductionDomain(data.setting_value.domain as string);
      }
      return data;
    },
  });

  // Save production domain
  const saveDomainMutation = useMutation({
    mutationFn: async (domain: string) => {
      const { error } = await supabase
        .from('store_settings')
        .upsert({
          setting_key: 'production_domain',
          setting_value: { domain },
          enabled: true,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-domain'] });
      toast.success('Production domain saved!');
      setSettingsOpen(false);
    },
    onError: (error) => {
      toast.error('Error saving domain: ' + error.message);
    },
  });

  // Fetch QR codes
  const { data: qrCodes, isLoading } = useQuery({
    queryKey: ['qr-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as QRCode[];
    },
  });

  // Create/Update QR code
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (selectedQR) {
        // Update existing
        const { error } = await supabase
          .from('qr_codes')
          .update({
            name: formData.name,
            destination_url: formData.destination_url,
            is_active: formData.is_active,
          })
          .eq('id', selectedQR.id);

        if (error) throw error;
      } else {
        // Create new
        const shortCode = await generateUniqueShortCode();
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('qr_codes').insert({
          short_code: shortCode,
          name: formData.name,
          destination_url: formData.destination_url,
          is_active: formData.is_active,
          created_by: user?.id,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
      toast.success(selectedQR ? 'QR code updated!' : 'QR code created!');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Error saving QR code: ' + error.message);
    },
  });

  // Delete QR code
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('qr_codes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
      toast.success('QR code deleted!');
      setDeleteDialogOpen(false);
      setSelectedQR(null);
    },
    onError: (error) => {
      toast.error('Error deleting QR code: ' + error.message);
    },
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('qr_codes')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-codes'] });
      toast.success('Status updated!');
    },
  });

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQR(null);
    setFormData({ name: '', destination_url: '', is_active: true });
  };

  const handleEdit = (qr: QRCode) => {
    setSelectedQR(qr);
    setFormData({
      name: qr.name,
      destination_url: qr.destination_url,
      is_active: qr.is_active,
    });
    setDialogOpen(true);
  };

  const getBaseUrl = () => productionDomain || window.location.origin;

  const handleCopyShortUrl = (shortCode: string) => {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/q/${shortCode}`;
    navigator.clipboard.writeText(url);
    toast.success('Short URL copied to clipboard!');
  };

  const getQRValue = (qr: QRCode) => {
    if (linkType === 'direct') {
      return qr.destination_url;
    }
    const baseUrl = getBaseUrl();
    return `${baseUrl}/q/${qr.short_code}`;
  };

  const handleDownload = (qr: QRCode, format: 'png' | 'jpg' = 'png') => {
    const svg = document.getElementById(`preview-qr-${qr.id}`) as unknown as SVGSVGElement;
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1024;
    canvas.height = 1024;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      if (format === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const linkTypeStr = linkType === 'short' ? 'short' : 'direct';
        link.download = `qr-${linkTypeStr}-${qr.short_code}-${qr.name.replace(/\s+/g, '-').toLowerCase()}.${format}`;
        link.click();
        URL.revokeObjectURL(url);
      }, mimeType, 0.95);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const totalScans = qrCodes?.reduce((sum, qr) => sum + qr.scan_count, 0) || 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">QR Code Manager</h1>
          <p className="text-muted-foreground">Create and manage dynamic QR codes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create QR Code
          </Button>
        </div>
      </div>

      {!productionDomain && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ No production domain configured. QR codes will use the current URL. 
            <Button 
              variant="link" 
              className="h-auto p-0 ml-1 text-yellow-800 dark:text-yellow-200 underline"
              onClick={() => setSettingsOpen(true)}
            >
              Set domain now
            </Button>
          </p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrCodes?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active QR Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qrCodes?.filter((qr) => qr.is_active).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>QR Codes</CardTitle>
          <CardDescription>Manage your dynamic QR codes and track analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Short URL</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Scans</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : qrCodes?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No QR codes yet. Create your first one!
                  </TableCell>
                </TableRow>
              ) : (
                qrCodes?.map((qr) => (
                  <TableRow key={qr.id}>
                    <TableCell>
                      <div 
                        className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-primary rounded transition-all"
                        onClick={() => {
                          setSelectedQR(qr);
                          setPreviewDialogOpen(true);
                        }}
                      >
                        <QRCodeSVG
                          id={`qr-${qr.id}`}
                          value={`${getBaseUrl()}/q/${qr.short_code}`}
                          size={48}
                          level="M"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{qr.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          /q/{qr.short_code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyShortUrl(qr.short_code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={qr.destination_url}>
                      {qr.destination_url}
                    </TableCell>
                    <TableCell>{qr.scan_count}</TableCell>
                    <TableCell>
                      <Switch
                        checked={qr.is_active}
                        onCheckedChange={(checked) =>
                          toggleActiveMutation.mutate({ id: qr.id, is_active: checked })
                        }
                      />
                    </TableCell>
                    <TableCell>{format(new Date(qr.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(qr)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setSelectedQR(qr);
                            setPreviewDialogOpen(true);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedQR(qr);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code Settings</DialogTitle>
            <DialogDescription>
              Configure your production domain for QR codes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="production_domain">Production Domain</Label>
              <Input
                id="production_domain"
                value={productionDomain}
                onChange={(e) => setProductionDomain(e.target.value)}
                placeholder="https://sisterstorage.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is the domain that will be used in your QR codes. Must start with https://
              </p>
              {productionDomain && !productionDomain.startsWith('https://') && (
                <p className="text-xs text-destructive mt-1">
                  ⚠️ Production domain must start with https://
                </p>
              )}
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-1">
              <p className="font-medium">💡 Tips:</p>
              <p>• Set this to your live domain (e.g., https://sisterstorage.com)</p>
              <p>• Re-download any previously created QR codes after changing this</p>
              <p>• QR codes will use this domain instead of the preview URL</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => saveDomainMutation.mutate(productionDomain)}
              disabled={!productionDomain || !productionDomain.startsWith('https://') || saveDomainMutation.isPending}
            >
              {saveDomainMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedQR ? 'Edit QR Code' : 'Create QR Code'}</DialogTitle>
            <DialogDescription>
              {selectedQR
                ? 'Update the destination URL and settings for this QR code.'
                : 'Create a new dynamic QR code that can be updated anytime.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Holiday 2025 Promo"
              />
            </div>

            <div>
              <Label htmlFor="destination_url">Destination URL</Label>
              <Input
                id="destination_url"
                value={formData.destination_url}
                onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
                placeholder="https://sisterstorage.com/shop"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            {selectedQR && (
              <div className="border rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Preview</p>
                <div className="flex justify-center">
                  <QRCodeSVG value={`${getBaseUrl()}/q/${selectedQR.short_code}`} size={150} level="M" />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  /q/{selectedQR.short_code}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : selectedQR ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview & Download Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Download QR Code</DialogTitle>
            <DialogDescription>
              High-quality QR code for {selectedQR?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedQR && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Link Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={linkType === 'short' ? 'default' : 'outline'}
                    onClick={() => setLinkType('short')}
                    className="w-full"
                  >
                    Short URL
                  </Button>
                  <Button
                    variant={linkType === 'direct' ? 'default' : 'outline'}
                    onClick={() => setLinkType('direct')}
                    className="w-full"
                  >
                    Direct URL
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {linkType === 'short' 
                    ? `Short URL: ${getBaseUrl()}/q/${selectedQR.short_code} (trackable, updatable)`
                    : `Direct URL: ${selectedQR.destination_url} (no redirect, no tracking)`
                  }
                </p>
              </div>

              <div className="flex justify-center p-8 bg-white rounded-lg">
                <QRCodeSVG
                  id={`preview-qr-${selectedQR.id}`}
                  value={getQRValue(selectedQR)}
                  size={300}
                  level="H"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Download Options</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(selectedQR, 'png')}
                    className="w-full"
                  >
                    Download PNG
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(selectedQR, 'jpg')}
                    className="w-full"
                  >
                    Download JPG
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• PNG: Transparent background, best for web</p>
                <p>• JPG: White background, smaller file size</p>
                {!productionDomain && linkType === 'short' && (
                  <p className="text-yellow-600 dark:text-yellow-500">⚠️ Using preview domain. Configure production domain in settings.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete QR Code?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedQR?.name}" and all its scan analytics. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedQR(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedQR && deleteMutation.mutate(selectedQR.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
