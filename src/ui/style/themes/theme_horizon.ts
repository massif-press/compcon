import themeDefaults from './common';

const theme = {
  dark: true,
  id: 'horizon',
  name: 'HORIZON Terminal',
  colors: {
    ...themeDefaults,
    primary: '#233943',
    active: '#ff9b00',
    accent: '#fc8901',
    secondary: '#32ba89',
    tertiary: '#99941e',
    highlight: '#E4E5D1',

    error: '#e54c29',
    info: '#7EBDC2',
    success: '#00C853',
    warning: '#ffca0d',

    pilot: '#424242',
    exotic: '#9A275A',

    weapon: '#555555',
    'mech-weapon': '#555555',
    'pilot-weapon': '#555555',

    text: '#fff',
    subtle: '#b3b9ba',
    stark: '#fff',
    anti: '#000',
    'light-text': '#96a0a0',
    'stark-text': '#fff',

    background: '#040F11',
    panel: '#333',
    tooltip: '#222',
    'light-panel': '#2b2b2b',
    'dark-panel': '#111',
    'panel-border': '#666',
    'stark-panel': '#222',

    'action--downtime': '#1dc2c2',
    'reserve--organization': '#3ec2c2',
    'reserve--bonus': '#455A64',
    'action--reaction': '#441151',

    // tooltips
    'surface-variant': '#040F11',
    'on-surface-variant': '#96a0a0',
  },
};
export default theme;
