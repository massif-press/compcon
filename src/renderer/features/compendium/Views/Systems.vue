<template>
  <v-container fluid px-5>
    <span class="display-1 text-uppercase font-weight-thin">MECH SYSTEMS</span>
    <v-card>
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
      <v-data-table
        :headers="headers"
        :items="systems"
        :search="search"
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
import { WeaponMod } from '@/class'

export default Vue.extend({
  name: 'systems',
  components: { SystemCard },
  data: () => ({
    systems: [],
    search: null,
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'System', align: 'left', value: 'Name' },
      { text: 'License', align: 'left', value: 'License' },
      { text: 'SP Cost', align: 'left', value: 'SP' },
    ],
  }),
  created() {
    this.systems = this.$store.getters
      .getItemCollection('MechSystems')
      .concat(this.$store.getters.getItemCollection('WeaponMods'))
      .filter((x: WeaponMod) => x.Source)
  },
})
</script>
