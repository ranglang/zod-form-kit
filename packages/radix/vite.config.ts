/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'zod-radix-adapter',
      fileName: (format) => `zod-radix-adapter.${format}.js`
    },
    rollupOptions: {
      external: [
        'react', 
        'react-dom', 
        'zod',
        'zod-form-kit',
        '@radix-ui/themes',
        '@radix-ui/react-label',
        '@radix-ui/react-slot',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-select',
        '@radix-ui/react-switch',
        '@radix-ui/react-slider',
        'class-variance-authority',
        'clsx',
        'tailwind-merge'
      ],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'zod': 'z',
          'zod-form-kit': 'ZodFormKit'
        }
      }
    }
  }
}); 