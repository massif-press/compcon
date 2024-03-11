import themeDefaults from './common'

const theme = {
  type: 'light',
  id: 'ssc',
  name: 'SSC Constellar Congress (Community)',
  colors: {
    ...themeDefaults,
    
    //Main-Colors
    primary: '#d1920a',
    secondary: '#685d99',
    active: '#89610B',
    accent: '#b58900',
    background: '#eee8d5',

    //signal colors
    error: '#cc472d',
    info: '#4276b3',
    success: '#107038',
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
    text: '#5e4b30',
    subtle: '#736e91',
    stark: '#000',
    anti: '#fff',
    'light-text': '#8c6f46', //flavor text
    'stark-text': '#000',

    //UI-Boxes and elements
    'v-card': "#c7b5a3",
    'v-expansion-panel': "#dbcfc3",
    'v-data-table': "#dbcfc3",
    
    panel: '#eadbcb',
    tooltip: '#d6c9b0',
    'light-panel': '#eadbcb',
    'dark-panel': '#c7b5a3',
    'panel-border': '#8a949e',
    'stark-panel': '#5a4c3f',
   
  },
}
export default theme
