import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'es', name: 'Español', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'it', name: 'Italiano', dir: 'ltr' },
  { code: 'ru', name: 'Русский', dir: 'ltr' },
  { code: 'ja', name: '日本語', dir: 'ltr' },
  { code: 'ko', name: '한국어', dir: 'ltr' },
  { code: 'zh', name: '中文', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'pt', name: 'Português', dir: 'ltr' },
  { code: 'hi', name: 'हिन्दी', dir: 'ltr' },
] as const

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]['code']

export const DEFAULT_LOCALE: LocaleCode = 'en'

export function isSupportedLocale(code: string): code is LocaleCode {
  return SUPPORTED_LOCALES.some(l => l.code === code)
}

const CLDR_ORDER: Intl.LDMLPluralRule[] = ['zero', 'one', 'two', 'few', 'many', 'other']

const pluralRules = Object.fromEntries(
  SUPPORTED_LOCALES.map(({ code }) => {
    const rules = new Intl.PluralRules(code)
    const categories = CLDR_ORDER.filter(c => rules.resolvedOptions().pluralCategories.includes(c))
    return [
      code,
      (choice: number, choicesLength: number) => {
        const category = rules.select(Math.abs(choice))
        const index =
          choicesLength === categories.length
            ? categories.indexOf(category)
            : Number(category !== 'one')
        return Math.min(index, choicesLength - 1)
      },
    ]
  })
)

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  pluralRules,
  messages: { en } as Record<LocaleCode, typeof en>,
  missingWarn: import.meta.env.DEV,
  fallbackWarn: import.meta.env.DEV,
})
