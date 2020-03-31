<template>
  <v-btn dark outlined small :disabled="checking" @click="checkUpdates">
    <v-icon left small :class="{ 'spin-anim': checking }">
      sync
    </v-icon>
    {{ checking ? 'Checking for Updates...' : 'Check for Updates' }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class UpdatesTracker extends Vue {

  checking = false;
  async checkUpdates() {

    console.log('checking....');

    this.checking = true;

    const swReg: ServiceWorkerRegistration | undefined = window.swReg

    if (!swReg) {
      this.checking = false;
      return;
    };

    let foundUpdate = false;
    swReg.onupdatefound = () => { foundUpdate = true }

    await swReg.update()

    console.log('foundUpdate', foundUpdate)

    this.checking = false;
  }

  mounted() {
    console.log('hello');
    // this.checkUpdates();
  }

}
</script>

<style>
.spin-anim {
  animation-name: spin;
  animation-duration: 1.25s;
  animation-timing-function: cubic-bezier(0.455, 0.03, 0.515, 0.955);
  animation-iteration-count: infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}
</style>