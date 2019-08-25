<template>
  <v-container fluid>
    <span class="display-1 text-uppercase font-weight-thin">FRAMES</span>
    <v-card>
      <v-layout justify-center>
        <v-flex xs5>
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
        <v-flex xs5>
          <v-select
            class="search-field ma-2"
            flat
            single-line
            hide-details
            v-model="filter"
            prepend-icon="mdi-filter-variant"
            chips
            deletable-chips
            dense
            label="Frame Type"
            :items="frameTypes"
            multiple
            small-chips
          />
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-data-table :headers="headers" :items="frames" item-key="id" hide-actions>
            <template slot="items" slot-scope="props">
              <tr @click="props.expanded = !props.expanded">
                <td class="text-xs-left">
                  <span class="subheading">{{ props.item.Source }}</span>
                </td>
                <td class="text-xs-left">
                  <span class="subheading font-weight-bold">
                    {{ props.item.Name }}
                  </span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">
                    {{ props.item.Size === 0.5 ? '½' : props.item.Size }}
                  </span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.Armor }}</span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.HP }}</span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.Evasion }}</span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.EDefense }}</span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.HeatCap }}</span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.RepCap }}</span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.SensorRange }}</span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.TechAttack }}</span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.Save }}</span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.Speed }}</span>
                </td>
                <td class="text-xs-right">
                  <span class="subheading">{{ props.item.SP }}</span>
                </td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
              <frame-statblock :frame="props.item" hide-statblock />
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { FrameStatblock } from '@/features/pilot_management/components/UI'
import { MechType, Frame } from '@/class'
import accent_fold from '@/features/_shared/utility/accent_fold';

export default Vue.extend({
  name: 'frames',
  components: { FrameStatblock },
  data: () => ({
    search: null,
    filter: [],
    headers: [
      { text: 'Source', align: 'left', value: 'Source' },
      { text: 'Frame', align: 'left', value: 'Name' },
      { text: 'Size', align: 'right', value: 'Size' },
      { text: 'Armor', align: 'right', value: 'Armor' },
      { text: 'HP', align: 'right', value: 'HP' },
      { text: 'Evasion', align: 'right', value: 'Evasion' },
      { text: 'E-Def.', align: 'right', value: 'EDefense' },
      { text: 'Heat Cap.', align: 'right', value: 'HeatCap' },
      { text: 'Rep. Cap.', align: 'right', value: 'RepCap' },
      { text: 'Sensors', align: 'right', value: 'SensorRange' },
      { text: 'Tech Atk', align: 'right', value: 'TechAttack' },
      { text: 'Save', align: 'right', value: 'Save' },
      { text: 'Speed', align: 'right', value: 'Speed' },
      { text: 'SP', align: 'right', value: 'SP' },
    ],
  }),
  computed: {
    frames() {
      var vm = this as any
      let i = vm.$store.getters.getItemCollection('Frames')

      if (vm.search) {
        i = i.filter((x: Frame) => includesIgnoringAccentsCase(x.Name, vm.search))
      }

      if (vm.filter.length) {
        i = i.filter((x: Frame) => x.Mechtype.some(y => vm.filter.includes(y)))
      }

      return i
    },
  },
  created() {
    this.frameTypes = Object.keys(MechType).sort() as MechType[]
  },
})
</script>
