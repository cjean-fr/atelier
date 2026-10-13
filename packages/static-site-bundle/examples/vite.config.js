import { defineConfig } from 'vite';
import Symfony from '@symfony/reprise/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    input: { app: './assets/app.js' },
    plugins: [
        Symfony({ outputPath: 'public/build', publicPath: '/build/' }),
        tailwindcss(),
    ],
});
