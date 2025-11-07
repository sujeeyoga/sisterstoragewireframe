import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface TestResult {
  step: string;
  status: "success" | "error" | "pending";
  message: string;
}

export function CheckoutFlowTester() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTest = async () => {
    setTesting(true);
    setResults([]);
    const testResults: TestResult[] = [];

    // Test 1: Check products are accessible
    try {
      testResults.push({ step: "Products", status: "pending", message: "Checking products..." });
      setResults([...testResults]);

      const { data: products, error } = await supabase
        .from("woocommerce_products")
        .select("*")
        .limit(1);

      if (error) throw error;
      if (!products || products.length === 0) throw new Error("No active products found");

      testResults[0] = { step: "Products", status: "success", message: `✓ ${products.length} active products found` };
      setResults([...testResults]);
    } catch (error: any) {
      testResults[0] = { step: "Products", status: "error", message: `✗ Error: ${error.message}` };
      setResults([...testResults]);
    }

    // Test 2: Check shipping zones
    try {
      testResults.push({ step: "Shipping", status: "pending", message: "Checking shipping zones..." });
      setResults([...testResults]);

      const { data: zones, error } = await (supabase as any)
        .from("shipping_zones")
        .select("id, name, is_active")
        .eq("is_active", true);

      if (error) throw error;
      if (!zones || zones.length === 0) throw new Error("No active shipping zones found");

      testResults[1] = { step: "Shipping", status: "success", message: `✓ ${zones.length} shipping zones configured` };
      setResults([...testResults]);
    } catch (error: any) {
      testResults[1] = { step: "Shipping", status: "error", message: `✗ Error: ${error.message}` };
      setResults([...testResults]);
    }

    // Test 3: Test shipping calculation
    try {
      testResults.push({ step: "Rate Calc", status: "pending", message: "Testing rate calculation..." });
      setResults([...testResults]);

      const { data, error } = await supabase.functions.invoke("calculate-shipping-zones", {
        body: {
          items: [{ product_id: "test", quantity: 1, weight: 500 }],
          destination: {
            country: "US",
            postal_code: "10001",
            province: "NY"
          }
        }
      });

      if (error) throw error;
      if (!data || !data.zones) throw new Error("Invalid response from shipping calculation");

      testResults[2] = { step: "Rate Calc", status: "success", message: `✓ Shipping calculation working` };
      setResults([...testResults]);
    } catch (error: any) {
      testResults[2] = { step: "Rate Calc", status: "error", message: `✗ Error: ${error.message}` };
      setResults([...testResults]);
    }

    // Test 4: Check Stripe configuration
    try {
      testResults.push({ step: "Stripe", status: "pending", message: "Checking Stripe..." });
      setResults([...testResults]);

      const { data: settings, error } = await supabase
        .from("store_settings")
        .select("setting_value")
        .eq("setting_key", "stripe_publishable_key")
        .single();

      if (error) throw error;
      if (!settings?.setting_value) throw new Error("Stripe key not configured");

      testResults[3] = { step: "Stripe", status: "success", message: "✓ Stripe configured" };
      setResults([...testResults]);
    } catch (error: any) {
      testResults[3] = { step: "Stripe", status: "error", message: `✗ Error: ${error.message}` };
      setResults([...testResults]);
    }

    // Test 5: Test checkout session creation
    try {
      testResults.push({ step: "Checkout", status: "pending", message: "Testing checkout session..." });
      setResults([...testResults]);

      const { data: product } = await supabase
        .from("woocommerce_products")
        .select("id, price")
        .limit(1)
        .single();

      if (!product) throw new Error("No product to test with");

      const testData = {
        items: [{
          product_id: String(product.id),
          quantity: 1,
          price: parseFloat(String(product.price || "0"))
        }],
        shipping: {
          name: "Test User",
          address: "123 Test St",
          city: "Toronto",
          province: "ON",
          postal_code: "M5H 2N2",
          country: "CA"
        },
        shipping_rate: 10,
        shipping_service: "test"
      };

      const { error } = await supabase.functions.invoke("create-checkout", {
        body: testData
      });

      if (error) throw error;

      testResults[4] = { step: "Checkout", status: "success", message: "✓ Checkout session creation works" };
      setResults([...testResults]);
    } catch (error: any) {
      testResults[4] = { step: "Checkout", status: "error", message: `✗ Error: ${error.message}` };
      setResults([...testResults]);
    }

    setTesting(false);

    const hasErrors = testResults.some(r => r.status === "error");
    if (hasErrors) {
      toast.error("Some tests failed. Check results above.");
    } else {
      toast.success("All checkout flow tests passed!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout Flow Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runTest} 
            disabled={testing}
            className="w-full"
          >
            {testing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {testing ? "Running Tests..." : "Run Checkout Tests"}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result, i) => (
              <div 
                key={i}
                className="flex items-start gap-2 p-3 rounded-lg border bg-card"
              >
                {result.status === "success" && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                )}
                {result.status === "error" && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                {result.status === "pending" && (
                  <Loader2 className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5 animate-spin" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{result.step}</div>
                  <div className="text-sm text-muted-foreground">{result.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
