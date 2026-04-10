<template>
  <cc-compendium-browser :items="availableItems"
    item-type="Equipment"
    :options="options"
    equippable
    @equip="$emit('select', $event)">
    <template #header>
      <div class="heading h4 text-center text-primary">
        Add
        <span v-if="exotic">Exotic</span>
        Equipment
      </div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores'
import { CompendiumItem } from '@/classes/CompendiumItem'

export default {
  name: 'EquipmentSelector',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    exotic: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select'],
  data: () => ({
    headers: [
      { title: 'Manufacturer', align: 'left', key: 'Source' },
      { title: 'Weapon', align: 'left', key: 'Name' },
      { title: 'License', align: 'left', key: 'LicenseString' },
      { title: 'Size', align: 'left', key: 'SizeInt' },
      { title: 'Type', align: 'left', key: 'WeaponTypes' },
      { title: 'Range', align: 'left', key: 'Range' },
      { title: 'Damage', align: 'left', key: 'Damage' },
    ],
  }),
  computed: {
    options() {
      return {
        views: ['single', 'table', 'cards'],
        initialView: 'single',
        groups: ['lcp'],
        initialGroup: 'lcp',
        showExotics: this.exotic,
      }
    },
    allEquipment() {
      if (!this.pilot.LcpConfig) return CompendiumStore().allEquipment
      const packIDs = new Set(this.pilot.LcpConfig.packList.map((y: any) => y.packID))
      const packNames = new Set(this.pilot.LcpConfig.packList.map((y: any) => y.packName))
      return CompendiumStore().allEquipment.filter(
        (x: any) => !x.InLcp || packIDs.has(x.Brew.LcpId) || packNames.has(x.Brew.LcpName)
      )
    },
    availableItems(): CompendiumItem[] {
      if (this.exotic)
        return (this.allEquipment.filter((x: any) => x.IsExotic) as CompendiumItem[]).concat(
          CompendiumStore().PilotGear.filter((x: any) => x.IsExotic) as CompendiumItem[]
        )

      const licensedIDs = new Set(this.pilot.LicenseController.LicensedItems.map((y: any) => y.ID))
      return this.allEquipment.filter((x: any) => !licensedIDs.has(x.ID))
    },
  },
}
</script>
