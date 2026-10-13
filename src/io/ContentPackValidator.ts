import { CompendiumStore } from '@/features/compendium/store'
import { DamageType, RangeType } from '@/classes/enums'
import type { IContentPackData, PackIssue } from '@/classes/ContentPack'

const DAMAGE_TYPES = new Set(Object.values(DamageType).map(x => x.toLowerCase()))
const RANGE_TYPES = new Set<string>(Object.values(RangeType))
const SOURCED = ['frames', 'weapons', 'systems', 'mods']

const ids = (items: any): string[] =>
  Array.isArray(items) ? items.map(x => x?.id ?? x?.ID).filter(Boolean) : []

function collectIssues(
  errors: PackIssue[],
  data: IContentPackData,
  others: IContentPackData[] = []
): PackIssue[] {
  const store = CompendiumStore()
  const all = [data, ...others]
  const tags = new Set([...ids(store.TagData), ...all.flatMap(x => ids(x.tags))])
  const sources = new Set([...ids(store.Manufacturers), ...all.flatMap(x => ids(x.manufacturers))])
  const skipped = new Set(errors.map(x => `${x.collection}/${x.item}`))
  const out = [...errors]

  for (const [collection, items] of Object.entries(data)) {
    if (!Array.isArray(items)) continue
    items.forEach((x: any, i: number) => {
      if (!x || typeof x !== 'object') return
      const item = [x.name, x.id].find(v => typeof v === 'string' && v) ?? `#${i}`
      if (skipped.has(`${collection}/${item}`)) return
      const warn = (issue: Pick<PackIssue, 'code' | 'field' | 'detail'>) =>
        out.push({ severity: 'warning', collection, item, ...issue })
      const unknown = (field: string, value: unknown) =>
        warn({ code: 'unknownValue', field, detail: String(value) })

      if (Array.isArray(x.tags))
        for (const t of x.tags) if (!tags.has(t?.id)) unknown('tags', t?.id ?? t)

      if (SOURCED.includes(collection) && x.source) {
        const source = typeof x.source === 'string' ? x.source.toUpperCase() : ''
        if (source !== 'EXOTIC' && !sources.has(source)) unknown('source', x.source)
      }

      if (collection !== 'weapons') return
      if (!x.mount) warn({ code: 'invalidField', field: 'mount' })
      if (!x.type) warn({ code: 'invalidField', field: 'type' })
      for (const p of [x, ...(Array.isArray(x.profiles) ? x.profiles : [])]) {
        if (Array.isArray(p?.damage))
          for (const d of p.damage)
            if (!DAMAGE_TYPES.has(String(d?.type).toLowerCase())) unknown('damage', d?.type)
        if (Array.isArray(p?.range))
          for (const r of p.range) if (!RANGE_TYPES.has(r?.type)) unknown('range', r?.type)
      }
    })
  }
  return out
}

export { collectIssues }
