import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/e2e.test.ts'],
    pool: 'forks'
  }
});
