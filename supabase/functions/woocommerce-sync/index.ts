// deno-lint-ignore-file no-explicit-any
// WooCommerce -> Supabase sync (products & customers)
// Fetches products and customers from WooCommerce and upserts them into Supabase
// Run manually via Supabase Functions invoke or dashboard. Requires JWT by default.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Types for WooCommerce responses (partial)
interface WooImage { id: number; src: string; alt?: string; name?: string }
interface WooCategory { id: number; name: string; slug: string }
interface WooAttributeOption { id?: number; name?: string; option?: string }
interface WooAttribute { id: number; name: string; position?: number; visible?: boolean; variation?: boolean; options?: (string | WooAttributeOption)[] }

interface WooProduct {
  id: number;
  name: string;
  slug: string;
  price: string | null;
  regular_price?: string | null;
  sale_price?: string | null;
  description?: string | null;
  short_description?: string | null;
  stock_quantity?: number | null;
  manage_stock?: boolean;
  in_stock?: boolean;
  images?: WooImage[];
  categories?: WooCategory[];
  attributes?: WooAttribute[];
  meta_data?: any[];
  date_created?: string;
}

interface WooCustomer {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  billing?: any;
  shipping?: any;
  orders_count?: number;
  total_spent?: string;
  date_created?: string;
}

const PER_PAGE = 100;

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { "X-Client-Info": "woocommerce-sync" } },
  });

  const baseUrl = Deno.env.get("WOOCOMMERCE_BASE_URL");
  const consumerKey = Deno.env.get("WOOCOMMERCE_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("WOOCOMMERCE_CONSUMER_SECRET");

  if (!baseUrl || !consumerKey || !consumerSecret) {
    await supabase.from("woocommerce_sync_log").insert({
      status: "error",
      sync_type: "products",
      message: "Missing WooCommerce secrets",
    });
    return new Response(JSON.stringify({ error: "Missing WooCommerce secrets" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const url = new URL(baseUrl);
  // Ensure no trailing slash
  const apiBase = `${url.origin}${url.pathname.replace(/\/$/, "")}`;

  let productsProcessed = 0;
  let customersProcessed = 0;

  try {
    // ===== SYNC PRODUCTS =====
    console.log("Starting product sync...");
    console.log(`API Base URL: ${apiBase}`);
    let page = 1;
    while (true) {
      const productsUrl = `${apiBase}/wp-json/wc/v3/products?per_page=${PER_PAGE}&page=${page}&consumer_key=${encodeURIComponent(consumerKey)}&consumer_secret=${encodeURIComponent(consumerSecret)}`;
      
      console.log(`Fetching page ${page} from: ${apiBase}/wp-json/wc/v3/products`);
      const res = await fetch(productsUrl);
      
      console.log(`Response status: ${res.status}`);
      console.log(`Response content-type: ${res.headers.get('content-type')}`);
      
      if (!res.ok) {
        const text = await res.text();
        console.error(`API Response: ${text.substring(0, 500)}`);
        throw new Error(`Products request failed (${res.status}). Check that your WooCommerce URL is correct and REST API is enabled.`);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await res.text();
        console.error(`Non-JSON response received. Content-Type: ${contentType}`);
        console.error(`Response preview: ${text.substring(0, 500)}`);
        throw new Error(`WooCommerce returned HTML instead of JSON. Verify your WOOCOMMERCE_BASE_URL is correct (should be like "https://yourdomain.com" without /wp-json).`);
      }
      
      const data: WooProduct[] = await res.json();

      if (!Array.isArray(data) || data.length === 0) break;

      // Map to DB rows
      const rows = data.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price !== null && p.price !== undefined && p.price !== "" ? Number(p.price) : null,
        regular_price: p.regular_price ? Number(p.regular_price) : null,
        sale_price: p.sale_price ? Number(p.sale_price) : null,
        description: p.description ?? null,
        short_description: p.short_description ?? null,
        stock_quantity: p.stock_quantity ?? null,
        manage_stock: p.manage_stock ?? false,
        in_stock: p.in_stock ?? true,
        images: p.images ?? [],
        categories: p.categories ?? [],
        attributes: p.attributes ?? [],
        meta_data: p.meta_data ?? {},
        synced_at: new Date().toISOString(),
      }));

      const { error: upsertError } = await supabase
        .from("woocommerce_products")
        .upsert(rows, { onConflict: "id" });

      if (upsertError) throw upsertError;

      productsProcessed += rows.length;

      if (data.length < PER_PAGE) break;
      page += 1;
    }
    console.log(`Synced ${productsProcessed} products`);

    // ===== SYNC CUSTOMERS =====
    console.log("Starting customer sync...");
    page = 1;
    while (true) {
      const customersUrl = `${apiBase}/wp-json/wc/v3/customers?per_page=${PER_PAGE}&page=${page}&consumer_key=${encodeURIComponent(consumerKey)}&consumer_secret=${encodeURIComponent(consumerSecret)}`;

      const res = await fetch(customersUrl);
      if (!res.ok) {
        const text = await res.text();
        console.error(`Customers request failed (${res.status}): ${text}`);
        // Don't throw - we still want to log success for products
        break;
      }
      const data: WooCustomer[] = await res.json();

      if (!Array.isArray(data) || data.length === 0) break;

      // Map to DB rows
      const rows = data.map((c) => ({
        id: c.id,
        email: c.email,
        first_name: c.first_name ?? null,
        last_name: c.last_name ?? null,
        billing: c.billing ?? {},
        shipping: c.shipping ?? {},
        orders_count: c.orders_count ?? 0,
        total_spent: c.total_spent ? Number(c.total_spent) : 0,
      }));

      const { error: upsertError } = await supabase
        .from("woocommerce_customers")
        .upsert(rows, { onConflict: "id" });

      if (upsertError) {
        console.error("Customer upsert error:", upsertError);
        // Continue anyway
      } else {
        customersProcessed += rows.length;
      }

      if (data.length < PER_PAGE) break;
      page += 1;
    }
    console.log(`Synced ${customersProcessed} customers`);

    // Log success
    await supabase.from("woocommerce_sync_log").insert({
      status: "success",
      sync_type: "products_and_customers",
      records_processed: productsProcessed + customersProcessed,
      message: `Synced ${productsProcessed} products and ${customersProcessed} customers`,
    });

    return new Response(
      JSON.stringify({ 
        status: "ok", 
        products: productsProcessed,
        customers: customersProcessed,
        total: productsProcessed + customersProcessed
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Sync error:", message);
    
    await supabase.from("woocommerce_sync_log").insert({
      status: "error",
      sync_type: "products_and_customers",
      message,
    });

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
