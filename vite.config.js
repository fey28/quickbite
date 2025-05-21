import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    host:true,
  },
  plugins: [
    react(),
    tailwindcss(),
     
     VitePWA({
     registerType: 'autoUpdate',
      includeAssets: [
         'favicon.svg',
         'favicon.ico',
         'robots.txt',
         'apple-touch-icon.png'
      ],
       manifest: {
         name: 'QuickBite',
         short_name: 'QuickBite',
         description: 'Meniu digital pentru restaurante și comenzi rapide',
         start_url: '/',
         display: 'standalone',
         background_color: '#ffffff',
         theme_color: '#f97316',
         icons: [
           {
             src: 'pwa-192x192.png',
             sizes: '192x192',
             type: 'image/png'
         },
           {
             src: 'pwa-512x512.png',
             sizes: '512x512',
             type: 'image/png'
           },
           {
             src: 'apple-touch-icon.png',
             sizes: '180x180',
             type: 'image/png'
           }
         ]
       },
       devOptions: {
         enabled: true
       }
     })
  ]
});
