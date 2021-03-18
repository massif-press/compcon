<template>
  <div>
    <cc-selector-table
      :items="availableItems"
      :headers="headers"
      no-filter
      sp-ignore
      equipment-add
      @equip="$emit('select', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { CompendiumItem } from '@/classes/CompendiumItem'

export default Vue.extend({
  name: 'equipment-selector',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    items: [],
    headers: [
      { text: '', align: 'left', value: 'Info' },
      { text: 'Type', align: 'left', value: 'ItemType' },
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'Equipment', align: 'left', value: 'Name' },
      { text: '', align: 'center', value: 'Add' },
    ],
  }),
  computed: {
    availableItems(): CompendiumItem[] {
      const pilotLicensedItems = this.pilot.SpecialEquipment.map(x => x.ID)

      return _.sortBy(
        this.items.filter(x => !pilotLicensedItems.some(y => y === x.ID)),
        ['Name']
      )
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    const items = (compendium.MechWeapons.filter(x => x.IsExotic) as CompendiumItem[])
      .concat(compendium.WeaponMods.filter(x => x.IsExotic) as CompendiumItem[])
      .concat(compendium.MechSystems.filter(x => x.IsExotic) as CompendiumItem[])
      .concat(compendium.Frames.filter(x => x.IsExotic) as CompendiumItem[])
      .concat(compendium.PilotGear.filter(x => x.IsExotic) as CompendiumItem[])

    this.items = items.filter(x => !x.IsHidden)
  },
})
</script>
