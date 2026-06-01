<template>
  <v-row>
    <transition-group name="fade-transition" :duration="250">
      <!-- <v-col v-if="parentController" v-for="pcd in parentController.CounterData" cols="auto">
        <counter-component
          :counter-data="pcd"
          :save-data="parentController.CounterSaveData"
          @delete="deleteCustom(pcd.id)"
          @update="updateCounter($event)" />
      </v-col> -->
      <v-col v-for="cd in controller.CounterData" :key="cd.id" cols="auto">
        <counter-component
          :counter-data="cd"
          :save-data="controller.CounterSaveData"
          @delete="deleteCustom(cd.id)"
          @update="updateCounter($event)" />
      </v-col>
      <v-col key="NewCounter" cols="12" md="auto">
        <new-counter @create="onCustomCounterCreate" />
      </v-col>
    </transition-group>
  </v-row>
</template>

<script setup lang="ts">
import type { ICombatant } from '@/classes/components/combat/ICombatant'
import { computed } from 'vue'
import CounterComponent from './_Counter.vue';
import NewCounter from './_NewCounter.vue';
import { Counter } from '@/classes/components/combat/counters/Counter'

const props = defineProps<{
  actor: ICombatant
}>()

const controller = computed(() => {
  return props.actor.CombatController.ActiveActor.CombatController.CounterController;
})

function onCustomCounterCreate(name: string) {
  controller.value.createCustomCounter(name);
}

function updateCounter(val: Counter) {
  controller.value.saveCounter(val.Serialize());
}

function deleteCustom(id: string) {
  controller.value.deleteCustomCounter(id);
}
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
