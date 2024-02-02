import themeDefaults from './common'

const theme = {
  type: 'light',
  id: 'ssc',
  name: 'SSC Constellar Congress',
  colors: {
    ...themeDefaults,
    
    primary: '#d1920a',
    active: '#89610B',
    accent: '#948054',
    secondary: '#685d99',
    pilot: '#061a1f',
    error: '#cc472d',
    info: '#4276b3',
    success: '#107038',
    warning: '#FFAB00',
    exotic: '#FFAB00',

    weapon: '#212121',
    'mech-weapon': '#212121',
    'pilot-weapon': '#212121',

    //typography
    headers:"#33332f",
    text: '#5e4b30',
    subtle: '#736e91',
    stark: '#000',
    anti: '#fff',
    'light-text': '#8c6f46', //flavor text
    'stark-text': '#000',

    'v-card': "#c7b5a3",
    'v-expansion-panel': "#dbcfc3",
    'v-data-table': "#dbcfc3",
    'search-field': "#dbcfc3",
    
    background: '#e3ceb9',
    panel: '#eadbcb',
    tooltip: '#d6c9b0',
    'light-panel': '#eadbcb',
    'dark-panel': '#c7b5a3',
    'panel-border': '#8a949e',
    'stark-panel': '#5a4c3f',

    'action--downtime': '#1f9c9c',
    'reserve--organization': '#3ec2c2',
    'action--reaction': '#823aa1',
  },
}
export default theme
