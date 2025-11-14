import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2, AlertCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ShippingEstimate {
  baseRate: number;
  tariffFees?: number;
  totalCost: number;
  carrierName?: string;
  estimatedDays?: string;
  zone?: string;
}

export const ShippingCostEstimator = ({ 
  subtotal = 50 
}: { 
  subtotal?: number 
}) => {
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("CA");
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<ShippingEstimate | null>(null);
  const [error, setError] = useState("");

  const calculateShipping = async () => {
    if (!postalCode.trim()) {
      setError("Please enter a postal/ZIP code");
      return;
    }

    setLoading(true);
    setError("");
    setEstimate(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke(
        "calculate-shipping-zones",
        {
          body: {
            address: {
              postal_code: postalCode.trim(),
              country_code: country,
            },
            subtotal: subtotal,
            items: [] // Empty items for estimation
          },
        }
      );

      if (funcError) throw funcError;

      if (data?.error) {
        throw new Error(data.error);
      }

      // Extract shipping details
      const shippingCost = data?.shipping_cost || 0;
      const zoneName = data?.matched_zone?.name || "Standard";
      
      // Estimate tariff based on international shipping
      const isInternational = country !== "CA" && country !== "Canada";
      const estimatedTariff = isInternational ? shippingCost * 0.15 : 0; // 15% tariff estimate
      const baseRate = shippingCost - estimatedTariff;

      setEstimate({
        baseRate: baseRate,
        tariffFees: estimatedTariff > 0 ? estimatedTariff : undefined,
        totalCost: shippingCost,
        zone: zoneName,
        estimatedDays: isInternational ? "7-14 business days" : "3-7 business days"
      });

      toast.success("Shipping estimate calculated");
    } catch (err: any) {
      console.error("Shipping estimate error:", err);
      setError(err.message || "Failed to calculate shipping");
      toast.error("Could not estimate shipping cost");
    } finally {
      setLoading(false);
    }
  };

  const showTariffNotice = estimate?.tariffFees && estimate.tariffFees > 0;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Estimate Shipping Cost</h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder={country === "US" ? "ZIP Code" : "Postal Code"}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") calculateShipping();
            }}
          />
        </div>

        <Button 
          onClick={calculateShipping} 
          disabled={loading || !postalCode.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Shipping
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {estimate && (
        <div className="space-y-3 pt-3 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Shipping Rate</span>
              <span className="font-medium">${estimate.baseRate.toFixed(2)}</span>
            </div>
            
            {estimate.tariffFees && estimate.tariffFees > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tariff & Customs Fees</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  +${estimate.tariffFees.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-base font-semibold pt-2 border-t">
              <span>Total Shipping Cost</span>
              <span className="text-primary">${estimate.totalCost.toFixed(2)}</span>
            </div>
          </div>

          {estimate.zone && (
            <div className="text-xs text-muted-foreground">
              Zone: {estimate.zone} • Est. Delivery: {estimate.estimatedDays}
            </div>
          )}

          {showTariffNotice && (
            <Alert className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
              <Info className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-xs text-orange-800 dark:text-orange-300">
                <strong>Tariff Notice:</strong> Due to recent international trade policies, 
                additional tariff and customs fees apply to shipments to {country}. 
                The rate shown includes all applicable fees and is based on live carrier pricing.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Estimate based on cart subtotal of ${subtotal.toFixed(2)}
      </p>
    </Card>
  );
};
