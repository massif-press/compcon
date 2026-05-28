import { useDisplay } from 'vuetify'

export function useMobile() {
  const { smAndDown: mobile, xs: portrait } = useDisplay()
  return { mobile, portrait }
}
