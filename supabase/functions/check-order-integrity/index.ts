import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IntegrityIssue {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  count: number;
  details: string;
  orders?: any[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting order integrity check");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const issues: IntegrityIssue[] = [];

    // Check 1: Fulfilled orders without fulfilled_at timestamp
    const { data: missingFulfilledAt } = await supabase
      .from("orders")
      .select("id, order_number, fulfillment_status, fulfilled_at")
      .eq("fulfillment_status", "fulfilled")
      .is("fulfilled_at", null);

    if (missingFulfilledAt && missingFulfilledAt.length > 0) {
      issues.push({
        type: "missing_fulfilled_at",
        severity: "warning",
        count: missingFulfilledAt.length,
        details: "Orders marked as fulfilled but missing fulfilled_at timestamp",
        orders: missingFulfilledAt.slice(0, 10),
      });
    }

    // Check 2: Orders with missing critical fields
    const { data: missingFields } = await supabase
      .from("orders")
      .select("id, order_number, customer_email, items")
      .or("customer_email.is.null,items.eq.[]");

    if (missingFields && missingFields.length > 0) {
      issues.push({
        type: "missing_critical_fields",
        severity: "critical",
        count: missingFields.length,
        details: "Orders missing customer email or items",
        orders: missingFields.slice(0, 10),
      });
    }

    // Check 3: Orders with calculation mismatches
    const { data: allOrders } = await supabase
      .from("orders")
      .select("id, order_number, items, subtotal, shipping, tax, total, status")
      .neq("status", "pending");

    let calculationMismatches = 0;
    const mismatchedOrders: any[] = [];

    if (allOrders) {
      for (const order of allOrders) {
        if (!order.items || order.items.length === 0) continue;

        const itemsSubtotal = order.items.reduce((sum: number, item: any) => {
          return sum + (item.price * item.quantity);
        }, 0);

        const expectedTotal = Number((itemsSubtotal + (order.shipping || 0) + (order.tax || 0)).toFixed(2));
        const actualTotal = Number(order.total);
        const difference = Math.abs(expectedTotal - actualTotal);

        if (difference > 0.10) {
          calculationMismatches++;
          if (mismatchedOrders.length < 10) {
            mismatchedOrders.push({
              order_number: order.order_number,
              expected: expectedTotal,
              actual: actualTotal,
              difference,
            });
          }
        }
      }
    }

    if (calculationMismatches > 0) {
      issues.push({
        type: "calculation_mismatch",
        severity: "critical",
        count: calculationMismatches,
        details: "Orders with incorrect total calculations (difference > $0.10)",
        orders: mismatchedOrders,
      });
    }

    // Check 4: Duplicate order numbers
    const { data: duplicates } = await supabase.rpc('get_duplicate_order_numbers') as any;

    if (duplicates && duplicates.length > 0) {
      issues.push({
        type: "duplicate_order_numbers",
        severity: "critical",
        count: duplicates.length,
        details: "Duplicate order numbers found",
        orders: duplicates.slice(0, 10),
      });
    }

    // Check 5: Orders with negative values
    const { data: negativeValues } = await supabase
      .from("orders")
      .select("id, order_number, subtotal, shipping, tax, total")
      .or("subtotal.lt.0,total.lt.0,shipping.lt.0,tax.lt.0");

    if (negativeValues && negativeValues.length > 0) {
      issues.push({
        type: "negative_values",
        severity: "critical",
        count: negativeValues.length,
        details: "Orders with negative amounts",
        orders: negativeValues.slice(0, 10),
      });
    }

    // Check 6: Completed orders without Stripe payment intent
    const { data: missingPaymentIntents } = await supabase
      .from("orders")
      .select("id, order_number, status, payment_status, stripe_payment_intent_id")
      .eq("payment_status", "paid")
      .is("stripe_payment_intent_id", null);

    if (missingPaymentIntents && missingPaymentIntents.length > 0) {
      issues.push({
        type: "missing_payment_intent",
        severity: "warning",
        count: missingPaymentIntents.length,
        details: "Paid orders missing Stripe payment intent ID",
        orders: missingPaymentIntents.slice(0, 10),
      });
    }

    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;

    console.log(`Integrity check complete: ${criticalCount} critical, ${warningCount} warnings`);

    // If there are critical issues, send email notification
    if (criticalCount > 0) {
      console.log("Critical issues found, sending notification email");
      
      const emailBody = issues
        .filter(i => i.severity === 'critical')
        .map(i => `- ${i.type}: ${i.count} orders - ${i.details}`)
        .join('\n');

      await supabase.functions.invoke('send-email', {
        body: {
          type: 'admin_promotion',
          to: 'sisterstorageinc@gmail.com',
          data: {
            subject: '🚨 Critical Order Data Issues Detected',
            preview: `${criticalCount} critical issues found in order data`,
            body: `The daily integrity check found critical issues:\n\n${emailBody}\n\nPlease review the admin dashboard for details.`,
            ctaText: 'View Admin Dashboard',
            ctaUrl: 'https://sisterstorageandorganization.com/admin/orders',
          },
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        summary: {
          total_issues: issues.length,
          critical: criticalCount,
          warnings: warningCount,
        },
        issues,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking order integrity:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
