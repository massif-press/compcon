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
import ClickOutside from './directives/click-outside'
import ScrollSpy, { Easing } from 'vue2-scrollspy'
import * as items from './mixins/data'

const windowAny: any = window

if (process.env.NODE_ENV !== 'development') {
  windowAny.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

Vue.prototype.userDataPath = path.normalize(
  path.join(remote.app.getPath('userData'), 'data')
)
Vue.prototype.version = '1.3.7'

Vue.use(Vuetify, {
  iconfont: 'mdi',
})
Vue.use(VueMousetrap)
Vue.use(ScrollSpy, {
  easing: Easing.Cubic.In,
})

Vue.directive('click-outside', ClickOutside)

const mixins = items as any
for (const m in mixins) {
  if (mixins.hasOwnProperty(m)) {
    Vue.mixin(mixins[m])
  }
}

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')

// router.replace('/pilot_management')
