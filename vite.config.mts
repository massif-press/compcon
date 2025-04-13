import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true,
    },
  },
  plugins: [
    VitePWA({
      disable: process.env.NODE_ENV === 'development',
      registerType: 'autoUpdate',
      manifest: {
        name: 'COMP/CON',
        short_name: 'COMP/CON',
        description: 'Digital tools for the LANCER TTRPG',
        theme_color: '#991E2A',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 ** 2,
      },
    }),
    vue(),
  ],
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser',
      },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  define: {
    'process.env.VERSION': JSON.stringify(require('./package.json').version),
  },
});
