
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ejemplo-ministeriomana.org',
  integrations: [tailwind({ config: { applyBaseStyles: true } }), sitemap()],
  experimental: { clientPrerender: true },
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@data': '/src/data',
        '@i18n': '/src/i18n'
      }
    }
  }
});
