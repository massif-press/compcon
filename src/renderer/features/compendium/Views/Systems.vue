<template>
  <v-container fluid px-5>
    <span class="display-1 text-uppercase font-weight-thin">MECH SYSTEMS</span>
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
          <filter-panel system include-mods @update="updateFilter" />
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="headers"
        :items="systems"
        item-key="id"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.Source }}</span>
            </td>
            <td class="text-xs-left">
              <span class="title">{{ props.item.Name }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.LicenseString }}</span>
            </td>
            <td class="text-xs-left">
              <span class="subheading">{{ props.item.SP }}</span>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <system-card :itemData="props.item" table-item />
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { SystemCard } from '@/features/pilot_management/components/UI'
import { WeaponMod, MechSystem } from '@/class'
import FilterPanel from '@/features/_shared/UI/FilterPanel.vue'
import ItemFilter from '@/features/_shared/utility/ItemFilter'

export default Vue.extend({
  name: 'systems',
  components: { SystemCard, FilterPanel },
  data: () => ({
    search: null,
    detailFilter: {},
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'System', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'License' },
      { text: 'SP Cost', align: 'left', value: 'SP' },
    ],
  }),
  computed: {
    systems(): MechSystem[] {
      const vm = this as any
      let items = vm.$store.getters
        .getItemCollection('MechSystems')
        .concat(this.$store.getters.getItemCollection('WeaponMods'))
        .filter((x: WeaponMod) => x.Source)

      if (vm.search)
        items = items.filter(x =>
          x.Name.toLowerCase().includes(vm.search.toLowerCase())
        )

      items = ItemFilter.FilterSystemsCompendium(items, this.detailFilter)

      return items
    },
  },
  methods: {
    updateFilter(filter) {
      this.detailFilter = filter
      this.$forceUpdate()
    },
  },
})
</script>
