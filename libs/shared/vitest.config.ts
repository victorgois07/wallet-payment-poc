import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: resolve(import.meta.dirname ?? process.cwd(), '.'),
    include: ['src/**/*.{spec,test}.ts'],
  },
});
