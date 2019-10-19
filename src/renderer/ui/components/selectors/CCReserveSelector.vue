<template>
  <div>
    <div
      style="position: absolute; top: 0; right: 0; height:120px; width:100px; overflow-x: hidden"
      class="primary"
    />
    <v-tabs background-color="primary" hide-slider grow>
      <v-tab>
        <b>Narrative Reserve</b>
      </v-tab>
      <v-tab>
        <b>Tactical Reserve</b>
      </v-tab>
      <v-tab>
        <b>Mech Reserve</b>
      </v-tab>
      <v-tab>
        <b>Custom Reserve</b>
      </v-tab>
      <v-tab>
        <b>Project</b>
      </v-tab>
      <v-tab>
        <b>Organization</b>
      </v-tab>
      <v-tab-item>
        <v-row dense class="px-12">
          <v-col v-for="r in reserves['Narrative']" :key="`item_${r.ID}`" cols="6" class="px-4">
            <reserve-item
              :reserve="r"
              icon="cci-pilot"
              color="reserve--narrative"
              class="ma-2"
              @click="add(r)"
            />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row dense class="px-12">
          <v-col v-for="r in reserves['Tactical']" :key="`item_${r.ID}`" cols="6" class="px-4">
            <reserve-item
              :reserve="r"
              icon="cci-barrage"
              color="reserve--tactical"
              class="ma-1"
              @click="add(r)"
            />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row dense class="px-12">
          <v-col v-for="r in reserves['Mech']" :key="`item_${r.ID}`" cols="6" class="px-4">
            <reserve-item
              :reserve="r"
              icon="cci-frame"
              color="reserve--mech"
              class="ma-1"
              @click="add(r)"
            />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <custom-reserve-panel @add="add($event)" />
      </v-tab-item>
      <v-tab-item>
        <downtime-project-panel @add="add($event)" />
      </v-tab-item>
      <v-tab-item>
        <organization-panel @add="addOrg($event)" />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ReserveItem from './components/_ReserveItem.vue'
import CustomReservePanel from './components/_CustomReservePanel.vue'
import DowntimeProjectPanel from './components/_DowntimeProjectPanel.vue'
import OrganizationPanel from './components/_OrganizationPanel.vue'
import { Reserve, Organization } from '@/class'

export default Vue.extend({
  name: 'downtime-selector',
  components: { ReserveItem, CustomReservePanel, DowntimeProjectPanel, OrganizationPanel },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    reserves() {
      return this.$_.groupBy(this.$store.getters.getItemCollection('Reserves'), 'Type')
    },
  },
  methods: {
    add(reserve: Reserve) {
      this.pilot.Reserves.push(reserve)
      this.$emit('close')
    },
    addOrg(org: Organization) {
      this.pilot.Organizations.push(org)
      this.$emit('close')
    },
  },
})
</script>
