import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://heartbit.be',
  output: 'static',
  trailingSlash: 'always',
});
