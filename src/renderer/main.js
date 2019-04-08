import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import { remote } from 'electron'
import path from 'path'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'

if (process.env.NODE_ENV !== 'development') {
  window.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

Vue.use(Vuetify, {
  iconfont: 'mdi'
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

Vue.prototype.userDataPath = path.join(remote.app.getPath('userData'), 'data')
Vue.prototype.lancerVersionNumber = '1.8.5'

router.replace('/roster')
