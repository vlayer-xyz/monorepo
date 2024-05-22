import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'forks',
    include: ['src/**/*.test.ts'],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/script/**/*.ts', '**/types.ts']
    }
  }
});
