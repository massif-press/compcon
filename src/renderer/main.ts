import '@mdi/font/css/materialdesignicons.css'
import axios from 'axios'
import Vue from 'vue'

import { remote } from 'electron'
import path from 'path'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

declare global {
    interface Window {
        __static: any
    }
}

if (process.env.NODE_ENV !== 'development') {
    window.__static = require('path')
        .join(__dirname, '/static')
        .replace(/\\/g, '\\\\')
}

Vue.use(Vuetify, {
    iconfont: 'mdi',
})

if (!process.env.IS_WEB) {
    Vue.use(require('vue-electron'))
}
// Vue.http = Vue.prototype.$http = axios;
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.directive('click-outside', {
    bind(el: any, binding: any, vnode: any) {
        el.clickOutsideEvent = (event: Event) => {
            if (!(el === event.target || el.contains(event.target))) {
                vnode.context[binding.expression](event)
            }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unbind(el: any) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    },
})

/* eslint-disable no-new */
new Vue({
    components: {
        App,
    },
    router,
    store,
    template: '<App/>',
}).$mount('#app')

Vue.prototype.userDataPath = path.join(remote.app.getPath('userData'), 'data')
Vue.prototype.lancerVersionNumber = '1.8.5'

router.replace('/roster')
