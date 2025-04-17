import themeDefaults from './common';

const theme = {
  id: 'ipsn',
  name: 'IPS-N Carina',
  community: true,
  colors: {
    ...themeDefaults,

    //Main-Colors
    primary: '#1952A2',
    secondary: '#c77634',
    active: '#1976D2',
    accent: '#19A2A2',
    background: '#dbdbdb',

    //signal colors
    error: '#F44336',
    info: '#1565C0',
    success: '#00C853',
    warning: '#FFAB00',

    //misc
    pilot: '#061a1f',
    exotic: '#FFAB00',
    'action--downtime': '#1f9c9c',
    'action--reaction': '#823aa1',

    weapon: '#212121',
    'mech-weapon': '#212121',
    'pilot-weapon': '#212121',

    //typography
    text: '#212121',
    subtle: '#5c5c5c',
    stark: '#000',
    anti: '#fff',
    'light-text': '#424242', //flavor text
    'stark-text': '#000',

    //UI-Boxes and elements
    'v-card': '#c9c7c7',
    'v-expansion-panel': '#c9c7c7',
    'v-data-table': '#c9c7c7',
    surface: '#c9c7c7',
    'surface-variant': '#424242',

    panel: '#ABB2B7',
    tooltip: '#e8e8e8',
    'light-panel': '#dbdbdb',
    'dark-panel': '#d6d6d6',
    'panel-border': '#8a949e',
    'stark-panel': '#EDEDED',
    'on-surface-variant': '#ABB2B7',
  },
};
export default theme;
