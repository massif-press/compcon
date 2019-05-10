<template>
  <v-container fluid px-5>
    <span class="display-1 text-uppercase font-weight-thin">MECH SYSTEMS</span>
      <v-card>
          <v-text-field class="search-field ma-2" prepend-icon="search"
            v-model="search" flat hide-details single-line placeholder="Search" clearable />
        <v-data-table :headers="headers" :items="systems" :search="search" item-key="id" hide-actions>
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-left"><span class="subheading">{{ props.item.source }}</span></td>
              <td class="text-xs-left"><span class="title">{{ props.item.name }}</span></td>
            <td class="text-xs-left"><span class="subheading">{{props.item.license}} {{props.item.license_level}}</span></td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.sp }}</span></td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat>
              <v-card-text><system-card :itemData="props.item" table-item /></v-card-text>
            </v-card>          
          </template>
        </v-data-table>
      </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {SystemCard} from '@/features/pilot_management/components/UI'

export default Vue.extend({
    name: 'systems',
    components: { SystemCard },
    data: () => ({
      systems: [],
      search: null,
      headers: [
        {text: 'Source', align: 'left', value: 'source'},
        {text: 'System', align: 'left', value: 'name'},
        {text: 'License', align: 'left', value: 'license'},
        {text: 'SP Cost', align: 'left', value: 'sp'},
      ],
    }),
    created() {
      this.systems = this.$store.getters['getItemCollection']('MechSystems')
        .concat(this.$store.getters['getItemCollection']('WeaponMods'))
        .filter((x: WeaponMod) => x.source)
      const ps = this.$store.getters['getPresearch']
      if (ps) {
        this.search = ps
        this.$store.dispatch('clearPresearch')
      }
    },
  })
</script>