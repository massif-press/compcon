import '@mdi/font/css/materialdesignicons.css'
import 'typeface-roboto/index.css'
import 'material-icons/iconfont/material-icons.css'
import './assets/css/global.css'
import './assets/css/typography.css'
import './assets/glyphs/glyphs.css'

import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import { remote } from 'electron'
import path from 'path'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'
import VueMousetrap from 'vue-mousetrap'

import gmTheme from './features/gm_toolkit/vuetify_theme'

import ScrollSpy, { Easing } from 'vue2-scrollspy'
import * as items from './mixins/data'
import { getModule } from 'vuex-module-decorators'
import { ModuleStore } from './features/_shared/store'

const windowAny: any = window

windowAny.__static = require('path')
  .join(__dirname, '/static')
  .replace(/\\/g, '\\\\')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

Vue.prototype.userDataPath = path.normalize(path.join(remote.app.getPath('userData'), 'data'))

Vue.prototype.version = '1.5.6'

Vue.use(Vuetify, {
  iconfont: 'mdi',
  icons: {
    move: 'mdi-arrow-right-bold-hexagon-outline',
    quick: 'mdi-hexagon-slice-3',
    full: 'mdi-hexagon-slice-6',
    reaction: 'mdi-redo-variant',
    overcharge: 'mdi-alert-octagram',
    downtime: 'mdi-weather-sunset-down',
    free: 'mdi-axis-arrow',
  },
  theme: {
    ...gmTheme,
  },
})
Vue.use(VueMousetrap)
Vue.use(ScrollSpy, {
  easing: Easing.Cubic.In,
})

const mixins = items as any
for (const m in mixins) {
  if (mixins.hasOwnProperty(m)) {
    Vue.mixin(mixins[m])
  }
}

Vue.config.devtools = process.env.NODE_ENV === 'development'

new Vue({
  components: { App },
  router,
  store,
  render: h => h(App),
  created() {
    const moduleStore = getModule(ModuleStore, this.$store)
    moduleStore.loadData()
    moduleStore.buildLicenses()
    moduleStore.setDatapath(Vue.prototype.userDataPath)
  },
}).$mount('#app')

// router.replace('/pilot_management')
