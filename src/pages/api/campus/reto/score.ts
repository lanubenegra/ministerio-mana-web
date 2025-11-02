import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) {
    return new Response(JSON.stringify({ rows: [] }), { headers: { 'content-type':'application/json' } });
  }
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  monday.setDate(today.getDate() + diff);
  const weekStart = monday.toISOString().slice(0,10);

  const res = await fetch(`${url}/rest/v1/campus_reto?select=campus,sum:amount&week_start=eq.${weekStart}&group=campus`, {
    headers: { apikey:key, Authorization:`Bearer ${key}` }
  });
  const rows = await res.json();
  return new Response(JSON.stringify({ rows, weekStart }), { headers: { 'content-type':'application/json' } });
};
