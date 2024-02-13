import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/e2e.test.ts'],
    pool: 'forks'
  }
});
