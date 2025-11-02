
export const LOCALES = ['es','en'] as const;
export type Locale = typeof LOCALES[number];
export const messages: Record<Locale, Record<string,string>> = {
  es: {
    nav_home: 'Inicio',
    nav_ministry: 'Ministerio',
    nav_campus: 'Campus Maná',
    nav_school: 'Escuela Bíblica',
    nav_churches: 'Iglesias',
    nav_events: 'Eventos',
    nav_devotional: 'Devocional',
    nav_women: 'Mujeres',
    nav_pilgrims: 'Peregrinaciones',
    nav_donate: 'Donar',
    donate: 'Donar',
    see_more: 'Ver más'
  },
  en: {
    nav_home: 'Home',
    nav_ministry: 'Ministry',
    nav_campus: 'Campus Maná',
    nav_school: 'Bible School',
    nav_churches: 'Churches',
    nav_events: 'Events',
    nav_devotional: 'Devotional',
    nav_women: 'Women',
    nav_pilgrims: 'Pilgrimages',
    nav_donate: 'Donate',
    donate: 'Donate',
    see_more: 'See more'
  }
};
export function t(locale: Locale, key: string, fallback?: string) {
  return messages[locale]?.[key] ?? fallback ?? key;
}
