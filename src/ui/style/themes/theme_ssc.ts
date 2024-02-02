import themeDefaults from './common'

const theme = {
  type: 'light',
  id: 'ssc',
  name: 'SSC Constellar Congress',
  colors: {
    ...themeDefaults,
    //'theme--dark':"#11ffff",
    //'theme--light':"#11ffff",
    'v-card':"#c7b5a3",
    
    //blub:"#ff0111",
    primary: '#d1920a',
    active: '#89610B',
    accent: '#948054',
    secondary: '#685d99',
    pilot: '#061a1f',
    error: '#cc472d',
    info: '#4276b3',
    success: '#079141',
    warning: '#FFAB00',
    exotic: '#FFAB00',

    weapon: '#555555',
    'mech-weapon': '#555555',
    'pilot-weapon': '#555555',

    //typography
    headers:"#33332f",
    text: '#5e4b30',
    subtle: '#736e91',
    stark: '#000',
    anti: '#fff',
    'light-text': '#8c6f46', //flavor text
    'stark-text': '#000',

    background: '#e3ceb9',
    panel: '#eadbcb',
    tooltip: '#7d7268',
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
