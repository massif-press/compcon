import themeDefaults from './common'

const theme = {
  type: 'light',
  id: 'gms',
  name: 'GMS Red (Default)',
  colors: {
    ...themeDefaults,
    primary: '#991E2A',
    exotic: '#673AB7',
    active: '#d93f4e',
    accent: '#8c1420',
    secondary: '#283593',
    pilot: '#424242',
    error: '#F44336',
    info: '#1565C0',
    success: '#00C853',
    warning: '#FFAB00',

    weapon: '#212121',
    'mech-weapon': '#212121',
    'pilot-weapon': '#212121',

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
    'action--reaction': '#512DA8',
  },
}
export default theme
