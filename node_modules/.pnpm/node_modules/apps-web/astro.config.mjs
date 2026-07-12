// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [svelte()],
  vite: {
    server: {
      fs: {
        // Allow serving files from the monorepo root node_modules
        allow: ['../..']
      }
    }
  }
});