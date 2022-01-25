import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $appVersion: string
    $lancerVersion: string
    $notify: (text: string, type?: string, onClick?: () => void) => void
  }
}

declare module 'tiptap-vuetify'
declare module 'promisify-file-reader'
declare module 'lancer-data'
declare module 'file-saver'
declare module 'uuid/v4'