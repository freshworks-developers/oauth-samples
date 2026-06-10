import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage/unit',
      reporter: ['json', 'text'],
      include: ['server/**/*.js', 'app/utils/**/*.js']
    },
    environmentMatchGlobs: [
      ['tests/server*.js', 'node'],
      ['tests/**/*.test.js', 'jsdom']
    ]
  }
});
