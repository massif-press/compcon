<template>
  <component :is="componentLoader"
    v-if="componentLoader"
    ref="c"
    :active-filters="activeFilters"
    v-bind="filterData"
    @set-filters="$emit('set-filters', $event)" />
  <v-card v-else
    variant="outlined">
    <v-card-text class="text center">
      <i>No filters available</i>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as _ from 'lodash-es'
import { useCompendiumData } from '@/ui/providers'
import logger from '@/user/logger'
import * as filters from './'

interface Props {
  itemType: string
  activeFilters?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), {
  activeFilters: () => ({}),
})

const emit = defineEmits<{ 'set-filters': [filters: Record<string, unknown>] }>()

const compendium = useCompendiumData()

const c = ref<{ clear: () => void } | null>(null)

const componentLoader = computed(() => {
  if (!props.itemType) {
    logger.error('No item type provided to CCItemFilter')
    return null
  }
  const f = `${props.itemType.replace(' ', '')}Filter`
  if (!filters[f as keyof typeof filters]) {
    logger.error(`No filter found for item type ${props.itemType}`)
    return null
  }
  return filters[f as keyof typeof filters]
})

const filterData = computed(() => {
  const store = compendium
  const nameSort = (a: { title: string }, b: { title: string }) =>
    a.title.toUpperCase() < b.title.toUpperCase() ? -1 : a.title.toUpperCase() > b.title.toUpperCase() ? 1 : 0

  const manufacturers = store.getItemCollection('Manufacturers')
    .map((x: any) => ({ title: x.Name, value: x.ID }))
    .sort(nameSort)

  const frameLcpNames = (_.uniq(store.Frames.map((x: any) => x.LcpName)) as string[]).filter(Boolean)

  switch (props.itemType.replace(' ', '')) {
    case 'Frame':
      return {
        manufacturers,
        frameSizes: _.uniq(store.getItemCollection('Frames').map((x: any) => x.Size).sort())
          .map((y: any) => ({ title: `Size ${y}`, value: y })),
        frameLicenses: _.uniq(
          store.getItemCollection('Frames')
            .filter((x: any) => !x.Variant)
            .map((x: any) => x.License)
            .filter(Boolean)
        ).map((y: any) => ({ title: y, value: y })),
      }
    case 'MechWeapon':
      return {
        manufacturers,
        weaponTags: _.uniqBy(
          (store.getItemCollection('MechWeapons') as any[])
            .flatMap((x: any) => x.Tags)
            .filter((x: any) => !x.FilterIgnore && !x.IsHidden),
          'ID'
        ),
        lcpNames: frameLcpNames,
      }
    case 'License':
      return { manufacturers, lcpNames: frameLcpNames }
    case 'MechSystem':
      return {
        systemTags: _.uniqBy(
          (store.getItemCollection('MechSystems') as any[])
            .flatMap((x: any) => x.Tags)
            .filter((x: any) => !x.FilterIgnore && !x.IsHidden),
          'ID'
        ),
      }
    case 'NpcClass':
      return {
        roles: _.uniqBy(store.NpcClasses, 'Role')
          .map((x: any) => x.Role)
          .sort((a: string, b: string) => a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0),
      }
    case 'NpcFeature':
      return {
        origins: _.uniqBy(store.NpcFeatures, 'Origin')
          .map((x: any) => ({ title: x.Origin.Name, value: x.Origin.ID })),
        featureTypes: _.uniqBy(store.NpcFeatures, 'FeatureType')
          .map((x: any) => x.FeatureType)
          .sort((a: string, b: string) => a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0),
      }
    case 'CoreBonus':
      return { manufacturers, lcpNames: frameLcpNames }
    case 'PilotGear':
      return {
        gearTags: _.uniqBy(
          (store.getItemCollection('PilotGear') as any[])
            .flatMap((x: any) => x.Tags)
            .filter((x: any) => !x.FilterIgnore && !x.IsHidden),
          'ID'
        ),
      }
    case 'WeaponMod':
      return {
        manufacturers,
        modTags: _.uniqBy(
          (store.getItemCollection('WeaponMods') as any[])
            .flatMap((x: any) => x.Tags)
            .filter((x: any) => !x.FilterIgnore && !x.IsHidden),
          'ID'
        ),
        lcpNames: frameLcpNames,
      }
    default:
      return {}
  }
})

function clear() {
  c.value?.clear()
}

defineExpose({ clear })
</script>
