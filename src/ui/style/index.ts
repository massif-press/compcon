import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { ccIcons } from '@/assets/icons/cc-icons';
// import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

import * as themes from './themes';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'gms',
    variations: {
      colors: [
        'primary',
        'secondary',
        'accent',
        'error',
        'warning',
        'info',
        'success',
      ],
      lighten: 5,
      darken: 5,
    },
    themes,
  },
  icons: {
    defaultSet: 'mdi',
    // aliases,
    sets: {
      cc: ccIcons,
      // mdi,
    },
  },
});

console.log(ccIcons);
console.log(vuetify);

export default vuetify;
