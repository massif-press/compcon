import { version } from '../package.json'

import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import '@/ui/style/horusText.js'

import { register } from '@/ui/style/quillSetup'
register(Quill)

import lancerData from '@massif/lancer-data'
import { kebabCase } from 'lodash-es'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import * as Sentry from '@sentry/vue'

import './assets/css/global.css'
import './ui/style/_style.css'
import MasonryWall from '@yeger/vue-masonry-wall'

import App from './App.vue'

import router from './router'
import vuetify from './ui/style'
import * as globals from './ui/globals'
import Notifications from '@kyvg/vue3-notification'
import { flushNotifyQueue } from '@/util/notify'

import VueSecureHTML from 'vue-html-secure'
import Startup from './io/Startup'
import { reportWebVitals } from '@/util/performance'

import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_APP_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID || '',
      identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID || '',
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
})

const compcon = createApp(App)

Sentry.init({
  app: compcon,
  dsn: import.meta.env.VITE_APP_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration({ router }), Sentry.replayIntegration()],
  tracesSampleRate: 0.1, // 10% of transactions
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0, // 100% of error sessions
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION,
  sendDefaultPii: true,
})

compcon.use(createPinia())
compcon.use(vuetify)
compcon.use(router)
compcon.use(VueSecureHTML)
compcon.use(Notifications)
compcon.use(MasonryWall)

compcon.component('QuillEditor', QuillEditor)

Object.keys(globals).forEach((key: string) => {
  const componentConfig = globals[key as keyof typeof globals]
  compcon.component(kebabCase(key), componentConfig.default || componentConfig)
})

compcon.config.globalProperties.$appVersion = version
compcon.config.globalProperties.$lancerVersion = lancerData.info.version

// Enable Vue component-level timing in DevTools (dev only)
if (import.meta.env.DEV) {
  compcon.config.performance = true
}

compcon.mount('#app')
reportWebVitals()
flushNotifyQueue()
await Startup()

export { compcon }
