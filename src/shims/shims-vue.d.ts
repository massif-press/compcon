import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $platform: string
    lancerVersion: string
    $notify: (text: string, type?: string, onClick?: () => void) => void
  }

}