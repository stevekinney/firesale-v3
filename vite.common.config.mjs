import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@lib': resolve(__dirname, './src/lib'),
      '@styles': resolve(__dirname, './src/renderer/styles'),
      '@components': resolve(__dirname, './src/renderer/components'),
    },
  },
});
