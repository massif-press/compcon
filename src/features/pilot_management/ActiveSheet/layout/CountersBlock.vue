<template>
  <div class="mt-3">
    <h2 class="headline">Counters</h2>
    <v-row justify="start">
      <v-col v-for="cd in counterData" :key="cd.id" sm="2">
        <counter-component :counter-data="cd" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { Counter } from '@/class'
import CounterComponent from '../components/Counter.vue'

export default Vue.extend({
  components: { CounterComponent },
  props: {
    counterData: {
      type: Array,
      required: true
    }
  }
})
</script>