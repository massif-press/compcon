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
      <v-col v-for="cd in controller.CounterData" cols="auto">
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

<script lang="ts">
import CounterComponent from './_Counter.vue';
import NewCounter from './_NewCounter.vue';
import { Counter } from '@/class';

export default {
  name: 'cc-counter-set',
  components: { CounterComponent, NewCounter },
  props: {
    actor: {
      type: Object,
      required: true,
    },
  },
  computed: {
    controller() {
      return this.actor.CombatController.ActiveActor.CombatController.CounterController;
    },
    // parentController() {
    //   return this.actor.Parent?.CombatController.CounterController;
    // },
  },
  methods: {
    onCustomCounterCreate(name: string) {
      this.controller.createCustomCounter(name);
    },
    updateCounter(val: Counter) {
      this.controller.saveCounter(val.Serialize());
    },
    deleteCustom(id: string) {
      this.controller.deleteCustomCounter(id);
    },
  },
};
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
