import themeDefaults from './common'

const theme = {
  type: 'light',
  id: 'ipsn',
  name: 'IPS-N Carina (Community)',
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
    'reserve--organization': '#3ec2c2',
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
    'v-card': "#c9c7c7",
    'v-expansion-panel': "#c9c7c7",
    'v-data-table': "#c9c7c7",
    
    panel: '#ccc',
    tooltip: '#e8e8e8',
    'light-panel': '#dbdbdb',
    'dark-panel': '#d6d6d6',
    'panel-border': '#8a949e',
    'stark-panel': '#EDEDED',
  },
}
export default theme
