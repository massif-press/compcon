import themeDefaults from './common'

const theme = {
  type: 'dark',
  id: 'msmc',
  name: 'MSMC Solarized',
  colors: {
    ...themeDefaults,
    primary: '#146464',
    active: '#218a8a',
    accent: '#1dc2c2',
    secondary: '#d98f30',
    pilot: '#000',
    error: '#F44336',
    info: '#569BEA',
    success: '#00C853',
    warning: '#FFAB00',

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
    'light-panel': '#2e3e45',
    'panel-border': '#8a949e',
    'stark-panel': '#131b1f',

    'action--downtime': '#1dc2c2',
    'reserve--organization': '#3ec2c2',
    'action--reaction': '#be51ed',
  },
}
export default theme
