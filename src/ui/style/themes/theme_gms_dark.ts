import themeDefaults from './common'

const theme = {
  type: 'dark',
  id: 'gmsdark',
  name: 'GMS Red (Dark)',
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

    weapon: '#e2e2e2',
    'mech-weapon': '#e2e2e2',
    'pilot-weapon': '#e2e2e2',

    text: '#c1c1c1',
    subtle: '#c1c1c1',
    stark: '#991E2A',
    anti: '#fff',
    'light-text': '#b5b5b5',
    'stark-text': '#991E2A',

    background: '#151515',
    panel: '#151515',
    tooltip: '#151515',
    'light-panel': '#575757',
    'dark-panel': '#151515',
    'panel-border': '#310000',
    'stark-panel': '#151515',

    'action--downtime': '#37474F',
    'reserve--organization': '#455A64',
    'action--reaction': '#512DA8',
  },
}
export default theme
