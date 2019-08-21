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
import store from './store'
import { remote } from 'electron'
import path from 'path'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'
import VueMousetrap from 'vue-mousetrap'

import theme from './ui/theme'

//TODO: remove
import ScrollSpy, { Easing } from 'vue2-scrollspy'

import mixins from './mixins'

import _ from 'lodash';    
Object.defineProperty(Vue.prototype, '$_', { value: _ });

const windowAny: any = window

if (process.env.NODE_ENV !== 'development') {
  windowAny.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

Vue.prototype.userDataPath = path.normalize(path.join(remote.app.getPath('userData'), 'data'))

Vue.prototype.version = '2.0.0'
Vue.prototype.lancerVersion = 'PRERELEASE 2'

Vue.use(Vuetify)
Vue.use(VueMousetrap)
//TODO: remove
Vue.use(ScrollSpy, {
  easing: Easing.Cubic.In,
})

Vue.config.devtools = process.env.NODE_ENV === 'development'

mixins.forEach(m => {
  Vue.mixin(m);
});

new Vue({
  components: { App },
  vuetify: new Vuetify(theme as any),
  router,
  store,
  template: '<App/>',
}).$mount('#app')
