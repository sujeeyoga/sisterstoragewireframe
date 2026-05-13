// Loosens the typed Supabase client so legacy table names (which live in a
// different project than the one the generated types.ts targets) compile.
// See conversation: client.ts is hardcoded to the legacy DB while types.ts
// reflects the empty Lovable Cloud project.
import '@supabase/supabase-js';

declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    from(table: string): any;
    rpc(fn: string, args?: any, options?: any): any;
  }
}
