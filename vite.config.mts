import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { VitePWA } from 'vite-plugin-pwa'
import PurgeCSS from 'vite-plugin-purgecss'
import pkg from './package.json' with { type: 'json' }

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
      registerType: 'prompt',
      manifest: {
        name: 'COMP/CON',
        short_name: 'COMP/CON',
        description: 'Digital tools for the LANCER TTRPG',
        theme_color: '#991E2A',
        background_color: '#991E2A',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'any',
        categories: ['games', 'utilities'],
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
          {
            src: '/icons/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 8 * 1024 ** 2,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
              },
            },
          },
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 day
              },
            },
          },
        ],
      },
    }),
    vue(),
    {
      name: 'strip-legacy-fonts',
      generateBundle(_options, bundle) {
        for (const key of Object.keys(bundle)) {
          if (/materialdesignicons.*\.(eot|ttf|woff)$/.test(key)) {
            delete bundle[key]
          }
        }
      },
    },
    PurgeCSS({
      content: ['./index.html', './src/**/*.{vue,ts}'],
      safelist: {
        deep: [/^v-/, /^vuetify/, /^col-/, /^ql-/],
        greedy: [/data-v-/],
      },
      defaultExtractor: content => content.match(/[\w-/:[\].]+(?<!:)/g) || [],
    }),
    sentryVitePlugin({
      org: 'massif-press',
      project: 'compcon',
    }),
  ],
  build: {
    target: 'esnext',
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vuetify')) return 'vuetify'
          if (id.includes('node_modules/@massif/lancer-data')) return 'lancer-data'
          if (id.includes('node_modules/aws-amplify') || id.includes('node_modules/@aws-amplify')) return 'aws'
          if (id.includes('node_modules/@sentry')) return 'sentry'
          if (id.includes('node_modules/quill') || id.includes('node_modules/@vueup')) return 'editor'
          if (id.includes('node_modules/')) return 'vendor'
        },
      },
    },
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
    APP_VERSION: JSON.stringify(pkg.version),
  },
})
