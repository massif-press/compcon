<template>
  <cc-compendium-browser :items="availableItems"
    item-type="Equipment"
    :options="options"
    view-key="sel-equipment"
    equippable
    @equip="$emit('select', $event)">
    <template #header>
      <div class="heading h4 text-center text-primary">
        {{ $t('common.add') }}
        <span v-if="exotic">{{ $t('pm.selectors.exotic') }}</span>
        {{ $t('pm.selectors.equipment') }}
      </div>
    </template>
  </cc-compendium-browser>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CompendiumStore } from '@/stores'
import { CompendiumItem } from '@/classes/CompendiumItem'

const props = withDefaults(defineProps<{
  pilot: Record<string, any>
  exotic?: boolean
}>(), { exotic: false })

defineEmits<{ select: [item: any] }>()

const headers = [
  { title: 'Manufacturer', align: 'left', key: 'Source' },
  { title: 'Weapon', align: 'left', key: 'Name' },
  { title: 'License', align: 'left', key: 'LicenseString' },
  { title: 'Size', align: 'left', key: 'SizeInt' },
  { title: 'Type', align: 'left', key: 'WeaponTypes' },
  { title: 'Range', align: 'left', key: 'Range' },
  { title: 'Damage', align: 'left', key: 'Damage' },
]

const options = computed(() => ({
  views: ['single', 'table', 'cards'],
  initialView: 'single',
  groups: props.exotic ? ['none', 'lcp'] : ['lcp'],
  initialGroup: props.exotic ? 'none' : 'lcp',
  showExotics: props.exotic,
}))

const allEquipment = computed(() => {
  if (!props.pilot.LcpConfig) return CompendiumStore().allEquipment
  const packIDs = new Set(props.pilot.LcpConfig.packList.map((y: any) => y.packID))
  const packNames = new Set(props.pilot.LcpConfig.packList.map((y: any) => y.packName))
  return CompendiumStore().allEquipment.filter(
    (x: any) => !x.InLcp || packIDs.has(x.Brew?.LcpId) || packNames.has(x.Brew.LcpName)
  )
})

const availableItems = computed<CompendiumItem[]>(() => {
  if (props.exotic)
    return (allEquipment.value.filter((x: any) => x.IsExotic) as CompendiumItem[]).concat(
      CompendiumStore().PilotGear.filter((x: any) => x.IsExotic) as CompendiumItem[]
    )
  const licensedIDs = new Set(props.pilot.LicenseController.LicensedItems.map((y: any) => y.ID))
  return allEquipment.value.filter((x: any) => !licensedIDs.has(x.ID))
})
</script>
