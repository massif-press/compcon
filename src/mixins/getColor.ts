import { Vue, Component } from "vue-property-decorator";
import { Framework } from 'vuetify';

@Component
export default class GetColorMixin extends Vue {
  color!: string

  getColor(color?: string, vuetifyRef?: Framework): string {
    if (color === undefined) 
      color = this.color
    if (vuetifyRef === undefined)
      vuetifyRef = this.$vuetify
    if (color.substring(0, 1) === '#') return color
    return vuetifyRef.theme.currentTheme[color].toString()
  }
}
