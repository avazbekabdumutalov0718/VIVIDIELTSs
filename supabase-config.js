// 1) Go to https://supabase.com → create a free project.
// 2) In your project: Settings → API → copy "Project URL" and "anon public" key.
// 3) Paste them below. This file is safe to be public — the anon key only
//    allows what your Row Level Security policies (schema.sql) permit.

const SUPABASE_URL = 'https://dopccjigpfhukjthrvnf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_468151fmhwrkteGeN1J23A_opBgehxg';

// Telegram login works via a bot command (@vividielts_bot → /login → 6-digit
// code typed into the site) rather than a widget, so no config is needed
// here. Setup walkthrough: /supabase/functions/telegram-code-login/README.md