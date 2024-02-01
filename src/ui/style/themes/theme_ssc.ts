import themeDefaults from './common'

const theme = {
  type: 'light',
  id: 'ssc',
  name: 'SSC Constellar Congress',
  colors: {
    ...themeDefaults,
    primary: '#e4b821',
    active: '#75C7F4',
    accent: '#3E40B1',
    secondary: '#d98f30',
    pilot: '#061a1f',
    error: '#F44336',
    info: '#569BEA',
    success: '#00C853',
    warning: '#FFAB00',
    exotic: '#FFAB00',

    weapon: '#555555',
    'mech-weapon': '#555555',
    'pilot-weapon': '#555555',

    text: '#dbdbdb',
    subtle: '#b3b9ba',
    stark: '#fff',
    anti: '#000',
    'light-text': '#96a0a0',
    'stark-text': '#fff',

    background: '#263237',
    panel: '#293940',
    tooltip: '#121d21',
    'light-panel': '#2e3e45',
    'dark-panel': '#1b2529',
    'panel-border': '#8a949e',
    'stark-panel': '#131b1f',

    'action--downtime': '#1f9c9c',
    'reserve--organization': '#3ec2c2',
    'action--reaction': '#be51ed',
  },
}
export default theme
