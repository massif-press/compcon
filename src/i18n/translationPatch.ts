import semver from 'semver'
import { LocalizationStore } from '@/stores/localization'
import { SetItem, RemoveItem } from '@/io/Storage'
import { i18n } from './index'
import { setContentLocale } from './loadContent'
import { validatePatch, type LanguagePatch } from './validatePatch'

export type { LanguagePatch }

export async function installPatch(raw: unknown): Promise<LanguagePatch> {
  const res = validatePatch(raw)
  if (!res.ok) throw new Error(res.error)
  const { patch } = res

  const store = LocalizationStore()
  await store.ensurePatchesLoaded()
  await SetItem('translations', patch)
  store.patches = [...store.patches.filter(p => p.id !== patch.id), patch]

  if (patch.lang === i18n.global.locale.value) store.mergeCatalog(patch.data)
  return patch
}

// Installed patches whose `target` matches any of a pack's identifiers (id / item_prefix / name).
// Reactive when read inside a computed. Call ensurePatchesLoaded() first.
export function packPatches(idents: Array<string | undefined>): LanguagePatch[] {
  const set = new Set(idents.filter((x): x is string => !!x))
  return LocalizationStore().patches.filter(p => set.has(p.target))
}

// True when the patch declares a target_version range the installed pack version no longer satisfies
// (i.e. the translation was written against a different version and may have drifted). Advisory only.
export function patchIsStale(patch: LanguagePatch, packVersion?: string): boolean {
  if (!patch.target_version || !packVersion) return false
  const v = semver.coerce(packVersion)
  if (!v) return false
  try {
    return !semver.satisfies(v, patch.target_version)
  } catch {
    return false
  }
}

export async function removePatch(id: string): Promise<void> {
  const store = LocalizationStore()
  await store.ensurePatchesLoaded()
  await RemoveItem('translations', id)
  store.patches = store.patches.filter(p => p.id !== id)
  await setContentLocale(String(i18n.global.locale.value))
}
