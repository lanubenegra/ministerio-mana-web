#!/usr/bin/env node
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
const LOOKBACK_MINUTES = Number(process.env.SECURITY_ALERT_LOOKBACK ?? '5');
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ALERT_EMAIL_TO = process.env.SECURITY_ALERT_TO;
const ALERT_EMAIL_FROM = process.env.SECURITY_ALERT_FROM ?? 'alerts@ministeriomana.org';
const ALERT_WEBHOOK = process.env.SECURITY_ALERT_WEBHOOK;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('[security-alert] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });

const DEFAULT_THRESHOLDS = {
  captcha_failed: 5,
  rate_limited: 5,
  webhook_invalid: 1,
  payment_error: 2,
};

function parseThresholds() {
  const raw = process.env.SECURITY_ALERT_THRESHOLDS;
  if (!raw) return { ...DEFAULT_THRESHOLDS };
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_THRESHOLDS, ...parsed };
  } catch (error) {
    console.warn('[security-alert] Invalid SECURITY_ALERT_THRESHOLDS JSON. Using defaults.');
    return { ...DEFAULT_THRESHOLDS };
  }
}

async function fetchEvents() {
  const since = new Date(Date.now() - LOOKBACK_MINUTES * 60_000).toISOString();
  const { data, error } = await supabase
    .from('security_events')
    .select('id,type,identifier,detail,ip,created_at,user_agent')
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

function groupCounts(events) {
  return events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] ?? 0) + 1;
    return acc;
  }, {});
}

function filterTriggered(counts, thresholds) {
  const triggered = [];
  for (const [type, limit] of Object.entries(thresholds)) {
    const value = counts[type] ?? 0;
    if (value >= limit && value > 0) {
      triggered.push({ type, value, limit });
    }
  }
  return triggered;
}

function buildSummary(triggered, events) {
  const header = `Security alerts in the last ${LOOKBACK_MINUTES} minutes:`;
  const lines = triggered.map((t) => `• ${t.type}: ${t.value} (limit ${t.limit})`);
  const latest = events.slice(0, 5).map((e) => {
    return `- [${e.created_at}] ${e.type} — ${e.identifier ?? 'n/a'} — ${e.detail ?? 'n/a'} (ip: ${e.ip ?? 'n/a'})`;
  });
  return [header, ...lines, '', 'Latest events:', ...latest].join('\n');
}

async function sendEmail(summary) {
  if (!RESEND_API_KEY || !ALERT_EMAIL_TO) {
    return false;
  }

  const payload = {
    from: ALERT_EMAIL_FROM,
    to: [ALERT_EMAIL_TO],
    subject: 'Security alert — Ministerio Maná',
    text: summary,
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('[security-alert] Resend API error:', response.status, body);
    return false;
  }

  return true;
}

async function sendWebhook(summary) {
  if (!ALERT_WEBHOOK) return false;
  const response = await fetch(ALERT_WEBHOOK, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: summary }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error('[security-alert] Webhook error:', response.status, body);
    return false;
  }
  return true;
}

async function main() {
  try {
    const thresholds = parseThresholds();
    const events = await fetchEvents();
    if (events.length === 0) {
      console.log('[security-alert] No security events recorded in the selected window.');
      return;
    }

    const counts = groupCounts(events);
    const triggered = filterTriggered(counts, thresholds);
    if (triggered.length === 0) {
      console.log('[security-alert] Events found but below thresholds:', counts);
      return;
    }

    const summary = buildSummary(triggered, events);
    let delivered = false;

    if (await sendEmail(summary)) {
      console.log('[security-alert] Email notification sent.');
      delivered = true;
    }

    if (await sendWebhook(summary)) {
      console.log('[security-alert] Webhook notification sent.');
      delivered = true;
    }

    if (!delivered) {
      console.warn('[security-alert] Alerts triggered but no delivery endpoint configured.');
      console.log(summary);
    }
  } catch (error) {
    console.error('[security-alert] Fatal error:', error.message);
    process.exit(1);
  }
}

main();
