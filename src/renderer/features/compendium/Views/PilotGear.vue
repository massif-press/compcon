<template>
  <v-container fluid px-5>
    <span class="display-1 text-uppercase font-weight-thin">PILOT GEAR</span>
    <v-card class="mt-3">
      <v-tabs v-model="tabModel" color="blue-grey" dark  slider-color="warning" grow>
        <v-tab v-for="m in titles" :key="m" ripple >
         {{ m }}
        </v-tab>
        <v-tab-item v-for="(n, i) in gear" :key="n + 'arr'">
          <v-data-table :headers="i === 0 ? armor_headers : i === 1 ? weapon_headers : gear_headers" :items="n" :expand="true" item-key="id" hide-actions>
          <template slot="items" slot-scope="props">
            <tr v-if="props.item.type === 'armor'" @click="props.expanded = !props.expanded">
              <td><span class="subheading">{{ props.item.name }}</span></td>
              <td class="text-xs-center"><span class="subheading">+{{ props.item.armor }}</span></td>
              <td class="text-xs-center"><span class="subheading">+{{ props.item.hp_bonus || 0 }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.edef }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.evasion }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.speed }}</span></td>
            </tr>
            <tr v-else-if="props.item.type === 'weapon'" @click="props.expanded = !props.expanded">
              <td><span class="subheading">{{ props.item.name }}</span></td>
              <td><span class="subheading"><damage-element small :dmg="props.item.damage" /></span></td>
              <td><span class="subheading"><range-element small :range="props.item.range" /></span></td>
            </tr>
            <tr v-else @click="props.expanded = !props.expanded">
              <td><span class="subheading">{{ props.item.name }}</span></td>
              <td class="text-xs-center"><span class="subheading">{{ props.item.uses }}</span></td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat color="grey lighten-4">
              <v-card-text class="pa-1 pl-3 pr-3">
                <gear-card :itemData="props.item" table-item/>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {RangeElement, DamageElement, GearCard} from '@/features/pilot_management/components/UI'

export default Vue.extend({
    name: 'pilot-gear',
    components: { GearCard, RangeElement, DamageElement },
    data: () => ({
      tabModel: 0,
      titles: ['Pilot Armor', 'Pilot Weapons', 'Pilot Equipment'],
      gear: [[], [], []],
      search: null,
      armor_headers: [
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Armor', align: 'center', value: 'armor'},
        {text: 'HP Bonus', align: 'center', value: 'hp_bonus'},
        {text: 'E-Defense', align: 'center', value: 'edef'},
        {text: 'Evasion', align: 'center', value: 'evasion'},
        {text: 'Speed', align: 'center', value: 'speed'},
      ],
      weapon_headers: [
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Damage', align: 'left', value: 'damage'},
        {text: 'Range', align: 'left', value: 'range'},
      ],
      gear_headers: [
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Uses', align: 'center', value: 'uses'},
      ],
    }),
    created() {
      this.gear[0] = this.$store.getters['getItemCollection']('PilotGear').filter((x: CCItem) => x.type === 'armor')
      this.gear[1] = this.$store.getters['getItemCollection']('PilotGear').filter((x: CCItem) => x.type === 'weapon')
      this.gear[2] = this.$store.getters['getItemCollection']('PilotGear').filter((x: CCItem) => x.type === 'gear')
    },
  })
</script>