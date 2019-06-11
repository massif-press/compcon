<template>
  <v-card flat>
    <v-container fluid>
      <v-toolbar color="white" class="pt-1">
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
      </v-toolbar>
      <v-card>
        <v-data-table
          :headers="
            itemType === 'PilotArmor'
              ? armor_headers
              : itemType === 'PilotWeapon'
              ? weapon_headers
              : gear_headers
          "
          :items="gearItems"
          :expand="true"
          :search="search"
          :custom-sort="customSort"
          hide-actions
        >
          <template slot="items" slot-scope="props">
            <!-- Armor -->
            <tr
              v-if="props.item.ItemType === 'PilotArmor'"
              @click="props.expanded = !props.expanded"
            >
              <td style="padding: 0!important;">
                <v-btn
                  color="primary"
                  small
                  @click.stop="select(props.item)"
                  class="p-0 m-0"
                >
                  equip
                </v-btn>
              </td>
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
            <!-- Weapon -->
            <tr
              v-else-if="props.item.ItemType === 'PilotWeapon'"
              @click="props.expanded = !props.expanded"
            >
              <td style="padding: 0!important;">
                <v-btn
                  color="primary"
                  @click="select(props.item)"
                  class="p-0 m-0"
                >
                  equip
                </v-btn>
              </td>
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
            <!-- Gear -->
            <tr v-else @click="props.expanded = !props.expanded">
              <td style="padding: 0!important;">
                <v-btn
                  color="primary"
                  @click="select(props.item)"
                  class="p-0 m-0"
                >
                  equip
                </v-btn>
              </td>
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
                <gear-card :itemData="props.item" />
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-card>
      <v-layout v-if="equippedItem" justify-space-between class="pt-4">
        <v-flex xs1></v-flex>
        <v-flex shrink>
          <v-btn color="error" @click="remove(equippedItem)">
            Remove {{ equippedItem.Name }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { RangeElement, DamageElement, GearCard } from '../../components/UI'
import { PilotEquipment, ItemType } from '@/class'

export default Vue.extend({
  name: 'item-table',
  components: { GearCard, RangeElement, DamageElement },
  props: {
    itemType: String,
    equippedItem: Object,
  },
  data: () => ({
    gearItems: [],
    selectedIndex: -1,
    filterText: '',
    sortRule: null,
    search: null,
    searchFilter: null,
    armor_headers: [
      { align: 'left', sortable: false, width: '5vw' },
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Armor', align: 'center', value: 'Armor' },
      { text: 'HP Bonus', align: 'center', value: 'HPBonus' },
      { text: 'E-Defense', align: 'center', value: 'EDefense' },
      { text: 'Evasion', align: 'center', value: 'Evasion' },
      { text: 'Speed', align: 'center', value: 'Speed' },
    ],
    weapon_headers: [
      { align: 'left', sortable: false, width: '5vw' },
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Range', align: 'left', value: 'Range' },
      { text: 'Damage', align: 'left', value: 'Damage' },
    ],
    gear_headers: [
      { align: 'left', sortable: false, width: '5vw' },
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Uses', align: 'center', value: 'Uses' },
    ],
  }),
  methods: {
    select(item: PilotEquipment) {
      this.$emit('select-item', item)
    },
    remove(item: PilotEquipment) {
      this.$emit('remove-item', item)
    },
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
    this.gearItems = this.$store.getters
      .getItemCollection('PilotGear')
      .filter((x: PilotEquipment) => x.ItemType === this.itemType)
  },
})
</script>
