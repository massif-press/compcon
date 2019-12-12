const WebpackPwaManifest = require('webpack-pwa-manifest');
const { GenerateSW } = require('workbox-webpack-plugin');
const InjectPlugin = require('webpack-inject-plugin').default;
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin([
      { from: 'static', to: 'static' },
      { from: 'public/config', to: '.' }
    ]),
    new WebpackPwaManifest({
      name: 'COMP/CON',
      short_name: 'C/C',
      start_url: '/index.html',
      scope: '.',
      description: 'Digital toolkit for the LANCER RPG',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      display: 'fullscreen',
      orientation: 'any',
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      icons: [
        {
          src: path.resolve('icons/256x256.png'),
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
        }
      ]
    }),
    new GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/index.html',
      // these two files aren't accessible by clients so including them in the precache manifest makes it fail to register
      // (i think)
      exclude: ['_redirects', '_headers']
    }),
    // inject code to register service worker we just generated, but only in prod
    new InjectPlugin(() => fs.readFileSync(
      path.resolve(__dirname, 'public/register_sw.js')
    )),
    new FaviconsWebpackPlugin({
      logo: './icons/256x256.png', // svg works too!
      favicons: {
        appName: 'COMP/CON',
        appDescription: 'A digital toolset for the LANCER TTRPG',
        background: '#fff',
        theme_color: '#fff',
        appleStatusBarStyle: "black",
      }
    })
  ]
}