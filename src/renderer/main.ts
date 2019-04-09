import '@mdi/font/css/materialdesignicons.css'
import 'typeface-roboto/index.css'
import 'material-icons/iconfont/material-icons.css'

import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import { remote } from 'electron'
import path from 'path'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'

import ClickOutside from './directives/click-outside'

const windowAny: any = window

if (process.env.NODE_ENV !== 'development') {
  windowAny.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

Vue.use(Vuetify, {
  iconfont: 'mdi',
})

Vue.directive('click-outside', ClickOutside)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')

Vue.prototype.userDataPath = path.join(remote.app.getPath('userData'), 'data')

router.replace('/roster')
