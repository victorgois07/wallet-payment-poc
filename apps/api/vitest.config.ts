import { resolve } from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: resolve(import.meta.dirname ?? process.cwd(), '.'),
    environment: 'node',
    include: ['src/**/*.{spec,test}.ts', 'test/**/*.{spec,test}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.{spec,test}.ts', 'src/main.ts'],
    },
  },
  resolve: {
    alias: {
      '@wallet/shared': resolve(__dirname, '../../libs/shared/src/index.ts'),
      zod: resolve(__dirname, '../../node_modules/zod/index.js'),
    },
  },
  plugins: [swc.vite()],
});
