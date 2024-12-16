import { defineConfig } from 'vite';
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
                target: 'http://localhost:3000', // Redirige vers le port 3000
                changeOrigin: true,
            },
        },
    },
});
