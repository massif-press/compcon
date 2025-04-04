import themeDefaults from './common';

const theme = {
  dark: true,
  id: 'horus',
  name: 'HORUS Terminal',
  community: false,
  colors: {
    ...themeDefaults,
    primary: '#126127',
    active: '#00a600',
    accent: '#00d900',
    secondary: '#990',
    pilot: '#005454',
    error: '#e50000',
    info: '#00e5e5',
    success: '#00C853',
    warning: '#e5e500',
    exotic: '#FFAB00',

    weapon: '#555555',
    'mech-weapon': '#555555',
    'pilot-weapon': '#555555',

    text: '#fff',
    subtle: '#b3b9ba',
    stark: '#fff',
    anti: '#000',
    'light-text': '#96a0a0',
    'stark-text': '#fff',

    background: '#000',
    panel: '#333',
    tooltip: '#222',
    'light-panel': '#2b2b2b',
    'dark-panel': '#111',
    'panel-border': '#666',
    'stark-panel': '#222',

    'action--downtime': '#1dc2c2',
    'action--reaction': '#be51ed',

    // tooltips
    'surface-variant': '#000',
    'on-surface-variant': '#96a0a0',
  },
};
export default theme;
