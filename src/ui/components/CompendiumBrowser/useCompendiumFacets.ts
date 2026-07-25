import { computed, ref, watch, type Ref } from 'vue'
import * as _ from 'lodash-es'
import ItemFilter from '@/classes/utility/ItemFilter'
import { i18n } from '@/i18n'
import type { CompendiumItem } from '@/classes/CompendiumItem'
import type License from '@/classes/pilot/components/license/License'

const mfOrder = ['gms', 'ips-n', 'ssc', 'horus', 'ha']

const fallbackGroups: Record<string, string> = {
  __exotic: 'pm.selectors.exotic',
  __integrated: 'pm.loadout.integratedEquipment',
  __other: 'ui.widget.other',
}

const fallbackGroup = (x: any): string =>
  x.IsExotic ? '__exotic' : x.IsIntegrated ? '__integrated' : '__other'

export const sourceGroup = (x: any): string => x.Source || fallbackGroup(x)

export const licenseGroup = (x: any): string => x.License || fallbackGroup(x)

export const isFallbackGroup = (key: string): boolean => key in fallbackGroups

export const groupLabel = (key: string): string =>
  fallbackGroups[key] ? i18n.global.t(fallbackGroups[key]) : key

const withFallbackTail = (keys: string[], sort: (a: string, b: string) => number): string[] => {
  const tail = Object.keys(fallbackGroups).filter((k) => keys.includes(k))
  return keys.filter((k) => !isFallbackGroup(k)).sort(sort).concat(tail)
}

const ManufacturerSort = (mArr: any[]) =>
  mArr.sort((a, b) => {
    const indexA = mfOrder.indexOf(a.Source?.toLowerCase() || '')
    const indexB = mfOrder.indexOf(b.Source?.toLowerCase() || '')
    if (indexA !== -1 && indexB !== -1) return indexA - indexB
    else if (indexA !== -1) return -1
    else if (indexB !== -1) return 1
    else return (a.Source?.toLowerCase() || '').localeCompare(b.Source?.toLowerCase() || '')
  })

const sortFn = (a: any, b: any): number => {
  if (!a) return 1
  if (!b) return -1
  return a.localeCompare(b)
}

const manufacturerSortFn = (a: string, b: string): number => {
  if (!a) return 1
  if (!b) return -1
  const indexA = mfOrder.indexOf(a.toLowerCase())
  const indexB = mfOrder.indexOf(b.toLowerCase())
  if (indexA !== -1 && indexB !== -1) return indexA - indexB
  else if (indexA !== -1) return -1
  else if (indexB !== -1) return 1
  else return a.toLowerCase().localeCompare(b.toLowerCase())
}

export interface CompendiumFacetsInput {
  items: () => CompendiumItem[]
  itemType: () => string
  showExotics: () => boolean
  search: Ref<string>
  lcpFilter: Ref<string[]>
  otherFilter: Ref<Record<string, any>>
  group: Ref<string>
  open: Ref<string[]>
}

