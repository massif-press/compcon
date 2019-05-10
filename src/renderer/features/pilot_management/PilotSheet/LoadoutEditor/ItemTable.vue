<template>
  <v-card flat>
    <v-container fluid>
      <v-toolbar color="white" class="pt-1" >
      <v-text-field class="search-field ma-2" prepend-icon="search"
        v-model="search" flat hide-details single-line placeholder="Search" clearable />
      </v-toolbar>
      <v-card>
        <v-data-table :headers="itemType === 'armor' ? armor_headers : itemType === 'weapon' ? weapon_headers : gear_headers" 
          :items="gearItems" :expand="true" :search="search" hide-actions>
          <template slot="items" slot-scope="props">
            <!-- Armor -->
            <tr v-if="props.item.type === 'armor'" @click="props.expanded = !props.expanded">
              <td style="padding: 0!important;"><v-btn color="primary" small @click.stop="select(props.item)" class="p-0 m-0">equip</v-btn></td>
              <td><span class="subheading">{{ props.item.name }}</span></td>
              <td class="text-xs-center"><span class="subheading">+{{ props.item.armor }}</span></td>
              <td class="text-xs-center"><span class="subheading">+{{ props.item.hp_bonus || 0 }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.edef }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.evasion }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.speed }}</span></td>
            </tr>
            <!-- Weapon -->
            <tr v-else-if="props.item.type === 'weapon'" @click="props.expanded = !props.expanded">
              <td style="padding: 0!important;"><v-btn color="primary" @click="select(props.item)" class="p-0 m-0">equip</v-btn></td>
              <td><span class="subheading">{{ props.item.name }}</span></td>
              <td><span class="subheading"><damage-element small :dmg="props.item.damage" /></span></td>
              <td><span class="subheading"><range-element small :range="props.item.range" /></span></td>
            </tr>
            <!-- Gear -->
            <tr v-else @click="props.expanded = !props.expanded">
              <td style="padding: 0!important;"><v-btn color="primary" @click="select(props.item)" class="p-0 m-0">equip</v-btn></td>
              <td><span class="subheading">{{ props.item.name }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.uses }}</span></td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat color="grey lighten-4">
              <v-card-text class="pa-1 pl-3 pr-3">
                <gear-card :itemData="props.item" />
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-card>
      <v-layout v-if="equippedItem" justify-space-between class="pt-4">
        <v-flex xs1></v-flex>
        <v-flex shrink>
          <v-btn color="error" @click="remove()">Remove {{equipped.name}}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {RangeElement, DamageElement, GearCard} from '../../components/UI'

export default Vue.extend({
    name: 'item-table',
    components: { GearCard, RangeElement, DamageElement },
    props: {
      itemType: String,
      equippedItem: Object
    },
    data: () => ({
      selectedIndex: -1,
      filterText: '',
      sortRule: null,
      search: null,
      searchFilter: null,
      armor_headers: [
        {align: 'left', sortable: false, width: '5vw'},
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Armor', align: 'center', value: 'armor'},
        {text: 'HP Bonus', align: 'center', value: 'hp_bonus'},
        {text: 'E-Defense', align: 'center', value: 'edef'},
        {text: 'Evasion', align: 'center', value: 'evasion'},
        {text: 'Speed', align: 'center', value: 'speed'}
      ],
      weapon_headers: [
        {align: 'left', sortable: false, width: '5vw'},
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Damage', align: 'left', value: 'damage[0].val'},
        {text: 'Range', align: 'left', value: 'range[0].val'}
      ],
      gear_headers: [
        {align: 'left', sortable: false, width: '5vw'},
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Uses', align: 'center', value: 'uses'}
      ]
    }),
    computed: {
      gearItems (): PilotItem {
        return this.$store.getters['getItemCollection']('PilotGear').filter((x: any) => this.itemType === x.type)
      },
      equipped (): PilotItem {
        var vm = this as any
        return vm.equippedItem ? vm.getPilotGear(this.equippedItem.id) : {}
      }
    },
    methods: {
      select (item: any) {
        this.$emit('select-item', item)
      },
      remove () {
        this.$emit('remove-item', this.itemType)
      }
    }
  })
</script>
