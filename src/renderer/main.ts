import '@mdi/font/css/materialdesignicons.css'
import 'typeface-roboto/index.css'
import 'material-icons/iconfont/material-icons.css'
import './assets/css/global.css'
import './assets/css/typography.css'

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

const windowAny: any = window

if (process.env.NODE_ENV !== 'development') {
  windowAny.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

Vue.use(Vuetify, {
  iconfont: 'mdi',
})
Vue.use(VueMousetrap)


Vue.directive('click-outside', ClickOutside)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')

Vue.prototype.userDataPath = path.join(remote.app.getPath('userData'), 'data')
Vue.prototype.version = '1.2.4'

router.replace('/roster')
