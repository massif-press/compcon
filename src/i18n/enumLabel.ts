import { i18n } from './index'
import { slug } from './contentKeys.mjs'

export function enumLabel(kind: string, value?: string | null): string {
  if (value == null || value === '') return value ?? ''
  const key = `enums.${kind}.${slug(value)}`
  const g = i18n.global as unknown as {
    te: (k: string) => boolean
    t: (k: string) => string
  }
  return g.te(key) ? g.t(key) : value
}
