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
      name: 'ReactZodFormGenerator',
      fileName: (format) => `react-zod-form-generator.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'zod'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          zod: 'z'
        }
      }
    }
  }
});