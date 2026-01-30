
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
import clerk from '@clerk/astro';

export default defineConfig({
  site: 'https://www.ejemplo-ministeriomana.org',
  output: 'server',
  adapter: vercel(),
  integrations: [clerk(), tailwind({ config: { applyBaseStyles: true } }), sitemap()],
  experimental: { clientPrerender: true },
  vite: {
    build: {
      assetsInlineLimit: 0
    },
    resolve: {
      alias: {
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@data': '/src/data',
        '@i18n': '/src/i18n',
        '@lib': '/src/lib'
      }
    }
  }
});
