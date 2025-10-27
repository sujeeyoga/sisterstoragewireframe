import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Key, Database, Mail, Truck, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { z } from 'zod';

const addAdminSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim().toLowerCase(),
});

interface AddAdminResponse {
  success: boolean;
  message?: string;
  error?: string;
  user_id?: string;
}

export function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('users');
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUserId(data.user.id);
      }
    });
  }, []);

  // Fetch admin users with emails
  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_users');
      if (error) throw error;
      return data as Array<{
        id: string;
        user_id: string;
        role: string;
        email: string;
        created_at: string;
      }>;
    }
  });

  // Add admin mutation
  const addAdminMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { email }
      });

      if (error) throw error;
      
      if (data?.error) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Invitation Sent",
        description: "Admin invitation email has been sent with temporary credentials",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setAddAdminOpen(false);
      setNewAdminEmail('');
      setEmailError('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    }
  });

  // Delete admin mutation
  const deleteAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.rpc('remove_admin_role', {
        target_user_id: userId
      });

      if (error) throw error;
      
      // Type guard for the response
      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(data.error as string);
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Admin Removed",
        description: "Admin role has been removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteAdminId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove admin",
        variant: "destructive",
      });
      setDeleteAdminId(null);
    }
  });

  const handleAddAdmin = () => {
    setEmailError('');
    const validation = addAdminSchema.safeParse({ email: newAdminEmail });
    
    if (!validation.success) {
      setEmailError(validation.error.errors[0].message);
      return;
    }

    addAdminMutation.mutate(validation.data.email);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage system configuration and admin access
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Admin Users
              </CardTitle>
              <CardDescription>
                Manage administrator access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Current Admins</h4>
                    <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Admin
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite New Admin</DialogTitle>
                          <DialogDescription>
                            Enter an email address to send an admin invitation with temporary login credentials.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="admin-email">Email Address</Label>
                            <Input
                              id="admin-email"
                              type="email"
                              placeholder="user@example.com"
                              value={newAdminEmail}
                              onChange={(e) => {
                                setNewAdminEmail(e.target.value);
                                setEmailError('');
                              }}
                              className={emailError ? 'border-destructive' : ''}
                            />
                            {emailError && (
                              <p className="text-sm text-destructive">{emailError}</p>
                            )}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setAddAdminOpen(false);
                                setNewAdminEmail('');
                                setEmailError('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAddAdmin}
                              disabled={addAdminMutation.isPending || !newAdminEmail}
                            >
                              {addAdminMutation.isPending ? 'Sending...' : 'Send Invitation'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : adminUsers && adminUsers.length > 0 ? (
                    <div className="space-y-2">
                      {adminUsers.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Mail className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{admin.email}</span>
                              <span className="text-xs text-muted-foreground">
                                Added {new Date(admin.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Admin</span>
                            {admin.user_id !== currentUserId && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => setDeleteAdminId(admin.user_id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No admin users found</p>
                  )}
                </div>
              </div>

              {/* Delete Admin Confirmation Dialog */}
              <AlertDialog open={!!deleteAdminId} onOpenChange={(open) => !open && setDeleteAdminId(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Admin Access</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove admin access for this user? They will no longer be able to access admin features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteAdminId && deleteAdminMutation.mutate(deleteAdminId)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remove Admin
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">User Management</h4>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label>User Registration</Label>
                      <p className="text-sm text-muted-foreground">Allow new users to register</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Require email verification for new users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and authentication options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin users</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">Restrict admin access by IP</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Password Requirements</Label>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked disabled />
                    <span className="text-sm">Minimum 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm">Require uppercase letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm">Require numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch />
                    <span className="text-sm">Require special characters</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Integration Settings
              </CardTitle>
              <CardDescription>
                Manage third-party integrations and API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">Stripe</h4>
                        <p className="text-sm text-muted-foreground">Payment processing</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">Connected</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Manage Keys</Button>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Resend</h4>
                        <p className="text-sm text-muted-foreground">Email service</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">Connected</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Manage Keys</Button>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Stallion Express</h4>
                        <p className="text-sm text-muted-foreground">Shipping & fulfillment</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">Connected</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Manage Keys</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Webhooks</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Stripe Webhooks</Label>
                      <p className="text-xs text-muted-foreground">Receive payment notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system-wide settings and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Put site in maintenance mode</p>
                    </div>
                    <Switch />
                  </div>
                  <Input placeholder="Maintenance message..." />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label>Cache System</Label>
                    <p className="text-sm text-muted-foreground">Enable application caching</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Database Maintenance</Label>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    View Database Stats
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Clear Application Cache
                  </Button>
                  <Button variant="outline" className="justify-start" disabled>
                    Backup Database
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>System Information</Label>
                <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment:</span>
                    <span>Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database:</span>
                    <span>Supabase</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span>1.0.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
