import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import { remote } from 'electron'
import path from 'path'
import Icon from 'vue-awesome/components/Icon'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

Vue.component('b-icon', Icon)
Vue.prototype.userDataPath = path.join(remote.app.getPath('userData'), 'data')
Vue.prototype.versionNumber = '0.2.1'
