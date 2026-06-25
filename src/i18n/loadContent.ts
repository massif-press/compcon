import { LocalizationStore } from '@/stores/localization'
import { DEFAULT_LOCALE } from './index'

const modules = import.meta.glob('/content/*/*.json')

export async function setContentLocale(code: string): Promise<void> {
  const store = LocalizationStore()
  if (code === DEFAULT_LOCALE) {
    store.clearCatalog()
    return
  }
  const prefix = `/content/${code}/`
  const paths = Object.keys(modules).filter(p => p.startsWith(prefix))
  const merged: Record<string, string> = {}
  for (const p of paths) {
    const mod = (await modules[p]()) as { default: Record<string, string> }
    Object.assign(merged, mod.default)
  }
  store.setCatalog(merged)
}
