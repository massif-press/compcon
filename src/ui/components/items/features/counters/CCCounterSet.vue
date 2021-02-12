<template>
  <transition-group name="fade-transition" :duration="250" tag="div" class="row justify-start pr-4">
    <v-col v-for="cd in actors.flatMap(x => x.CounterData)" :key="cd.id" cols="auto">
      <counter-component
        :counter-data="cd"
        :save-data="actors[0].CounterSaveData"
        @delete="deleteCustom(cd.id)"
        @update="updateCounter($event)"
      />
    </v-col>
    <v-col key="NewCounter" cols="auto">
      <new-counter @create="onCustomCounterCreate" />
    </v-col>
  </transition-group>
</template>

<script lang="ts">
import Vue from 'vue'
import CounterComponent from './_Counter.vue'
import NewCounter from './_NewCounter.vue'
import { Counter } from '@/class'

export default Vue.extend({
  name: 'cc-counter-set',
  components: { CounterComponent, NewCounter },
  props: {
    actor: {
      type: [Object, Array],
      required: true,
    },
  },
  computed: {
    actors() {
      if (Array.isArray(this.actor)) return this.actor
      return [this.actor]
    },
  },
  methods: {
    onCustomCounterCreate(name: string) {
      this.actors[0].createCustomCounter(name)
    },
    updateCounter(val: Counter) {
      this.actors[0].saveCounter(val.Serialize())
    },
    deleteCustom(id: string) {
      this.actors[0].deleteCustomCounter(id)
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
