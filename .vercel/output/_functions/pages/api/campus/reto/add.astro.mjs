export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const body = await request.json();
  const { campus, amount, code } = body || {};
  const mapJson = process.env.RETOS_CAMPUS_CODES || "{}";
  let ok = false;
  try {
    const mapping = JSON.parse(mapJson);
    ok = mapping && mapping[campus] && mapping[campus] === code;
  } catch {
  }
  if (!ok) return new Response(JSON.stringify({ ok: false, error: "Código inválido" }), { status: 401 });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) return new Response(JSON.stringify({ ok: true, simulated: true }), { status: 200 });
  const week = /* @__PURE__ */ new Date();
  const monday = new Date(week);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(week.getDate() + diff);
  const weekStart = monday.toISOString().slice(0, 10);
  const res = await fetch(`${url}/rest/v1/campus_reto`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ campus, amount: amount || 1, week_start: weekStart })
  });
  if (!res.ok) return new Response(JSON.stringify({ ok: false }), { status: 500 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
