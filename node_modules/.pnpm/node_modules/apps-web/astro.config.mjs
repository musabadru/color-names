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
    },
    ssr: {
      // Force @libsql/client to be treated as external so Vite doesn't try to
      // bundle its native Node.js binaries. Vercel's Node.js runtime will
      // resolve it from node_modules at execution time.
      external: ['@libsql/client'],
    },
    // Prevent Vite from statically replacing process.env at build time.
    // These must be resolved at RUNTIME on Vercel's serverless Node.js.
    define: {
      'process.env.TURSO_DATABASE_URL': 'process.env.TURSO_DATABASE_URL',
      'process.env.TURSO_AUTH_TOKEN': 'process.env.TURSO_AUTH_TOKEN',
    }
  }
});