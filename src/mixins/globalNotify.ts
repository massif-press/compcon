import { getModule } from 'vuex-module-decorators'
import { Global } from '@/store'

export default {
  methods: {
    notify(settings: ISnackbarSettings): void {
      const g = getModule(Global, this.$store)
      g.openSnackbar(settings)
    },
  },
}
