// One-time schema bootstrap: executes the bundled schema.sql against the
// Lovable Cloud database using SUPABASE_DB_URL. Does NOT accept SQL from the
// request — the SQL is fixed at deploy time.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'

const RUN_TOKEN = 'ddl-bootstrap-7f3a9c1e'

// Split SQL into statements, respecting $$ ... $$ function bodies.
function splitStatements(sql: string): string[] {
  const stmts: string[] = []
  let cur = ''
  let inDollar = false
  const lines = sql.split('\n')
  for (const line of lines) {
    cur += line + '\n'
    // count $$ occurrences on this line
    const matches = line.match(/\$\$/g)
    if (matches) {
      for (const _ of matches) inDollar = !inDollar
    }
    if (!inDollar && cur.trimEnd().endsWith(';')) {
      stmts.push(cur.trim())
      cur = ''
    }
  }
  if (cur.trim()) stmts.push(cur.trim())
  return stmts
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    if (req.headers.get('x-run-token') !== RUN_TOKEN) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const dbUrl = Deno.env.get('SUPABASE_DB_URL')
    if (!dbUrl) throw new Error('SUPABASE_DB_URL not set')

    const sql = await Deno.readTextFile(new URL('./schema.sql', import.meta.url))
    const statements = splitStatements(sql).filter(s => s && !s.startsWith('--'))

    const client = new Client(dbUrl)
    await client.connect()
    const results: Array<{ i: number; ok: boolean; stmt: string; error?: string }> = []
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i]
      try {
        await client.queryArray(stmt)
        results.push({ i, ok: true, stmt: stmt.slice(0, 90) })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        // Tolerate "already exists" for idempotent re-runs
        if (/already exists|duplicate/i.test(msg)) {
          results.push({ i, ok: true, stmt: stmt.slice(0, 90), error: `tolerated: ${msg}` })
        } else {
          results.push({ i, ok: false, stmt: stmt.slice(0, 90), error: msg })
        }
      }
    }
    await client.end()
    const failed = results.filter(r => !r.ok)
    return new Response(JSON.stringify({ total: statements.length, ok: results.length - failed.length, failed }, null, 2), {
      status: failed.length ? 500 : 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
