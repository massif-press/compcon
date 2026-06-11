import { i18n, SUPPORTED_LOCALES, DEFAULT_LOCALE, isSupportedLocale, type LocaleCode } from './index'

const loaded = new Set<string>([DEFAULT_LOCALE])

async function ensureMessages(code: LocaleCode): Promise<void> {
  if (loaded.has(code)) return
  const msgs = await import(`./locales/${code}.json`)
  i18n.global.setLocaleMessage(code, msgs.default)
  loaded.add(code)
}

export async function setUiLocale(code: string): Promise<void> {
  const target: LocaleCode = isSupportedLocale(code) ? code : DEFAULT_LOCALE
  await ensureMessages(target)
  i18n.global.locale.value = target
  document.documentElement.lang = target
  document.documentElement.dir = SUPPORTED_LOCALES.find(l => l.code === target)?.dir ?? 'ltr'
}
