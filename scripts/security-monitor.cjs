#!/usr/bin/env node
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE;
const lookbackMinutes = Number(process.env.SECURITY_MONITOR_LOOKBACK ?? '15');

if (!url || !key) {
  console.error('[security-monitor] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function run() {
  const since = new Date(Date.now() - lookbackMinutes * 60_000).toISOString();
  const { data, error } = await supabase
    .from('security_events')
    .select('id,type,identifier,detail,ip,created_at,user_agent')
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[security-monitor] Query failed:', error.message);
    process.exit(2);
  }

  if (!data || data.length === 0) {
    console.log(`[security-monitor] No security events in the last ${lookbackMinutes} minutes.`);
    return;
  }

  const grouped = data.reduce((acc, evt) => {
    acc[evt.type] = (acc[evt.type] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`⚠️  Security events in the last ${lookbackMinutes} minutes:`);
  for (const [type, count] of Object.entries(grouped)) {
    console.log(`  - ${type}: ${count}`);
  }

  console.log('\nLatest entries:');
  for (const evt of data.slice(0, 5)) {
    console.log(
      `  [${evt.created_at}] ${evt.type} — ${evt.identifier ?? 'n/a'} — ${evt.detail ?? 'sin detalle'} (ip: ${
        evt.ip ?? 'n/a'
      })`
    );
  }
}

run().catch((err) => {
  console.error('[security-monitor] Unexpected error:', err);
  process.exit(3);
});
