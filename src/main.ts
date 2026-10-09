import { version } from '../package.json'

import { QuillEditor, loadQuill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import { registerHorusText } from '@/ui/style/horusText'

import { register } from '@/ui/style/quillSetup'
void loadQuill().then(Quill => {
  registerHorusText(Quill)
  register(Quill)
})

import lancerData from '@massif/lancer-data'
import { kebabCase } from 'lodash-es'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import logger from '@/user/logger'

import './assets/css/global.css'
import './ui/style/_style.css'

import App from './App.vue'

import router from './router'
import { i18n } from './i18n'
import { enumLabel } from './i18n/enumLabel'
import vuetify from './ui/style'
import * as globals from './ui/globals'
import Notifications from '@kyvg/vue3-notification'
import { flushNotifyQueue } from '@/util/notify'

import Startup from './io/Startup'
import { reportWebVitals } from '@/util/performance'

import { Amplify } from 'aws-amplify'
import VueSecureHTML from 'vue-html-secure' // provides v-html-safe

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

compcon.use(createPinia())
compcon.use(i18n)
compcon.use(vuetify)
compcon.use(router)
compcon.use(VueSecureHTML)
compcon.use(Notifications)

logger.attachGlobalHandlers(compcon)

compcon.component('QuillEditor', QuillEditor)

Object.keys(globals).forEach((key: string) => {
  const componentConfig = globals[key as keyof typeof globals]
  compcon.component(kebabCase(key), componentConfig.default || componentConfig)
})

compcon.config.globalProperties.$appVersion = version
compcon.config.globalProperties.$lancerVersion = lancerData.info.version
compcon.config.globalProperties.$enum = enumLabel

// Enable Vue component-level timing in DevTools (dev only)
if (import.meta.env.DEV) {
  compcon.config.performance = true
}

compcon.mount('#app')
reportWebVitals()
flushNotifyQueue()
await Startup()

export { compcon }