export function useCompendiumFacets(input: CompendiumFacetsInput) {
  const { items, itemType, showExotics, search, lcpFilter, otherFilter, group, open } = input

  const itemsByLcp = computed(() => _.groupBy(items() as CompendiumItem[], 'LcpName'))
  const shownItems = computed(() => {
    let shown = items() as CompendiumItem[]
    shown = shown.filter((i: any) => lcpFilter.value.includes(i.LcpName))
    if (search.value) shown = shown.filter((i: any) => i.Name.toLowerCase().includes(search.value.toLowerCase()))
    if (Object.keys(otherFilter.value).length) shown = ItemFilter.Filter(shown, otherFilter.value)
    if (!showExotics()) shown = shown.filter((i: CompendiumItem) => !i.IsExotic)
    if (shown.some((x: any) => x.Source)) shown = ManufacturerSort(shown)
    return shown
  })
  const filteredItemsByLcp = computed(() => _.groupBy(shownItems.value, 'LcpName'))
  const itemsByType = computed(() => _.groupBy(shownItems.value, (x: any) => x.Type))
  const itemsBySourceGroup = computed(() => _.groupBy(shownItems.value, sourceGroup))
  const itemsByLicenseGroup = computed(() => _.groupBy(shownItems.value, licenseGroup))
  const itemsByRoleGroup = computed(() => _.groupBy(shownItems.value, (x: any) => x.Role))
  const itemsByFeatureTypeGroup = computed(() => _.groupBy(shownItems.value, (x: any) => x.FeatureType))
  const itemsByOriginGroup = computed(() => _.groupBy(shownItems.value, (x: any) => x.Origin?.Name))

  function _groupLcpItems(lcpItems: any[]): Record<string, any[]> {
    if (itemType() === 'NpcClass') return _.groupBy(lcpItems.filter((x: any) => x.Role), (x: any) => x.Role)
    if (itemType() === 'NpcFeature') return _.groupBy(lcpItems, (x: any) => x.Origin?.Name)
    return _.groupBy(lcpItems, sourceGroup)
  }

  const _lcpGroupCache = ref(new Map<string, Record<string, any[]>>())

  watch(filteredItemsByLcp, (newFiltered) => {
    const cache = new Map<string, Record<string, any[]>>()
    for (const lcp of open.value) {
      if (newFiltered[lcp]) cache.set(lcp, _groupLcpItems(newFiltered[lcp]))
    }
    _lcpGroupCache.value = cache
  })

  watch(
    open,
    (newOpen) => {
      const cachedLcps = new Set(_lcpGroupCache.value.keys())
      const openSet = new Set(newOpen)
      const added = newOpen.filter((lcp) => !cachedLcps.has(lcp) && !!filteredItemsByLcp.value[lcp])
      const removed = [...cachedLcps].filter((lcp) => !openSet.has(lcp))
      if (!added.length && !removed.length) return
      const cache = new Map(_lcpGroupCache.value)
      for (const lcp of removed) cache.delete(lcp)
      for (const lcp of added) cache.set(lcp, _groupLcpItems(filteredItemsByLcp.value[lcp]))
      _lcpGroupCache.value = cache
    },
    { immediate: true }
  )

  const itemsByLcpGrouped = computed(() => Object.fromEntries(_lcpGroupCache.value))
  const groupsByLcp = computed(() => {
    const isMfg = itemType() !== 'NpcClass' && itemType() !== 'NpcFeature'
    const sortGroups = isMfg ? manufacturerSortFn : sortFn
    const m: Record<string, string[]> = {}
    for (const [lcp, groups] of _lcpGroupCache.value)
      m[lcp] = withFallbackTail(Object.keys(groups).filter(Boolean), sortGroups)
    return m
  })
  const manufacturerSources = computed(() =>
    withFallbackTail(_.uniq(shownItems.value.map(sourceGroup)), manufacturerSortFn)
  )
  const roles = computed(() => _.uniq(shownItems.value.map((x: any) => x.Role)).sort(sortFn))
  const featureTypes = computed(() => _.uniq(shownItems.value.map((x: any) => x.FeatureType)).sort(sortFn))
  const origins = computed(() => _.uniq(shownItems.value.map((x: any) => x.Origin?.Name).filter(Boolean)).sort(sortFn))
  const lcps = computed(() => Object.keys(itemsByLcp.value).sort(sortFn))
  const filteredLcps = computed(() => Object.keys(filteredItemsByLcp.value).sort(sortFn))
  const licenses = computed(() => withFallbackTail(_.uniq(shownItems.value.map(licenseGroup)), sortFn))
  const subtypes = computed(() => _.uniq(shownItems.value.map((x: any) => x.Type)).sort(sortFn))
  const navOrderedItems = computed((): any[] => {
    switch (group.value) {
      case 'source':
        return manufacturerSources.value.flatMap((m: string) => itemsBySourceGroup.value[m] || [])
      case 'role':
        return roles.value.flatMap((r: string) => itemsByRoleGroup.value[r] || [])
      case 'featureType':
        return featureTypes.value.flatMap((f: string) => itemsByFeatureTypeGroup.value[f] || [])
      case 'origin':
        return origins.value.flatMap((o: string) => itemsByOriginGroup.value[o] || [])
      case 'license':
        return licenses.value.flatMap((l: string) => itemsByLicenseGroup.value[l] || [])
      case 'type':
        return subtypes.value.flatMap((s: string) => itemsByType.value[s] || [])
      case 'lcp':
        return filteredLcps.value.flatMap((lcp: string) => filteredItemsByLcp.value[lcp] || [])
      default:
        return shownItems.value
    }
  })

  function getItems(manufacturer: string, lcp?: string): CompendiumItem[] | License[] {
    if (lcp) return itemsByLcp.value[lcp].filter((i: any) => i.Source === manufacturer)
    return shownItems.value.filter((i: any) => i.Source === manufacturer)
  }

  return {
    itemsByLcp,
    shownItems,
    filteredItemsByLcp,
    itemsByType,
    itemsBySourceGroup,
    itemsByLicenseGroup,
    itemsByRoleGroup,
    itemsByFeatureTypeGroup,
    itemsByOriginGroup,
    itemsByLcpGrouped,
    groupsByLcp,
    manufacturerSources,
    roles,
    featureTypes,
    origins,
    lcps,
    filteredLcps,
    licenses,
    subtypes,
    navOrderedItems,
    getItems,
  }
}
