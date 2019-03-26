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

<script>
  import WeaponCard from '../../Roster/UI/WeaponCard'
  import RangeElement from '../../Roster/UI/RangeElement'
  import DamageElement from '../../Roster/UI/DamageElement'

  export default {
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
        {text: 'SP Cost', align: 'left', value: 'sp'}
      ]
    }),
    created: function () {
      this.weapons = this.$store.getters.getItemCollection('MechWeapons').filter(x => x.source)
      var ps = this.$store.getters.getPresearch
      if (ps) {
        this.search = ps
        this.$store.dispatch('clearPresearch')
      }
    }
  }
</script>