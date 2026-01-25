import { sanitizePlainText } from './validation';

const CITY_ALIASES: Record<string, string> = {
  cali: 'Cali',
  medellin: 'Medellin',
  bogota: 'Bogota',
  barranquilla: 'Barranquilla',
  bucaramanga: 'Bucaramanga',
  cartagena: 'Cartagena',
  pereira: 'Pereira',
  manizales: 'Manizales',
  ibague: 'Ibague',
  pasto: 'Pasto',
  armenia: 'Armenia',
  monteria: 'Monteria',
  cucuta: 'Cucuta',
  neiva: 'Neiva',
  villavicencio: 'Villavicencio',
  santa marta: 'Santa Marta',
  sincelejo: 'Sincelejo',
  tunja: 'Tunja',
  riohacha: 'Riohacha',
  valledupar: 'Valledupar',
};

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(' ')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ''))
    .join(' ')
    .trim();
}

function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizeCityName(value: string | null | undefined): string {
  const cleaned = sanitizePlainText(value ?? '', 80);
  if (!cleaned) return '';
  const normalized = stripAccents(cleaned).replace(/\s+/g, ' ').trim().toLowerCase();
  if (!normalized) return '';
  const alias = CITY_ALIASES[normalized] ?? normalized;
  return titleCase(alias);
}

export function normalizeChurchName(value: string | null | undefined): string {
  const cleaned = sanitizePlainText(value ?? '', 120);
  if (!cleaned) return '';
  return cleaned.replace(/\s+/g, ' ').trim();
}
