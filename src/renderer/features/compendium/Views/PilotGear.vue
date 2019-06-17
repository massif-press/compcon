<template>
  <v-container fluid px-5>
    <span class="display-1 text-uppercase font-weight-thin">PILOT GEAR</span>
    <v-card class="mt-3">
      <v-tabs
        v-model="tabModel"
        color="blue-grey"
        dark
        slider-color="warning"
        grow
      >
        <v-tab v-for="m in titles" :key="m" ripple>
          {{ m }}
        </v-tab>
        <v-tab-item v-for="(n, i) in gear" :key="n + 'arr'">
          <v-data-table
            :headers="
              i === 0 ? armor_headers : i === 1 ? weapon_headers : gear_headers
            "
            :items="n"
            :custom-sort="customSort"
            :expand="true"
            item-key="id"
            hide-actions
          >
            <template slot="items" slot-scope="props">
              <tr
                v-if="props.item.ItemType === 'PilotArmor'"
                @click="props.expanded = !props.expanded"
              >
                <td>
                  <span class="subheading">{{ props.item.Name }}</span>
                </td>
                <td class="text-xs-center">
                  <span class="subheading">+{{ props.item.Armor }}</span>
                </td>
                <td class="text-xs-center">
                  <span class="subheading">+{{ props.item.HPBonus || 0 }}</span>
                </td>
                <td class="text-xs-center">
                  <span class="subheading">{{ props.item.EDefense }}</span>
                </td>
                <td class="text-xs-center">
                  <span class="subheading">{{ props.item.Evasion }}</span>
                </td>
                <td class="text-xs-center">
                  <span class="subheading">{{ props.item.Speed }}</span>
                </td>
              </tr>
              <tr
                v-else-if="props.item.ItemType === 'PilotWeapon'"
                @click="props.expanded = !props.expanded"
              >
                <td>
                  <span class="subheading">{{ props.item.Name }}</span>
                </td>
                <td>
                  <span class="subheading">
                    <range-element small :range="props.item.Range" />
                  </span>
                </td>
                <td>
                  <span class="subheading">
                    <damage-element small :dmg="props.item.Damage" />
                  </span>
                </td>
              </tr>
              <tr v-else @click="props.expanded = !props.expanded">
                <td>
                  <span class="subheading">{{ props.item.Name }}</span>
                </td>
                <td class="text-xs-center">
                  <span class="subheading">{{ props.item.Uses }}</span>
                </td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
              <v-card flat color="grey lighten-4">
                <v-card-text class="pa-1 pl-3 pr-3">
                  <gear-card :itemData="props.item" table-item />
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
import {
  RangeElement,
  DamageElement,
  GearCard,
} from '@/features/pilot_management/components/UI'
import { PilotEquipment, CompendiumItem, ItemType } from '@/class'

export default Vue.extend({
  name: 'pilot-gear',
  components: { GearCard, RangeElement, DamageElement },
  data: () => ({
    tabModel: 0,
    titles: ['Pilot Armor', 'Pilot Weapons', 'Pilot Equipment'],
    gear: [[], [], []],
    search: null,
    armor_headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Armor', align: 'center', value: 'Armor' },
      { text: 'HP Bonus', align: 'center', value: 'HPBonus' },
      { text: 'E-Defense', align: 'center', value: 'EDefense' },
      { text: 'Evasion', align: 'center', value: 'Evasion' },
      { text: 'Speed', align: 'center', value: 'Speed' },
    ],
    weapon_headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Range', align: 'left', value: 'Range' },
      { text: 'Damage', align: 'left', value: 'Damage' },
    ],
    gear_headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Uses', align: 'center', value: 'Uses' },
    ],
  }),
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
  },
  created() {
    this.gear[0] = this.$store.getters
      .getItemCollection('PilotGear')
      .filter((x: CompendiumItem) => x.ItemType === ItemType.PilotArmor)
    this.gear[1] = this.$store.getters
      .getItemCollection('PilotGear')
      .filter((x: CompendiumItem) => x.ItemType === ItemType.PilotWeapon)
    this.gear[2] = this.$store.getters
      .getItemCollection('PilotGear')
      .filter((x: CompendiumItem) => x.ItemType === ItemType.PilotGear)
  },
})
</script>
