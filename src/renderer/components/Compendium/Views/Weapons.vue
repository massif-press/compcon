<template>
  <v-container fluid class="ml-5 pl-5">
    <span class="display-1 text-uppercase font-weight-thin">MECH WEAPONS</span>
      <v-autocomplete flat v-model="search" :items="weapons" 
        clearable hide-details hide-selected item-text="name" item-value="name" label="Search..." solo class="mt-2"/>
        <v-data-table :headers="headers" :items="weapons" :search="search" item-key="id" hide-actions>
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
            <td class="text-xs-left"><span class="subheading">{{ props.item.source }}</span></td>
            <td><span class="title">{{ props.item.name }}</span></td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.license }} {{props.item.license_level}}</span></td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.mount }}</span></td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.type }}</span></td>
            <td class="text-xs-left"><span class="subheading"><range-element small :range="props.item.range" /></span></td>
            <td class="text-xs-left"><span class="subheading"><damage-element small dark size="16" :dmg="props.item.damage" /></span></td>
            <td class="text-xs-left"><span class="subheading">{{ props.item.sp }}</span></td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat>
              <v-card-text><weapon-card :itemData="props.item" table-item/></v-card-text>
            </v-card>          
          </template>
        </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import WeaponCard from '@/components/Roster/UI/WeaponCard.vue'
import RangeElement from '@/components/Roster/UI/RangeElement.vue'
import DamageElement from '@/components/Roster/UI/DamageElement.vue'

export default Vue.extend({
    name: 'weapons',
    components: { WeaponCard, RangeElement, DamageElement },
    data: () => ({
      weapons: [],
      search: null,
      headers: [
        {text: 'Source', align: 'left', value: 'source'},
        {text: 'Weapon', align: 'left', value: 'name'},
        {text: 'License', align: 'left', value: 'license'},
        {text: 'Size', align: 'left', value: 'mount'},
        {text: 'Type', align: 'left', value: 'type'},
        {text: 'Range', align: 'left', value: 'range[0].val'},
        {text: 'Damage', align: 'left', value: 'damage[0].val'},
        {text: 'SP Cost', align: 'left', value: 'sp'},
      ],
    }),
    created() {
      this.weapons = this.$store.getters.getItemCollection('MechWeapons').filter((x: Weapon) => x.source)
      const ps = this.$store.getters.getPresearch
      if (ps) {
        this.search = ps
        this.$store.dispatch('clearPresearch')
      }
    },
  })
</script>