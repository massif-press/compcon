export default {
  methods: {
    getColor(): string {
      if (this.color.substring(0, 1) === '#') return this.color
      return this.$vuetify.theme.currentTheme[this.color]
    },
  },
}
