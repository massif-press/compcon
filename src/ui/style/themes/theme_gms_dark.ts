import themeDefaults from './common';

const theme = {
  dark: true,
  id: 'gms_dark',
  name: 'GMS Dark',
  community: false,
  colors: {
    ...themeDefaults,

    primary: '#802932',
    active: '#d93f4e',
    accent: '#dd5562',
    secondary: '#225560',
    tertiary: '#99941e',
    highlight: '#E4E5D1',

    error: '#E84855',
    info: '#0072BB',
    success: '#78C091',
    warning: '#f3de2c',

    pilot: '#424242',
    exotic: '#673AB7',

    weapon: '#212121',
    'mech-weapon': '#212121',
    'pilot-weapon': '#212121',

    'core-bonus': '#991E2A',

    text: '#c9cba3',
    subtle: '#9E9E9E',
    stark: '#fff',
    anti: '#000',
    'light-text': '#9E9E9E',
    'stark-text': '#fff',

    background: '#11151c',
    panel: '#212d40',
    tooltip: '#161C27',

    'light-panel': '#364156',
    'dark-panel': '#212121',
    'panel-border': '#364156',
    'stark-panel': '#225560',

    'action--downtime': '#37474F',
    'reserve--organization': '#455A64',
    'reserve--bonus': '#455A64',
    'action--reaction': '#512DA8',

    surface: '#161C27',
    'surface-variant': '#212121',
    'on-surface-variant': '#c9cba3',
  },
};
export default theme;
