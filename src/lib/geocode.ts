export async function geocodeCityCountry(city?: string, country?: string) {
  const q = [city, country].filter(Boolean).join(', ');
  if (!q) return null;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, {
      headers: { 'User-Agent': process.env.NOMINATIM_USER_AGENT || 'ministeriomana.org/evangeliza' as any }
    } as any);
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {}
  return null;
}
