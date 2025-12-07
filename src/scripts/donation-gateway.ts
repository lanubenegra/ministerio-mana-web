interface DonationConfig {
  rates: Record<string, number>;
  locales: Record<string, string>;
}

const SELECTOR_SECTION = '[data-donation-config]';
const INPUT_SELECTOR = '[data-usd-input]';
const CONVERSION_SELECTOR = '[data-conversion]';

function parseConfig(node: Element): DonationConfig | null {
  const raw = node.getAttribute('data-donation-config');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DonationConfig;
  } catch (error) {
    console.warn('[donation-gateway] invalid config JSON', error);
    return null;
  }
}

function formatCurrency(value: number, currency: string, locale: string | undefined): string {
  try {
    return new Intl.NumberFormat(locale || 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'USD' ? 2 : 0,
    }).format(value);
  } catch (error) {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function updateConversions(section: Element, config: DonationConfig) {
  const input = section.querySelector<HTMLInputElement>(INPUT_SELECTOR);
  if (!input) return;

  const amount = Number.parseFloat(input.value) || 0;
  const conversions = section.querySelectorAll<HTMLElement>(CONVERSION_SELECTOR);
  conversions.forEach((node) => {
    const currency = node.dataset.currency;
    if (!currency) return;
    const rate = config.rates[currency];
    if (!rate) return;
    const value = currency === 'USD' ? amount : amount * rate;
    node.textContent = formatCurrency(value, currency, config.locales[currency]);
  });
}

function bootstrap(section: Element) {
  const config = parseConfig(section);
  if (!config) return;

  const input = section.querySelector<HTMLInputElement>(INPUT_SELECTOR);
  if (!input) return;

  const handler = () => updateConversions(section, config);
  input.addEventListener('input', handler);
  handler();
}

function init() {
  document.querySelectorAll(SELECTOR_SECTION).forEach(bootstrap);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
