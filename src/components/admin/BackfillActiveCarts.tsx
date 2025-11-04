import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingBag } from "lucide-react";

export const BackfillActiveCarts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const backfillTestData = async () => {
    setIsLoading(true);
    try {
      // Insert test visitor analytics first
      const { error: visitorError } = await supabase
        .from('visitor_analytics')
        .upsert([
          {
            session_id: 'session_test_001',
            visitor_id: 'visitor_001',
            country: 'CA',
            city: 'Toronto',
            page_path: '/shop',
            created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            visited_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            session_start: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          },
          {
            session_id: 'session_test_002',
            visitor_id: 'visitor_002',
            country: 'US',
            city: 'New York',
            page_path: '/shop',
            created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
            visited_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
            session_start: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          },
          {
            session_id: 'session_test_003',
            visitor_id: 'visitor_003',
            country: 'CA',
            city: 'Vancouver',
            page_path: '/shop',
            created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
            visited_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
            session_start: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          },
        ]);

      if (visitorError) {
        console.error('Error inserting visitor analytics:', visitorError);
      }

      // Insert test active carts
      const { error: cartError } = await supabase
        .from('active_carts')
        .upsert([
          {
            session_id: 'session_test_001',
            visitor_id: 'visitor_001',
            email: 'sarah.jones@example.com',
            cart_items: [
              {
                id: '1',
                name: 'Open Box - 4 Rod Bangle Stand',
                price: 29.99,
                quantity: 2,
                image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/products/open-box-bangle-4rod.jpg',
              },
            ],
            subtotal: 59.98,
            last_updated: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          },
          {
            session_id: 'session_test_002',
            visitor_id: 'visitor_002',
            email: 'emily.smith@gmail.com',
            cart_items: [
              {
                id: '2',
                name: 'Multipurpose Box',
                price: 24.99,
                quantity: 1,
                image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/products/multipurpose-box.jpg',
              },
              {
                id: '3',
                name: '2-Rod Bangle Box',
                price: 19.99,
                quantity: 3,
                image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/products/bangle-2rod.jpg',
              },
            ],
            subtotal: 84.96,
            last_updated: new Date(Date.now() - 30 * 1000).toISOString(),
            created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          },
          {
            session_id: 'session_test_003',
            visitor_id: 'visitor_003',
            email: null,
            cart_items: [
              {
                id: '1',
                name: 'Open Box - 4 Rod Bangle Stand',
                price: 29.99,
                quantity: 1,
                image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/products/open-box-bangle-4rod.jpg',
              },
            ],
            subtotal: 29.99,
            last_updated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          },
        ]);

      if (cartError) {
        throw cartError;
      }

      toast({
        title: "Success!",
        description: "Added 3 test active carts with location data",
      });
    } catch (error) {
      console.error('Error backfilling:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to backfill test data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Backfill Active Carts Test Data
        </CardTitle>
        <CardDescription>
          Add 3 test active carts to see the feature in action
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={backfillTestData} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Test Data
        </Button>
      </CardContent>
    </Card>
  );
};
