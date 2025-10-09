import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <BaseLayout variant="standard" pageId="payment-success">
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          {sessionId && (
            <p className="text-sm text-muted-foreground">
              Order ID: {sessionId}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => navigate("/shop")}
              className="bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default PaymentSuccess;
