type GeoResult = {
  lat: number;
  lng: number;
  city?: string;
  countryCode?: string;
};

function normalizeCityName(name: string | undefined | null): string | undefined {
  if (!name) return undefined;
  const clean = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  if (!clean) return undefined;
  // Capitaliza primera letra de cada palabra
  return clean
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function geocodeCityCountry(city?: string, country?: string): Promise<GeoResult | null> {
  const q = [city, country].filter(Boolean).join(', ');
  if (!q) return null;
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('accept-language', 'es,en');
    url.searchParams.set('limit', '1');
    url.searchParams.set('q', q);

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': process.env.NOMINATIM_USER_AGENT || 'ministeriomana.org/evangeliza' as any },
    } as any);
    const data = await res.json();
    if (!Array.isArray(data) || !data[0]) return null;

    const item = data[0];
    const addr = item.address || {};
    const cityName =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      addr.state ||
      addr.municipality ||
      undefined;
    const cityNormalized = normalizeCityName(cityName);
    const countryCode = typeof addr.country_code === 'string' ? addr.country_code.toUpperCase() : undefined;

    return {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      city: cityNormalized,
      countryCode,
    };
  } catch (e) {
    console.warn('[geocode] fallo geocodificando', e);
  }
  return null;
}
