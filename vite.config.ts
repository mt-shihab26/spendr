import { defineConfig } from 'vite';
import { resolve } from 'path';

import inertia from '@inertiajs/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    resolve: {
        alias: {
            'ziggy-js': resolve('vendor/tightenco/ziggy'),
        },
    },
    plugins: [
        laravel({
            refresh: true,
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
        }),
        inertia(),
        react(),
        tailwindcss(),
    ],
});
