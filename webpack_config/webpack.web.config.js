const { GenerateSW } = require('workbox-webpack-plugin')
const { IgnorePlugin } = require('webpack');
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
  },
  plugins: [
    new GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/index.html',
      exclude: ['netlify.toml', /\.map$/, /\.(png|jpg|jpeg|svg)$/i],
      runtimeCaching: [
        {
          urlPattern: /(^https:\/\/.*)?\.(png|jpg|jpeg|svg)(#.*)?$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /(^https:\/\/.*)?\.(woff|woff2|ttf|otf|eot|)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts',
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    }),
    new IgnorePlugin(/^(fs|electron)$/)
  ]
}