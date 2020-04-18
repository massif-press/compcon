import { Vue, Component } from 'vue-property-decorator'
import { Framework } from 'vuetify'

@Component
export default class GetColorMixin extends Vue {
  color!: string

  getColor(color?: string, vuetifyRef?: Framework): string {
    color = color ?? this.color
    if (vuetifyRef === undefined) vuetifyRef = this.$vuetify
    if (color?.substring(0, 1) === '#') return color
    if (!vuetifyRef.theme.currentTheme[color]) return 'primary'
    return vuetifyRef.theme.currentTheme[color].toString()
  }
}
