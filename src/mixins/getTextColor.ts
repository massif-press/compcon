export default {
  methods: {
    getTextColor(): string {
      const c = this.color || 'primary'
      let color = c.substring(0, 1) === '#' ? c : this.$vuetify.theme.currentTheme[c]

      if (this.color.substring(0, 1) === '#') this.color
      this.$vuetify.theme.currentTheme[this.color]

      color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))

      const r = color >> 16
      const g = (color >> 8) & 255
      const b = color & 255

      const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

      if (hsp > 127.5) {
        return 'text'
      } else {
        return 'white'
      }
    },
  },
}
