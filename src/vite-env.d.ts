/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite/client" />

import 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $lancerVersion: string
    $appVersion: string
    $vuetify: Framework
    $notify: Notify
    $router: Router
    $route: Route
  }
}

declare const $lancerVersion: string

declare const APP_VERSION: string
