const getColor = (color, vuetifyRef) => {
  color = color || 'primary'
  if (color?.substring(0, 1) === '#') return color
  if (!vuetifyRef.theme.currentTheme[color]) return 'primary'
  return vuetifyRef.theme.currentTheme[color].toString()
}

export default getColor
