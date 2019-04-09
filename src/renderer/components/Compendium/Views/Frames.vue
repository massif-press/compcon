<template>
  <v-container fluid class="ml-5 pl-5">
    <span class="display-1 text-uppercase font-weight-thin">FRAMES</span>
      <v-layout>
        <v-flex>
      <v-autocomplete flat v-model="search" :items="frames" 
        clearable hide-details hide-selected item-text="name" item-value="name" label="Search..." solo class="mt-2"/>
        </v-flex>
      </v-layout>
      <v-layout >
        <v-flex>
        <v-data-table :headers="headers" :items="frames" :search="search" item-key="id" hide-actions>
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td class="text-xs-left"><span class="subheading">{{ props.item.source }}</span></td>
              <td class="text-xs-left"><span class="subheading font-weight-bold">{{ props.item.name }}</span></td>
              <td class="text-xs-right"><span class="subheading">{{ props.item.stats.size === 0.5 ? '½' : props.item.stats.size }}</span></td>
              <td class="text-xs-right"><span class="subheading">{{ props.item.stats.armor }}</span></td>
              <td class="text-xs-right"><span class="subheading">{{ props.item.stats.hp }}</span></td>
              <td class="text-xs-right"><span class="subheading">{{ props.item.stats.evasion }}</span></td>
              <td class="text-xs-right"><span class="subheading">{{props.item.stats.edef}}</span></td>
              <td class="text-xs-right"><span class="subheading">{{ props.item.stats.heatcap }}</span></td>
              <td class="text-xs-right"><span class="subheading">{{ props.item.stats.repcap }}</span></td>
              <td class="text-xs-right"><span class="subheading">{{ props.item.stats.sensor_range }}</span></td>
              <td class="text-xs-right"><span class="subheading">{{ props.item.stats.tech_attack }}</span></td>
              <td class="text-xs-right"><span class="subheading">{{props.item.stats.save}}</span></td>
              <td class="text-xs-right"><span class="subheading">{{ props.item.stats.speed }}</span></td>
              <td class="text-xs-right"><span class="subheading">{{ props.item.stats.sp }}</span></td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
              <frame-statblock :frame="props.item" hide-statblock />
          </template>
        </v-data-table>
      </v-flex>
  </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {FrameStatblock} from '../../Roster/UI'

export default Vue.extend({
    name: 'frames',
    components: { FrameStatblock },
    data: () => ({
      frames: [],
      search: null,
      headers: [
        {text: 'Source', align: 'left', value: 'source'},
        {text: 'Frame', align: 'left', value: 'name'},
        {text: 'Size', align: 'right', value: 'stats.size'},
        {text: 'Armor', align: 'right', value: 'stats.armor'},
        {text: 'HP', align: 'right', value: 'stats.hp'},
        {text: 'Evasion', align: 'right', value: 'stats.evasion'},
        {text: 'E-Def.', align: 'right', value: 'stats.edef'},
        {text: 'Heat Cap.', align: 'right', value: 'stats.heatcap'},
        {text: 'Repair Cap.', align: 'right', value: 'stats.repcap'},
        {text: 'Sensor Range', align: 'right', value: 'stats.sensor_range'},
        {text: 'Tech Attack', align: 'right', value: 'stats.tech_attack'},
        {text: 'Save', align: 'right', value: 'stats.save'},
        {text: 'Speed', align: 'right', value: 'stats.speed'},
        {text: 'SP', align: 'right', value: 'stats.sp'},
      ],
    }),
    created() {
      this.frames = this.$store.getters.getItemCollection('Frames')
      const ps = this.$store.getters.getPresearch
      if (ps) {
        this.search = ps
        this.$store.dispatch('clearPresearch')
      }
    },
  })
</script>