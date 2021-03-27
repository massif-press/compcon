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
import { License, PilotLicense, LicensedItem } from '@/class'

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
      let pilotLicensedItems = this.pilot.Licenses.flatMap((x: PilotLicense) => x.License.UnlocksByTotalRank(x.Rank)).map(x => x.ID)

      pilotLicensedItems = pilotLicensedItems.concat(this.pilot.SpecialEquipment.map(x => x.ID))

      return _.sortBy(
        this.items.filter(x => !pilotLicensedItems.some(y => y === x.ID)),
        ['Source', 'Name']
      )
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    const items = (compendium.MechWeapons.filter(x => x.LicenseLevel > 0) as CompendiumItem[])
      .concat(compendium.WeaponMods.filter(x => x.LicenseLevel > 0) as CompendiumItem[])
      .concat(compendium.MechSystems.filter(x => x.LicenseLevel > 0) as CompendiumItem[])
      .concat(compendium.Frames.filter(x => x.LicenseLevel > 0) as CompendiumItem[])

    this.items = items.filter(x => !x.IsExotic && !x.IsHidden)
  },
})
</script>
