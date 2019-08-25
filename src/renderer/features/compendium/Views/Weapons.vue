<template>
  <v-container fluid px-5>
    <span class="display-1 text-uppercase font-weight-thin">MECH WEAPONS</span>
    <v-card>
      <v-layout row class="pa-3">
        <v-flex>
          <v-text-field
            class="search-field ma-2"
            prepend-icon="search"
            v-model="search"
            flat
            hide-details
            single-line
            placeholder="Search"
            clearable
          />
        </v-flex>
        <v-flex shrink>
          <filter-panel weapon @update="updateFilter" />
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="headers"
        :items="weapons"
        :search="search"
        :custom-sort="customSort"
        item-key="id"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.Source }}</span>
            </td>
            <td>
              <span class="title">{{ props.item.name }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.LicenseString }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.Size }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.Type }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">
                <range-element small :range="props.item.Range" />
              </span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">
                <damage-element small dark size="16" :dmg="props.item.Damage" />
              </span>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <weapon-card :item="props.item" table-item />
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { RangeElement, DamageElement, WeaponCard } from '@/features/pilot_management/components/UI'
import FilterPanel from '@/features/_shared/UI/FilterPanel.vue'
import ItemFilter from '@/features/_shared/utility/ItemFilter'
import accent_fold from '@/features/_shared/utility/accent_fold'
import { MechWeapon } from '@/class'

export default Vue.extend({
  name: 'weapons',
  components: { WeaponCard, RangeElement, DamageElement, FilterPanel },
  data: () => ({
    search: null,
    detailFilter: {},
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'Weapon', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'License' },
      { text: 'Size', align: 'left', value: 'Size' },
      { text: 'Type', align: 'left', value: 'Type' },
      { text: 'Range', align: 'left', value: 'Range' },
      { text: 'Damage', align: 'left', value: 'Damage' },
    ],
  }),
  computed: {
    weapons(): MechWeapon[] {
      const vm = this as any
      let items = vm.$store.getters
        .getItemCollection('MechWeapons')
        .filter((x: MechWeapon) => x.Source) as MechWeapon[]

      if (vm.search)
        items = items.filter(x => accent_fold(x.Name).toLowerCase().includes(accent_fold(vm.search).toLowerCase()))

      items = ItemFilter.FilterWeapons(items, this.detailFilter)

      return items
    },
  },
  methods: {
    customSort(items, index, isDescending) {
      items.sort((a, b) => {
        if (index === 'Damage') {
          if (isDescending) {
            return b.Damage[0].Max - a.Damage[0].Max
          } else {
            return a.Damage[0].Max - b.Damage[0].Max
          }
        } else if (index === 'Range') {
          if (isDescending) {
            return b.Range[0].Max - a.Range[0].Max
          } else {
            return a.Range[0].Max - b.Range[0].Max
          }
        } else {
          if (!isDescending) {
            return a[index] < b[index] ? -1 : 1
          } else {
            return b[index] < a[index] ? -1 : 1
          }
        }
      })

      return items
    },
    updateFilter(filter) {
      this.detailFilter = filter
      this.$forceUpdate()
    },
  },
})
</script>
