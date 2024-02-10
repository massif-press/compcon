import themeDefaults from './common'

const theme = {
  type: 'dark',
  id: 'galsim',
  name: 'FORECAST/GALSIM (Community)',  
  colors: {
    ...themeDefaults,

    //Main-Colors
    primary: '#e36600',    // Orange
    secondary: '#3e6a94',  // Blue-Grey
    active: '#2a416b',     // Dark Blue
    accent: '#4974bf',     // Medium Blue
    background: '#2b2b2b', // Very Dark Grey

    //signal colors
    error: '#F44336',
    info: '#1565C0',
    success: '#10a14c',
    warning: '#e89f0c',

    //misc
    pilot: '#3e6a94',
    exotic: '#FFAB00',
    'action--downtime': '#1dc2c2',
    'reserve--organization': '#3ec2c2',
    'action--reaction': '#823aa1',

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
