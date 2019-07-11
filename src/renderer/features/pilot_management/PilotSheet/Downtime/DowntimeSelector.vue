<template>
  <v-container fluid style="background-color: white">
    <v-layout row>
      <span class="major-title">Narrative Reserves</span>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3 v-for="r in reserves['Narrative']" :key="r.ID">
        <reserve-item :reserve="r" color="teal darken-3" @click="add(r)" />
      </v-flex>
    </v-layout>
    <v-divider class="ma-3" />
    <v-layout row>
      <span class="major-title">Tactical Reserves</span>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3 v-for="r in reserves['Tactical']" :key="r.ID">
        <reserve-item :reserve="r" color="lime darken-4" @click="add(r)" />
      </v-flex>
    </v-layout>
    <v-divider class="ma-3" />
    <v-layout row>
      <span class="major-title">Mech Reserves</span>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3 v-for="r in reserves['Mech']" :key="r.ID">
        <reserve-item :reserve="r" color="deep-orange darken-3" @click="add(r)" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import ReserveItem from './ReserveItem.vue'
import { Reserve } from '@/class'

export default Vue.extend({
  name: 'downtime-selector',
  components: { ReserveItem },
  props: {
    pilot: Object,
  },
  computed: {
    reserves() {
      return _.groupBy(
        this.$store.getters.getItemCollection('Reserves'),
        'Type'
      )
    },
  },
  methods: {
    add(reserve: Reserve) {
      this.pilot.Reserves.push(reserve)
      this.$emit('notify', `New ${reserve.Name} Reserve added`)
      this.$emit('close')
    },
  },
})
</script>
