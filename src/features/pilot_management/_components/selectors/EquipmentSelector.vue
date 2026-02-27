<template>
  <cc-compendium-browser
    :items="availableItems"
    item-type="Equipment"
    :options="options"
    equippable
    @equip="$emit('select', $event)"
  >
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
  import * as _ from 'lodash-es'

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
          groups: this.exotic ? ['lcp'] : ['source', 'lcp', 'license'],
          initialGroup: this.exotic ? 'none' : 'lcp',
          showExotics: this.exotic,
        }
      },
      allEquipment() {
        if (!this.pilot.LcpConfig) return CompendiumStore().allEquipment
        return CompendiumStore().allEquipment.filter(
          x =>
            !x.InLcp ||
            this.pilot.LcpConfig?.packList.some(y => y.packID === x.Brew.LcpId) ||
            this.pilot.LcpConfig?.packList.some(y => y.packName === x.Brew.LcpName)
        )
      },
      availableItems(): CompendiumItem[] {
        if (this.exotic)
          return (this.allEquipment.filter(x => x.IsExotic) as CompendiumItem[]).concat(
            CompendiumStore().PilotGear.filter((x: any) => x.IsExotic) as CompendiumItem[]
          )

        return this.allEquipment.filter(
          x => !this.pilot.LicenseController.LicensedItems.some(y => y.ID === x.ID)
        )
      },
    },
  }
</script>
