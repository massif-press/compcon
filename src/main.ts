import '@mdi/font/css/materialdesignicons.css'
import 'typeface-roboto/index.css'
import 'material-icons/iconfont/material-icons.css'
import './assets/css/global.css'
import './ui/style/_style.css'
import './assets/glyphs/glyphs.css'
import './ui/globals'

import Vue from 'vue'

import App from './App.vue'
import router from './router'
import { store } from './store'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify/lib'
import VueMousetrap from 'vue-mousetrap'
import lancerData from 'lancer-data'
import VueResizeText from 'vue-resize-text'

import './registerServiceWorker'

import theme from './ui/theme'

import mixins from './mixins'

import externalLinkDirective from './mixins/externalLinkDirective'

import _ from 'lodash'
import Startup from './io/Startup'

import { Capacitor } from '@capacitor/core'

import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'

Object.defineProperty(Vue.prototype, '$_', { value: _ })
Object.defineProperty(Vue.prototype, '$platform', { value: Capacitor.platform })

Vue.prototype.$appVersion = process.env.VERSION_STRING
Vue.prototype.$lancerVersion = `${lancerData.info.version}`

const vuetify = new Vuetify(theme)

Vue.use(Vuetify)
Vue.use(VueMousetrap)
Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: 'md',
})
Vue.use(VueResizeText)

Vue.config.devtools = process.env.NODE_ENV === 'development'

mixins.forEach(m => {
  Vue.mixin(m)
})

Vue.directive('extlink', externalLinkDirective)

Vue.config.errorHandler = (error, vm) => Vue.prototype.$notifyError(error, vm)
window.onerror = error => Vue.prototype.$notifyError(error)

new Vue({
  components: { App },
  vuetify,
  router,
  store,
  created() {
    Startup(Vue.prototype.$appVersion, Vue.prototype.$lancerVersion, store)
  },
  render: h => h(App),
}).$mount('#app')
