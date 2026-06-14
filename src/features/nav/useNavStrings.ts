import { useI18n } from 'vue-i18n'

/**
 * Backwards-compatible accessor for the former `NAV_STRINGS` object, now backed
 * by vue-i18n. `section('settingsPage').theme` resolves `t('nav.settingsPage.theme')`
 * at access time inside the render scope, so it stays reactive to locale changes
 * while leaving existing `alias.key` template usage untouched.
 */
export function useNavStrings() {
  const { t } = useI18n()
  const section = (name: string): Record<string, string> =>
    new Proxy({} as Record<string, string>, {
      get: (_target, key) => {
        if (typeof key !== 'string' || key.startsWith('__v_') || key === 'then') {
          return undefined
        }
        return t(`nav.${name}.${key}`)
      },
    })
  return { t, section }
}
