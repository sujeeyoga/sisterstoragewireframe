import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Percent, Gift, Mail, Star, Package, AlertTriangle, MapPin, Store, Sparkles, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useFlashSales } from "@/hooks/useFlashSales";
import { DiscountConflictWarning } from "./DiscountConflictWarning";

interface StoreSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  enabled: boolean;
}

export function StoreSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: flashSales } = useFlashSales();

  // Count active flash sales
  const now = new Date();
  const activeFlashSalesCount = flashSales?.filter(sale => {
    const start = new Date(sale.starts_at);
    const end = new Date(sale.ends_at);
    return sale.enabled && start <= now && end >= now;
  }).length || 0;

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

  const { data: showSalePricingSettings } = useQuery({
    queryKey: ['store-settings', 'show-sale-pricing'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'show_sale_pricing')
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

  // Active tab state
  const [activeTab, setActiveTab] = useState("general");

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
  const toggleShowSalePricingMutation = createToggleMutation('show_sale_pricing', ['store-settings', 'show-sale-pricing']);

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your store configuration and features</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="general" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Promotions</span>
          </TabsTrigger>
          <TabsTrigger value="customer" className="gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Customer</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
        <TabsContent value="general" className="space-y-6">
          {/* Fulfillment Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin className="h-5 w-5" />
                Fulfillment Address
              </CardTitle>
              <CardDescription>Configure your warehouse/shipping address for Stallion Express fulfillment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

              <div className="grid sm:grid-cols-2 gap-4">
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
                    placeholder="shipping@example.com"
                  />
                </div>
              </div>

              <Button
                onClick={() => updateFulfillmentAddressMutation.mutate()}
                disabled={updateFulfillmentAddressMutation.isPending}
                className="w-full sm:w-auto"
              >
                Save Fulfillment Address
              </Button>
            </CardContent>
          </Card>

          {/* Coming Soon Page */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Settings className="h-5 w-5" />
                Coming Soon Page
              </CardTitle>
              <CardDescription>Enable coming soon page for visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Show Coming Soon Page</Label>
                  <p className="text-sm text-muted-foreground">Visitors must login to access the site</p>
                </div>
                <Switch
                  checked={comingSoonSettings?.enabled || false}
                  onCheckedChange={(checked) => toggleComingSoonMutation.mutate(checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROMOTIONS TAB */}
        <TabsContent value="promotions" className="space-y-6">
          {/* Discount Conflict Warning */}
          <DiscountConflictWarning
            storeWideEnabled={discountSettings?.enabled}
            storeWidePercentage={parseFloat(discountPercentage)}
            activeFlashSalesCount={activeFlashSalesCount}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Percent className="h-5 w-5" />
                Store-Wide Discount
              </CardTitle>
              <CardDescription>Apply a percentage discount to all products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Enable Store-Wide Discount</Label>
                  <p className="text-sm text-muted-foreground">Discount applied at checkout</p>
                </div>
                <Switch
                  checked={discountSettings?.enabled || false}
                  onCheckedChange={(checked) => toggleDiscountMutation.mutate(checked)}
                />
              </div>

              {discountSettings?.enabled && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discountPercentage">Discount Percentage</Label>
                      <Input
                        id="discountPercentage"
                        type="number"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountName">Promotion Name</Label>
                      <Input
                        id="discountName"
                        value={discountName}
                        onChange={(e) => setDiscountName(e.target.value)}
                        placeholder="Holiday Sale"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={() => updateDiscountMutation.mutate()} className="w-full sm:w-auto">
                    Save Settings
                  </Button>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                    <p className="font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Active: {discountName} - {discountPercentage}% off
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Show Sale Pricing Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Tag className="h-5 w-5" />
                Show Sale Pricing
              </CardTitle>
              <CardDescription>Control visibility of sale badges and crossed-out prices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Display Sale Pricing</Label>
                  <p className="text-sm text-muted-foreground">Show sale badges and original prices on product cards</p>
                </div>
                <Switch
                  checked={showSalePricingSettings?.enabled ?? true}
                  onCheckedChange={(checked) => toggleShowSalePricingMutation.mutate(checked)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This controls the display of sale pricing only. Actual sale prices remain unchanged in the database. Use this to prepare sales in advance or temporarily hide sale indicators.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* US Free Gift Promotion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Gift className="h-5 w-5" />
                US Free Gift Promotion
              </CardTitle>
              <CardDescription>Automatically add a free gift for qualifying US orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Enable Free Gift for US Orders</Label>
                  <p className="text-sm text-muted-foreground">Add Medium Bangle Box for orders $100+</p>
                </div>
                <Switch
                  checked={false}
                  onCheckedChange={async (checked) => {
                    try {
                      const { data: existing } = await supabase
                        .from('store_settings')
                        .select('*')
                        .eq('setting_key', 'us_free_gift_promotion')
                        .maybeSingle();

                      if (existing) {
                        await supabase
                          .from('store_settings')
                          .update({ enabled: checked })
                          .eq('setting_key', 'us_free_gift_promotion');
                      } else {
                        await supabase
                          .from('store_settings')
                          .insert({
                            setting_key: 'us_free_gift_promotion',
                            enabled: checked,
                            setting_value: {
                              min_order_amount: 100,
                              gift_product_id: 25814005,
                              countries: ['US'],
                              display_message: 'Free Medium Bangle Box with orders over $100! 🎁'
                            }
                          });
                      }
                      queryClient.invalidateQueries({ queryKey: ['free-gift-promotion'] });
                      toast({ title: "Success", description: "Free gift promotion updated" });
                    } catch (error: any) {
                      toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive",
                      });
                    }
                  }}
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>How it works:</strong> When a US customer's order reaches $100 or more, a Medium Bangle Box ($25 value) will automatically be added to their order at no charge.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CUSTOMER TAB */}
        <TabsContent value="customer" className="space-y-6">
          {/* Gift Messages & Wrapping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Gift className="h-5 w-5" />
                Gift Messages & Wrapping
              </CardTitle>
              <CardDescription>Allow customers to add gift messages and wrapping</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Enable Gift Options</Label>
                  <p className="text-sm text-muted-foreground">Show gift options at checkout</p>
                </div>
                <Switch
                  checked={giftSettings?.enabled || false}
                  onCheckedChange={(checked) => toggleGiftMutation.mutate(checked)}
                />
              </div>

              {giftSettings?.enabled && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="grid sm:grid-cols-2 gap-4">
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
                  </div>
                  <Button onClick={() => updateGiftMutation.mutate()} className="w-full sm:w-auto">
                    Save Gift Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Newsletter Opt-in */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Mail className="h-5 w-5" />
                Newsletter Opt-in
              </CardTitle>
              <CardDescription>Show newsletter checkbox at checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Enable Newsletter</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to subscribe</p>
                </div>
                <Switch
                  checked={newsletterSettings?.enabled || false}
                  onCheckedChange={(checked) => toggleNewsletterMutation.mutate(checked)}
                />
              </div>

              {newsletterSettings?.enabled && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="newsletterIncentive">Incentive Text</Label>
                    <Input
                      id="newsletterIncentive"
                      value={newsletterIncentive}
                      onChange={(e) => setNewsletterIncentive(e.target.value)}
                      placeholder="Get 10% off your next order!"
                    />
                  </div>
                  <Button onClick={() => updateNewsletterMutation.mutate()} className="w-full sm:w-auto">
                    Save Newsletter Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Star className="h-5 w-5" />
                Product Reviews
              </CardTitle>
              <CardDescription>Enable product review system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Enable Reviews</Label>
                  <p className="text-sm text-muted-foreground">Allow customer reviews on products</p>
                </div>
                <Switch
                  checked={reviewSettings?.enabled || false}
                  onCheckedChange={(checked) => toggleReviewsMutation.mutate(checked)}
                />
              </div>

              {reviewSettings?.enabled && (
                <div className="space-y-4 p-4 border rounded-lg">
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
                  <Button onClick={() => updateReviewsMutation.mutate()} className="w-full sm:w-auto">
                    Save Review Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* INVENTORY TAB */}
        <TabsContent value="inventory" className="space-y-6">
          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>Configure low stock threshold and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
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
              </div>
              <Button onClick={() => updateLowStockMutation.mutate()} className="w-full sm:w-auto">
                Save Low Stock Settings
              </Button>
            </CardContent>
          </Card>

          {/* Pre-orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="h-5 w-5" />
                Pre-orders
              </CardTitle>
              <CardDescription>Allow ordering out-of-stock items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Enable Pre-orders</Label>
                  <p className="text-sm text-muted-foreground">Allow pre-orders for out-of-stock items</p>
                </div>
                <Switch
                  checked={preorderSettings?.enabled || false}
                  onCheckedChange={(checked) => togglePreordersMutation.mutate(checked)}
                />
              </div>

              {preorderSettings?.enabled && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="preorderBadgeText">Pre-order Badge Text</Label>
                    <Input
                      id="preorderBadgeText"
                      value={preorderBadgeText}
                      onChange={(e) => setPreorderBadgeText(e.target.value)}
                      placeholder="Pre-Order"
                    />
                  </div>
                  <Button onClick={() => updatePreorderMutation.mutate()} className="w-full sm:w-auto">
                    Save Pre-order Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
