import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { ccIcons } from '@/assets/icons/cc-icons';
import '@mdi/font/css/materialdesignicons.css';

import * as themes from './themes';

const preload = JSON.parse(localStorage.getItem('cc_theme') as string) || 'gms';

const vuetify = createVuetify({
  defaults: {
    VTextField: { density: 'compact', hideDetails: true },
    VSelect: { density: 'compact', hideDetails: true },
    VCombobox: { density: 'compact', hideDetails: true },
    VAutocomplete: { density: 'compact', hideDetails: true },
    VBtn: { rounded: 0 },
  },
  theme: {
    defaultTheme: preload,
    variations: {
      colors: ['primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success'],
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

export default vuetify;
