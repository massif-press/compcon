export const useMobile = {
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown
    },
    portrait(): boolean {
      return this.$vuetify.display.xs
    },
  },
}
