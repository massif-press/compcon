<template>
  <div class="mt-3">
    <h2 class="headline">Counters</h2>

    <transition-group
      name="fade-transition"
      :duration="250"
      tag="div"
      class="row justify-start pr-4"
    >
      <v-col v-for="cd in counterData" :key="cd.id" cols="auto" style="min-height: 170px">
        <counter-component :counter-data="cd" @delete="deleteCustom(cd.id)" />
      </v-col>
      <v-col key="NewCounter" cols="auto">
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

import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  components: { CounterComponent, NewCounter },

  props: {
    counterData: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onCustomCounterCreate(name: string) {
      this.pilot.createCustomCounter(name)
    },
    deleteCustom(id: string) {
      this.pilot.deleteCustomCounter(id)
    },
  },
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
