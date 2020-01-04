<template>
  <div class="mt-3">
    <h2 class="headline">Counters</h2>

    <transition-group
      name="fade-transition"
      :duration="250"
      tag="div"
      class="row justify-start pr-4"
    >
      <v-col v-for="cd in counterData" :key="cd.id" sm="2" style="min-height: 180px">
        <counter-component :counter-data="cd" @delete="deleteCustom" />
      </v-col>
      <v-col key="NewCounter" sm="2" style="min-height: 180px">
        <new-counter @create="onCustomCounterCreate" />
      </v-col>
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import CounterComponent from '../components/Counter.vue'
import NewCounter from '../components/NewCounter.vue'
import activePilot from '../../mixins/activePilot'

export default Vue.extend({
  components: { CounterComponent, NewCounter },
  mixins: [activePilot],
  props: {
    counterData: {
      type: Array,
      required: true
    }
  },
  methods: {
    onCustomCounterCreate(name: string) {
      this.pilot.createCustomCounter(name)
    },
    deleteCustom(id: string) {
      this.pilot.deleteCustomCounter(id)
    }
  }
})
</script>

<style scoped>
.fade-transition-enter-active,
.fade-transition-move {
  transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
}
.fade-transition-leave {
  transition-duration: 200ms;
  width: 0px;
}
</style>