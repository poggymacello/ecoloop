import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { transport: ws },
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  realtime: { transport: ws },
  auth: { autoRefreshToken: false, persistSession: false },
});