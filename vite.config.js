import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';

import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  root: 'src/frontend',
  base: '/',
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: process.env.API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});