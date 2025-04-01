import themeDefaults from './common';

const theme = {
  dark: false,
  id: 'gms',
  name: 'GMS Light',
  community: false,
  colors: {
    ...themeDefaults,

    primary: '#991E2A',
    active: '#d93f4e',
    accent: '#8c1420',
    secondary: '#1E998D',
    tertiary: '#212d40',
    highlight: '#c9cba3',

    error: '#F44336',
    info: '#1565C0',
    success: '#68991E',
    warning: '#C28200',

    pilot: '#424242',
    exotic: '#673AB7',

    weapon: '#212121',
    'mech-weapon': '#212121',
    'pilot-weapon': '#212121',

    'core-bonus': '#991E2A',

    text: '#212121',
    subtle: '#9E9E9E',
    stark: '#000',
    anti: '#fff',
    'light-text': '#424242',
    'stark-text': '#000',

    background: '#f4f4f4',
    panel: '#ccc',
    tooltip: '#e8e8e8',

    'light-panel': '#dbdbdb',
    'dark-panel': '#d6d6d6',
    'panel-border': '#8a949e',
    'stark-panel': '#EDEDED',

    'action--downtime': '#37474F',
    'reserve--organization': '#455A64',
    'reserve--bonus': '#455A64',
    'action--reaction': '#512DA8',

    // tooltips
    surface: '#e8e8e8',
    'surface-variant': '#dbdbdb',
    'on-surface-variant': '#212121',
  },
};
export default theme;
