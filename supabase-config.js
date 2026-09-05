// 1) Go to https://supabase.com → create a free project.
// 2) In your project: Settings → API → copy "Project URL" and "anon public" key.
// 3) Paste them below. This file is safe to be public — the anon key only
//    allows what your Row Level Security policies (schema.sql) permit.

const SUPABASE_URL = 'https://dopccjigpfhukjthrvnf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_468151fmhwrkteGeN1J23A_opBgehxg';

// Optional: Telegram Login Widget. Create a bot with @BotFather, run
// /setdomain on it pointing to this site's domain, then put the bot's
// @username (without the @) below. Leave empty to keep the Telegram
// button disabled. Full walkthrough: /supabase/functions/telegram-auth/README.md
const TELEGRAM_BOT_USERNAME = 'vividielts_bot';