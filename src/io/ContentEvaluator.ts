import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, store } from '@/store'

const ItemsMissingLcp = (items: any[]): any[] => {
  const activePackIds = getModule(CompendiumStore, store)
    .ContentPacks.filter(x => x.Active)
    .map(x => x.ID)

  return items.filter(item => {
    if (!item.brews || !item.brews.length) return false
    return item.brews.some(brew => !activePackIds.includes(brew.LcpId))
  })
}

const ItemsWithLcp = (items: any[]): any[] => {
  const activePackIds = getModule(CompendiumStore, store)
    .ContentPacks.filter(x => x.Active)
    .map(x => x.ID)

  return items.filter(item => {
    if (!item.brews || !item.brews.length) return true
    return item.brews.some(brew => activePackIds.includes(brew.LcpId))
  })
}

const MissingItemIds = (): string[] => {
  const m = getModule(CompendiumStore, store).MissingContent
  let out = []
  for (const key in m) {
    out = [...out, ...m[key].map(i => i.id)]
  }
  return out
}

export { ItemsMissingLcp, ItemsWithLcp, MissingItemIds }
