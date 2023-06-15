import { version } from '../package.json';
import lancerData from '@massif/lancer-data';
import _ from 'lodash';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './assets/css/global.css';
import './ui/style/_style.css';

import App from './App.vue';

import router from './router';
import vuetify from './ui/style';
import * as globals from './ui/globals';
import Notifications from '@kyvg/vue3-notification';

import VueSecureHTML from 'vue-html-secure';

import Startup from './io/Startup';

const compcon = createApp(App);

compcon.use(createPinia());
compcon.use(vuetify);
compcon.use(router);
compcon.use(VueSecureHTML);
compcon.use(Notifications);

Object.keys(globals).forEach((key: string) => {
  const componentConfig = globals[key as keyof typeof globals];
  compcon.component(_.kebabCase(key), componentConfig.default || componentConfig);
});

compcon.config.globalProperties.$appVersion = version;
compcon.config.globalProperties.$lancerVersion = lancerData.info.version;

compcon.mount('#app');

await Startup();
