import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { CampaignList } from '@/components/admin/campaigns/CampaignList';
import { EmailComposer } from '@/components/admin/campaigns/EmailComposer';
import { CustomerListView } from '@/components/admin/campaigns/CustomerListView';
import { ResendConfirmationEmails } from '@/components/admin/ResendConfirmationEmails';

const AdminEmails = () => {
  const [showComposer, setShowComposer] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Email Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage campaigns, order emails, and customer communications
            </p>
          </div>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="order-emails">Order Emails</TabsTrigger>
            <TabsTrigger value="customers">Customer List</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            {showComposer ? (
              <EmailComposer onBack={() => setShowComposer(false)} />
            ) : (
              <>
                <div className="flex justify-end">
                  <Button onClick={() => setShowComposer(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
                <CampaignList />
              </>
            )}
          </TabsContent>

          <TabsContent value="order-emails">
            <ResendConfirmationEmails />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerListView />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminEmails;
