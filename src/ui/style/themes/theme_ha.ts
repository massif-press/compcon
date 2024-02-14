import themeDefaults from './common'

const theme = {
  type: 'dark',
  id: 'ha',
  name: 'Harrison Armory Ras Shamra (Community)',
  colors: {
    ...themeDefaults,

    //Main-Colors
    primary: '#771675',
    secondary: '#cf4bdb',
    active: '#a15ea8',
    accent: '#e080de',
    background: '#2b2b2b',

    //signal colors
    error: '#F44336',
    info: '#1565C0',
    success: '#00C853',
    warning: '#FFAB00',

    //misc
    pilot: '#b035ad',
    exotic: '#FFAB00',
    'action--downtime': '#1dc2c2',
    'reserve--organization': '#3ec2c2',
    'action--reaction': '#be51ed',

    weapon: '#555555',
    'mech-weapon': '#555555',
    'pilot-weapon': '#555555',

    //typography
    text: '#fff',
    subtle: '#b3b9ba',
    stark: '#fff',
    anti: '#000',
    'light-text': '#96a0a0', //fluff text
    'stark-text': '#fff',

    //UI-Boxes and elements
    'v-card': "#373737",
    'v-expansion-panel': "#373737",
    'v-data-table': "#373737",
    
    panel: '#333',
    tooltip: '#222',
    'light-panel': '#444',
    'dark-panel': '#111',
    'panel-border': '#666',
    'stark-panel': '#222',
  },
}
export default theme
