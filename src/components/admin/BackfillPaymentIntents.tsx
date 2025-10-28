import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export const BackfillPaymentIntents = () => {
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleBackfill = async () => {
    setIsBackfilling(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('backfill-payment-intents');

      if (error) throw error;

      setResults(data);
      
      if (data.updated > 0) {
        toast.success(`Successfully backfilled ${data.updated} orders`);
      } else {
        toast.info('No orders needed backfilling');
      }
      
    } catch (error) {
      console.error('Backfill error:', error);
      toast.error('Failed to backfill payment intents');
    } finally {
      setIsBackfilling(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backfill Payment Intent IDs</CardTitle>
        <CardDescription>
          Retrieve missing payment intent IDs from Stripe for existing orders.
          This is required to enable automatic refunds via the Stripe API.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleBackfill} 
          disabled={isBackfilling}
          className="w-full"
        >
          {isBackfilling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Backfilling...
            </>
          ) : (
            'Start Backfill Process'
          )}
        </Button>

        {results && (
          <div className="space-y-3">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Backfill Complete</strong>
                <div className="mt-2 space-y-1 text-sm">
                  <div>Total orders processed: {results.total}</div>
                  <div className="text-green-600">✓ Successfully updated: {results.updated}</div>
                  {results.failed > 0 && (
                    <div className="text-red-600">✗ Failed: {results.failed}</div>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            {results.errors && results.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Errors encountered:</strong>
                  <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                    {results.errors.map((err: any, idx: number) => (
                      <li key={idx}>
                        Order {err.orderNumber}: {err.error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
