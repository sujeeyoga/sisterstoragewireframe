import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Percent, Gift, Mail, Star, Package, AlertTriangle, MapPin } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface StoreSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  enabled: boolean;
}

export function StoreSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all settings
  const { data: comingSoonSettings } = useQuery({
    queryKey: ['store-settings', 'coming-soon'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'coming_soon')
        .maybeSingle();
      return data;
    },
  });

  const { data: discountSettings } = useQuery({
    queryKey: ['store-settings', 'discount'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'store_wide_discount')
        .maybeSingle();
      return data;
    },
  });

  const [discountPercentage, setDiscountPercentage] = useState<string>(
    (discountSettings?.setting_value as any)?.percentage?.toString() || "0"
  );
  const [discountName, setDiscountName] = useState<string>(
    (discountSettings?.setting_value as any)?.name || "Store-Wide Sale"
  );

  // Collapsible sections state
  const [customerExpOpen, setCustomerExpOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);

  // Gift Messages Settings
  const { data: giftSettings } = useQuery({
    queryKey: ['store-settings', 'gift-messages'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'gift_messages')
        .maybeSingle();
      return data;
    },
  });

  const [giftCharLimit, setGiftCharLimit] = useState<string>(
    (giftSettings?.setting_value as any)?.charLimit?.toString() || "250"
  );
  const [giftWrappingPrice, setGiftWrappingPrice] = useState<string>(
    (giftSettings?.setting_value as any)?.wrappingPrice?.toString() || "5.00"
  );

  // Newsletter Settings
  const { data: newsletterSettings } = useQuery({
    queryKey: ['store-settings', 'newsletter-optin'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'newsletter_optin')
        .maybeSingle();
      return data;
    },
  });

  const [newsletterIncentive, setNewsletterIncentive] = useState<string>(
    (newsletterSettings?.setting_value as any)?.incentiveText || "Get 10% off your next order!"
  );

  // Review Settings
  const { data: reviewSettings } = useQuery({
    queryKey: ['store-settings', 'product-reviews'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'product_reviews')
        .maybeSingle();
      return data;
    },
  });

  const [reviewAutoRequestDays, setReviewAutoRequestDays] = useState<string>(
    (reviewSettings?.setting_value as any)?.autoRequestDays?.toString() || "7"
  );

  // Low Stock Settings
  const { data: lowStockSettings } = useQuery({
    queryKey: ['store-settings', 'low-stock-alerts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'low_stock_alerts')
        .maybeSingle();
      return data;
    },
  });

  const [lowStockThreshold, setLowStockThreshold] = useState<string>(
    (lowStockSettings?.setting_value as any)?.threshold?.toString() || "5"
  );
  const [lowStockEmail, setLowStockEmail] = useState<string>(
    (lowStockSettings?.setting_value as any)?.adminEmail || ""
  );

  // Preorder Settings
  const { data: preorderSettings } = useQuery({
    queryKey: ['store-settings', 'preorders'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'preorders')
        .maybeSingle();
      return data;
    },
  });

  const [preorderBadgeText, setPreorderBadgeText] = useState<string>(
    (preorderSettings?.setting_value as any)?.badgeText || "Pre-Order"
  );

  // Fulfillment Address Settings
  const { data: fulfillmentAddress } = useQuery({
    queryKey: ['store-settings', 'fulfillment-address'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'fulfillment_address')
        .maybeSingle();
      return data;
    },
  });

  const [fulfillmentName, setFulfillmentName] = useState<string>(
    (fulfillmentAddress?.setting_value as any)?.name || ""
  );
  const [fulfillmentCompany, setFulfillmentCompany] = useState<string>(
    (fulfillmentAddress?.setting_value as any)?.company || ""
  );
  const [fulfillmentStreet1, setFulfillmentStreet1] = useState<string>(
    (fulfillmentAddress?.setting_value as any)?.street1 || ""
  );
  const [fulfillmentStreet2, setFulfillmentStreet2] = useState<string>(
    (fulfillmentAddress?.setting_value as any)?.street2 || ""
  );
  const [fulfillmentCity, setFulfillmentCity] = useState<string>(
    (fulfillmentAddress?.setting_value as any)?.city || ""
  );
  const [fulfillmentProvince, setFulfillmentProvince] = useState<string>(
    (fulfillmentAddress?.setting_value as any)?.province || ""
  );
  const [fulfillmentPostalCode, setFulfillmentPostalCode] = useState<string>(
    (fulfillmentAddress?.setting_value as any)?.postal_code || ""
  );
  const [fulfillmentCountry, setFulfillmentCountry] = useState<string>(
    (fulfillmentAddress?.setting_value as any)?.country || "CA"
  );
  const [fulfillmentPhone, setFulfillmentPhone] = useState<string>(
    (fulfillmentAddress?.setting_value as any)?.phone || ""
  );
  const [fulfillmentEmail, setFulfillmentEmail] = useState<string>(
    (fulfillmentAddress?.setting_value as any)?.email || ""
  );

  // Mutations
  const toggleComingSoonMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const { data: existing } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'coming_soon')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('store_settings')
          .update({ enabled })
          .eq('setting_key', 'coming_soon');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('store_settings')
          .insert({ setting_key: 'coming_soon', enabled, setting_value: {} });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast({ title: "Success", description: "Coming Soon setting updated" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const toggleDiscountMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await supabase
        .from('store_settings')
        .update({ enabled })
        .eq('setting_key', 'store_wide_discount');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
      toast({ title: "Success", description: "Discount setting updated" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateDiscountMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('store_settings')
        .update({
          setting_value: {
            percentage: parseFloat(discountPercentage),
            name: discountName,
          },
        })
        .eq('setting_key', 'store_wide_discount');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-discount'] });
      toast({
        title: "Success",
        description: "Discount settings updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update discount: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Generic toggle mutation for any setting
  const createToggleMutation = (settingKey: string, queryKey: string[]) =>
    useMutation({
      mutationFn: async (enabled: boolean) => {
        const { data: existing } = await supabase
          .from('store_settings')
          .select('*')
          .eq('setting_key', settingKey)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from('store_settings')
            .update({ enabled })
            .eq('setting_key', settingKey);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('store_settings')
            .insert({ setting_key: settingKey, enabled, setting_value: {} });
          if (error) throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        toast({ title: "Success", description: "Setting updated successfully" });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to update: ${error.message}`,
          variant: "destructive",
        });
      },
    });

  // Generic update mutation for settings
  const createUpdateMutation = (settingKey: string, queryKey: string[], getValue: () => any) =>
    useMutation({
      mutationFn: async () => {
        const { data: existing } = await supabase
          .from('store_settings')
          .select('*')
          .eq('setting_key', settingKey)
          .maybeSingle();

        const value = getValue();

        if (existing) {
          const { error } = await supabase
            .from('store_settings')
            .update({ setting_value: value })
            .eq('setting_key', settingKey);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('store_settings')
            .insert({ setting_key: settingKey, enabled: false, setting_value: value });
          if (error) throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        toast({ title: "Success", description: "Settings saved successfully" });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to save: ${error.message}`,
          variant: "destructive",
        });
      },
    });

  // Create mutations for each setting type
  const toggleGiftMutation = createToggleMutation('gift_messages', ['store-settings', 'gift-messages']);
  const toggleNewsletterMutation = createToggleMutation('newsletter_optin', ['store-settings', 'newsletter-optin']);
  const toggleReviewsMutation = createToggleMutation('product_reviews', ['store-settings', 'product-reviews']);
  const togglePreordersMutation = createToggleMutation('preorders', ['store-settings', 'preorders']);

  const updateGiftMutation = createUpdateMutation('gift_messages', ['store-settings', 'gift-messages'], () => ({
    charLimit: parseInt(giftCharLimit),
    wrappingEnabled: (giftSettings?.setting_value as any)?.wrappingEnabled || false,
    wrappingPrice: parseFloat(giftWrappingPrice),
  }));

  const updateNewsletterMutation = createUpdateMutation('newsletter_optin', ['store-settings', 'newsletter-optin'], () => ({
    incentiveText: newsletterIncentive,
    defaultChecked: (newsletterSettings?.setting_value as any)?.defaultChecked || false,
  }));

  const updateReviewsMutation = createUpdateMutation('product_reviews', ['store-settings', 'product-reviews'], () => ({
    requirePurchase: (reviewSettings?.setting_value as any)?.requirePurchase !== false,
    autoRequestDays: parseInt(reviewAutoRequestDays),
    minRating: (reviewSettings?.setting_value as any)?.minRating || 1,
  }));

  const updateLowStockMutation = createUpdateMutation('low_stock_alerts', ['store-settings', 'low-stock-alerts'], () => ({
    threshold: parseInt(lowStockThreshold),
    showBadge: (lowStockSettings?.setting_value as any)?.showBadge !== false,
    emailNotify: (lowStockSettings?.setting_value as any)?.emailNotify || false,
    autoHide: (lowStockSettings?.setting_value as any)?.autoHide || false,
    adminEmail: lowStockEmail,
  }));

  const updatePreorderMutation = createUpdateMutation('preorders', ['store-settings', 'preorders'], () => ({
    showRestockDate: (preorderSettings?.setting_value as any)?.showRestockDate !== false,
    badgeText: preorderBadgeText,
    notifyEmail: (preorderSettings?.setting_value as any)?.notifyEmail || false,
  }));

  const updateFulfillmentAddressMutation = createUpdateMutation('fulfillment_address', ['store-settings', 'fulfillment-address'], () => ({
    name: fulfillmentName,
    company: fulfillmentCompany,
    street1: fulfillmentStreet1,
    street2: fulfillmentStreet2,
    city: fulfillmentCity,
    province: fulfillmentProvince,
    postal_code: fulfillmentPostalCode,
    country: fulfillmentCountry,
    phone: fulfillmentPhone,
    email: fulfillmentEmail,
  }));

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground mt-1">Manage global store configurations</p>
      </div>

      {/* Fulfillment Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Fulfillment Address
          </CardTitle>
          <CardDescription>Configure your warehouse/shipping address for Stallion Express fulfillment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fulfillmentName">Contact Name *</Label>
              <Input
                id="fulfillmentName"
                value={fulfillmentName}
                onChange={(e) => setFulfillmentName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fulfillmentCompany">Company Name</Label>
              <Input
                id="fulfillmentCompany"
                value={fulfillmentCompany}
                onChange={(e) => setFulfillmentCompany(e.target.value)}
                placeholder="Sister Storage"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fulfillmentStreet1">Street Address *</Label>
            <Input
              id="fulfillmentStreet1"
              value={fulfillmentStreet1}
              onChange={(e) => setFulfillmentStreet1(e.target.value)}
              placeholder="123 Main St"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fulfillmentStreet2">Street Address Line 2</Label>
            <Input
              id="fulfillmentStreet2"
              value={fulfillmentStreet2}
              onChange={(e) => setFulfillmentStreet2(e.target.value)}
              placeholder="Suite 100"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fulfillmentCity">City *</Label>
              <Input
                id="fulfillmentCity"
                value={fulfillmentCity}
                onChange={(e) => setFulfillmentCity(e.target.value)}
                placeholder="Toronto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fulfillmentProvince">Province *</Label>
              <Input
                id="fulfillmentProvince"
                value={fulfillmentProvince}
                onChange={(e) => setFulfillmentProvince(e.target.value)}
                placeholder="ON"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fulfillmentPostalCode">Postal Code *</Label>
              <Input
                id="fulfillmentPostalCode"
                value={fulfillmentPostalCode}
                onChange={(e) => setFulfillmentPostalCode(e.target.value)}
                placeholder="M5V 3A8"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fulfillmentPhone">Phone *</Label>
              <Input
                id="fulfillmentPhone"
                type="tel"
                value={fulfillmentPhone}
                onChange={(e) => setFulfillmentPhone(e.target.value)}
                placeholder="(416) 555-0123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fulfillmentEmail">Email *</Label>
              <Input
                id="fulfillmentEmail"
                type="email"
                value={fulfillmentEmail}
                onChange={(e) => setFulfillmentEmail(e.target.value)}
                placeholder="fulfillment@sisterstrage.com"
              />
            </div>
          </div>

          <Button onClick={() => updateFulfillmentAddressMutation.mutate()}>
            Save Fulfillment Address
          </Button>
        </CardContent>
      </Card>

      {/* Coming Soon Page */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Coming Soon Page
          </CardTitle>
          <CardDescription>Enable coming soon page for visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Coming Soon Page</Label>
              <p className="text-sm text-muted-foreground">Visitors must login to access the site</p>
            </div>
            <Switch
              checked={comingSoonSettings?.enabled || false}
              onCheckedChange={(checked) => toggleComingSoonMutation.mutate(checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Store-Wide Discount */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Store-Wide Discount
          </CardTitle>
          <CardDescription>Apply a percentage discount to all products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Store-Wide Discount</Label>
              <p className="text-sm text-muted-foreground">Discount applied at checkout</p>
            </div>
            <Switch
              checked={discountSettings?.enabled || false}
              onCheckedChange={(checked) => toggleDiscountMutation.mutate(checked)}
            />
          </div>

          {discountSettings?.enabled && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Discount Percentage</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountName">Promotion Name</Label>
                <Input
                  id="discountName"
                  value={discountName}
                  onChange={(e) => setDiscountName(e.target.value)}
                />
              </div>
              <Button onClick={() => updateDiscountMutation.mutate()}>Save Settings</Button>

              {discountSettings?.enabled && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="font-medium">Active: {discountName} - {discountPercentage}% off</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Experience Settings */}
      <Card>
        <Collapsible open={customerExpOpen} onOpenChange={setCustomerExpOpen}>
          <CardHeader className="cursor-pointer" onClick={() => setCustomerExpOpen(!customerExpOpen)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                <CardTitle>Customer Experience</CardTitle>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${customerExpOpen ? 'rotate-180' : ''}`} />
            </div>
            <CardDescription>Manage gift options, newsletter, and reviews</CardDescription>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Gift Messages & Wrapping */}
              <div className="space-y-4 pb-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Gift Messages & Wrapping</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to add gift messages</p>
                  </div>
                  <Switch
                    checked={giftSettings?.enabled || false}
                    onCheckedChange={(checked) => toggleGiftMutation.mutate(checked)}
                  />
                </div>

                {giftSettings?.enabled && (
                  <div className="space-y-4 ml-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="giftCharLimit">Character Limit</Label>
                      <Input
                        id="giftCharLimit"
                        type="number"
                        value={giftCharLimit}
                        onChange={(e) => setGiftCharLimit(e.target.value)}
                        placeholder="250"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="giftWrappingPrice">Gift Wrapping Price ($)</Label>
                      <Input
                        id="giftWrappingPrice"
                        type="number"
                        step="0.01"
                        value={giftWrappingPrice}
                        onChange={(e) => setGiftWrappingPrice(e.target.value)}
                        placeholder="5.00"
                      />
                    </div>

                    <Button onClick={() => updateGiftMutation.mutate()}>
                      Save Gift Settings
                    </Button>
                  </div>
                )}
              </div>

              {/* Newsletter Opt-in */}
              <div className="space-y-4 pb-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Newsletter Opt-in</Label>
                    <p className="text-sm text-muted-foreground">Show newsletter checkbox at checkout</p>
                  </div>
                  <Switch
                    checked={newsletterSettings?.enabled || false}
                    onCheckedChange={(checked) => toggleNewsletterMutation.mutate(checked)}
                  />
                </div>

                {newsletterSettings?.enabled && (
                  <div className="space-y-4 ml-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="newsletterIncentive">Incentive Text</Label>
                      <Input
                        id="newsletterIncentive"
                        value={newsletterIncentive}
                        onChange={(e) => setNewsletterIncentive(e.target.value)}
                        placeholder="Get 10% off your next order!"
                      />
                    </div>

                    <Button onClick={() => updateNewsletterMutation.mutate()}>
                      Save Newsletter Settings
                    </Button>
                  </div>
                )}
              </div>

              {/* Product Reviews */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Product Reviews</Label>
                    <p className="text-sm text-muted-foreground">Enable product review system</p>
                  </div>
                  <Switch
                    checked={reviewSettings?.enabled || false}
                    onCheckedChange={(checked) => toggleReviewsMutation.mutate(checked)}
                  />
                </div>

                {reviewSettings?.enabled && (
                  <div className="space-y-4 ml-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="reviewAutoRequestDays">Auto-request Review After (days)</Label>
                      <Input
                        id="reviewAutoRequestDays"
                        type="number"
                        value={reviewAutoRequestDays}
                        onChange={(e) => setReviewAutoRequestDays(e.target.value)}
                        placeholder="7"
                      />
                    </div>

                    <Button onClick={() => updateReviewsMutation.mutate()}>
                      Save Review Settings
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Inventory & Operations Settings */}
      <Card>
        <Collapsible open={inventoryOpen} onOpenChange={setInventoryOpen}>
          <CardHeader className="cursor-pointer" onClick={() => setInventoryOpen(!inventoryOpen)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <CardTitle>Inventory & Operations</CardTitle>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${inventoryOpen ? 'rotate-180' : ''}`} />
            </div>
            <CardDescription>Manage stock alerts and pre-orders</CardDescription>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Low Stock Alerts */}
              <div className="space-y-4 pb-6 border-b">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">Configure low stock threshold and notifications</p>
                </div>

                <div className="space-y-4 ml-6">
                  <div className="space-y-2">
                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                      placeholder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lowStockEmail">Admin Email for Notifications</Label>
                    <Input
                      id="lowStockEmail"
                      type="email"
                      value={lowStockEmail}
                      onChange={(e) => setLowStockEmail(e.target.value)}
                      placeholder="admin@example.com"
                    />
                  </div>

                  <Button onClick={() => updateLowStockMutation.mutate()}>
                    Save Low Stock Settings
                  </Button>
                </div>
              </div>

              {/* Pre-orders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Pre-orders</Label>
                    <p className="text-sm text-muted-foreground">Allow ordering out-of-stock items</p>
                  </div>
                  <Switch
                    checked={preorderSettings?.enabled || false}
                    onCheckedChange={(checked) => togglePreordersMutation.mutate(checked)}
                  />
                </div>

                {preorderSettings?.enabled && (
                  <div className="space-y-4 ml-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="preorderBadgeText">Pre-order Badge Text</Label>
                      <Input
                        id="preorderBadgeText"
                        value={preorderBadgeText}
                        onChange={(e) => setPreorderBadgeText(e.target.value)}
                        placeholder="Pre-Order"
                      />
                    </div>

                    <Button onClick={() => updatePreorderMutation.mutate()}>
                      Save Pre-order Settings
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
