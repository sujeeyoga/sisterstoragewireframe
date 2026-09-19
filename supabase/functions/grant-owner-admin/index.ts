// One-off repair: ensures the store owner account has the admin role row in the
// store's data project. Hard-locked to the owner email, idempotent.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const STORE_DB_URL = "https://attczdhexkpxpyqyasgz.supabase.co";
const OWNER_EMAIL = "sisterstorageinc@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const serviceKey = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceKey) {
    return new Response(JSON.stringify({ error: "Not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const db = createClient(STORE_DB_URL, serviceKey, { auth: { persistSession: false } });

  try {
    const { data: list, error: listError } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listError) throw listError;

    const owner = list.users.find(
      (u) => (u.email || "").toLowerCase() === OWNER_EMAIL,
    );
    if (!owner) {
      return new Response(JSON.stringify({ error: "Owner account not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existing } = await db
      .from("user_roles")
      .select("id, role")
      .eq("user_id", owner.id);

    const already = (existing ?? []).some((r: any) => String(r.role).toLowerCase() === "admin");
    if (already) {
      return new Response(JSON.stringify({ ok: true, alreadyAdmin: true, userId: owner.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: insertError } = await db
      .from("user_roles")
      .insert({ user_id: owner.id, role: "admin" });

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message, userId: owner.id }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, granted: true, userId: owner.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
