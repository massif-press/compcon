import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { kebabCase } from 'lodash-es'
import * as globals from '@/ui/globals'
import VueSecureHTML from 'vue-html-secure'
import { i18n } from '@/i18n'

config.global.plugins = [createVuetify({ components, directives }), i18n, VueSecureHTML]
config.global.components = Object.fromEntries(
  Object.keys(globals).map(key => [
    kebabCase(key),
    (globals[key as keyof typeof globals] as any).default ?? globals[key as keyof typeof globals],
  ])
)
