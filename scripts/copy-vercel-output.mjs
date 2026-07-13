import { cpSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const appOutput = fileURLToPath(new URL('../apps/web/.vercel', import.meta.url));
const rootOutput = fileURLToPath(new URL('../.vercel', import.meta.url));

if (!existsSync(appOutput)) {
  throw new Error(`Expected Astro Vercel output at ${appOutput}`);
}

rmSync(rootOutput, { recursive: true, force: true });
cpSync(appOutput, rootOutput, { recursive: true });
