import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $appVersion: string
    $lancerVersion: string
    $notify: (text: string, type?: string, onClick?: () => void) => void
  }
}
