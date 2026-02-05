import themeDefaults from './common'

const theme = {
  dark: true,
  id: 'msmc',
  name: 'MSMC Solarized',
  community: false,
  colors: {
    ...themeDefaults,
    primary: '#146464',
    active: '#218a8a',
    accent: '#1dc2c2',
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

    background: '#1f282b',
    panel: '#293940',
    tooltip: '#121d21',

    'light-panel': '#222729',
    'dark-panel': '#1b2529',
    'panel-border': '#8a949e',
    'stark-panel': '#131b1f',

    'action--downtime': '#1f9c9c',
    'action--reaction': '#be51ed',

    // tooltips
    'surface-variant': '#131b1f',
    'surface-hover': '#293940',
    'on-surface-variant': '#ffffff',
  },
}
export default theme
