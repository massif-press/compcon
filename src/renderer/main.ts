import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import axios from 'axios';

import App from './App.vue';
import router from './router/index';
import store from './store/index';
import {
    remote
} from 'electron';
import path from 'path';
import 'vuetify/dist/vuetify.min.css';
import Vuetify from 'vuetify';

declare global {
    interface Window { __static: any; }
}

if (process.env.NODE_ENV !== 'development') {
    window.__static = require('path')
        .join(__dirname, '/static')
        .replace(/\\/g, '\\\\');
}

Vue.use(Vuetify, {
    iconfont: 'mdi'
});


if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
// Vue.http = Vue.prototype.$http = axios;
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.directive('click-outside', {
    bind: function (el: any, binding, vnode: any) {
        el.clickOutsideEvent = function (event: Event) {
            if (!(el === event.target || el.contains(event.target))) {
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unbind: function (el: any) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
    }
});

/* eslint-disable no-new */
new Vue({
    components: {
        App
    },
    router,
    store,
    template: '<App/>'
}).$mount('#app');

Vue.prototype.userDataPath = path.join(remote.app.getPath('userData'), 'data');
Vue.prototype.lancerVersionNumber = '1.8.5';

router.replace('/roster');