import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import { remote } from 'electron'
import path from 'path'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'


const windowAny: any = window

if (process.env.NODE_ENV !== 'development') {
  windowAny.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

Vue.use(Vuetify, {
  iconfont: 'mdi',
})

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')

Vue.prototype.userDataPath = path.join(remote.app.getPath('userData'), 'data')
Vue.prototype.lancerVersionNumber = '1.8.5'

router.replace('/roster')
