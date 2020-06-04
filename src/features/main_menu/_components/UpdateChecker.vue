<template>
  <v-btn v-if="updateFound" small class="primary--text glow-anim" @click="updateClick">
    <v-icon left small color="primary">
      cloud_download
    </v-icon>
    {{ updateText }}
  </v-btn>
  <v-btn v-else dark outlined small :disabled="checking" @click="checkUpdates">
    <v-icon left small :class="{ 'spin-anim': checking }">
      sync
    </v-icon>
    {{ checking ? 'Checking for Updates...' : 'Check for Updates' }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import updateChecker from '@/classes/utility/UpdateChecker'

@Component
export default class UpdatesTracker extends Vue {
  updateFound = false
  checking = false
  async checkUpdates() {
    console.log('checking....')

    this.checking = true

    await updateChecker.checkUpdates()

    this.checking = false
  }

  created() {
    updateChecker.on('updatefound', () => (this.updateFound = true))
  }

  mounted() {
    if (updateChecker.updateAvailable) this.updateFound = true
  }

  get updateText(): string {
    switch (this.$platform) {
      case 'web':
        return 'Update and Reload'
      case 'electron':
        return 'Download Update'
    }
  }
  updateClick() {
    updateChecker.getUpdate()
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

.glow-anim {
  animation-name: glow;
  animation-duration: 1.2s;
  animation-timing-function: ease;
  animation-iteration-count: infinite;
}

@keyframes glow {
  from {
    box-shadow: 0px 0px 0px 0px rgba(245, 245, 245, 1);
  }
  to {
    box-shadow: 0px 0px 0px 8px rgba(245, 245, 245, 0);
  }
}
</style>
