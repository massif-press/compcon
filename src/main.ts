import { version } from '../package.json';
import lancerData from 'lancer-data';
import _ from 'lodash';
import { createApp } from 'vue';

import './assets/css/global.css';
import './ui/style/_style.css';

import App from './App.vue';

import { store } from './store';
import router from './router';
import vuetify from './ui/style';
import * as globals from './ui/globals';

import { getModule } from './util/storeUtils';
import VueSecureHTML from 'vue-html-secure';

const compcon = createApp(App);

compcon.use(store);
compcon.use(vuetify);
compcon.use(router);
compcon.use(VueSecureHTML);

// Install the component with Vue, using its appropriate name and configuration.
// This will add it as a globally available component for use within templates.
Object.keys(globals).forEach((key: string) => {
  const componentConfig = globals[key as keyof typeof globals];
  compcon.component(
    _.kebabCase(key),
    componentConfig.default || componentConfig
  );
});

compcon.config.globalProperties.$appVersion = version;
compcon.config.globalProperties.$lancerVersion = lancerData.info.version;
compcon.config.globalProperties.getModule = getModule;

compcon.mount('#app');
