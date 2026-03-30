import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    solidPlugin(),
    tailwindcss(),
  ],
  worker: {
    format: 'es',
  },
  build: {
    target: 'esnext',
  },
  server: {
    port: 5173,
  },
});
