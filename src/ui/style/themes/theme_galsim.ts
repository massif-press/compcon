import themeDefaults from './common';

const theme = {
  dark: true,
  id: 'galsim',
  name: 'FORECAST/GALSIM',
  community: true,
  colors: {
    ...themeDefaults,
    //Main-Colors
    primary: '#e36600',
    secondary: '#7ABFE1',
    active: '#2a416b',
    accent: '#4974bf',
    background: '#2b2b2b',

    //signal colors
    error: '#F44336',
    info: '#1565C0',
    success: '#10a14c',
    warning: '#e89f0c',

    //misc
    pilot: '#3e6a94',
    exotic: '#FFAB00',
    'action--downtime': '#1dc2c2',
    'action--reaction': '#823aa1',

    weapon: '#555555',
    'mech-weapon': '#555555',
    'pilot-weapon': '#555555',

    //typography
    text: '#fff',
    subtle: '#b3b9ba',
    stark: '#fff',
    anti: '#000',
    'light-text': '#96a0a0',
    'stark-text': '#fff',

    //UI-Boxes and elements
    'v-card': '#373737',
    'v-expansion-panel': '#373737',
    'v-data-table': '#373737',
    surface: '#373737',
    'surface-variant': '#222',

    panel: '#2D2C29',
    tooltip: '#222',
    'light-panel': '#444',
    'dark-panel': '#111',
    'panel-border': '#666',
    'stark-panel': '#222',
    'on-surface-variant': '#96a0a0',
  },
};
export default theme;
