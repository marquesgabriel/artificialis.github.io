import { readFileSync } from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Optional: Match CRA default
    open: true,
  },
  envPrefix: 'REACT_APP_',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: 'build', // CRA's default build output
  },
  test: {
    // Jest-like globals
    globals: true,
    // Environment
    environment: 'jsdom',
    // Include below if you want code coverage
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
      include: [
        "src/**/*.{ts,tsx}",
        "!src/index.tsx",
        "!src/reportWebVitals.ts",
        "!src/utils/supabase.ts",
        "!src/**/*.d.ts"
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      },
    },
    setupFiles: './src/setupTests.ts',
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
});