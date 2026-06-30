/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite/client" />

import 'vue'
import type { Composer, VueI18n } from 'vue-i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $lancerVersion: string
    $appVersion: string
    $enum: (kind: string, value?: string | null) => string
    $vuetify: Framework
    $notify: Notify
    $router: Router
    $route: Route

    // vue-i18n globals (injected via createI18n({ globalInjection: true }))
    $t: Composer['t']
    $rt: Composer['rt']
    $tc: Composer['t']
    $te: Composer['te']
    $tm: Composer['tm']
    $d: Composer['d']
    $n: Composer['n']
    $i18n: Composer | VueI18n
  }
}

declare const $lancerVersion: string

declare const APP_VERSION: string
