import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const IDS = [
  "6ede241d-92f7-45d3-92b7-8f04144765ec","e85f04f2-2c20-4da3-83b4-66efc8ad0521",
  "1686c989-e474-48d7-9710-60240de5d31e","f0dbd6bb-3825-424f-ba26-4169cc6227e8",
  "06ac80f5-0964-4dc5-9f6a-ce89143f64ba","5f0e0ccb-2a1a-42b7-afc7-017558a1a417",
  "c05713f9-fd2e-4430-a6d1-0fa27a79e418",
];

Deno.serve(async (req) => {
  if (req.headers.get("x-run-token") !== "fix-track-5d71") return new Response("no", { status: 401 });
  const apply = new URL(req.url).searchParams.get("apply") === "1";
  const sb = createClient("https://attczdhexkpxpyqyasgz.supabase.co", Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY")!);
  const { data, error } = await sb.from("orders").select("id,order_number,customer_email,customer_name,carrier_name,tracking_number,shipping_notification_sent_at,shipping_address").in("id", IDS);
  if (error) return new Response(error.message, { status: 500 });
  const out = [];
  for (const r of data!) {
    const text: string = r.tracking_number || "";
    const toks = text.split(/\s+/);
    const first = (r.customer_name || "").trim().split(/\s+/)[0].toLowerCase();
    let clean: string | null = null;
    const idx = toks.findIndex((t, i) => t.toLowerCase() === first && i > 0);
    if (idx > 0) for (let i = idx - 1; i >= Math.max(0, idx - 4); i--) {
      if (/^26[0-9A-Z]{6,12}$/.test(toks[i])) { clean = toks[i]; break; }
    }
    if (apply && clean) {
      const { error: e } = await sb.from("orders").update({ tracking_number: clean }).eq("id", r.id);
      if (e) clean = "UPDATE FAILED: " + e.message;
    }
    out.push({ ...r, clean_tracking: clean });
  }
  return new Response(JSON.stringify(out, null, 2), { headers: { "Content-Type": "application/json" } });
});
