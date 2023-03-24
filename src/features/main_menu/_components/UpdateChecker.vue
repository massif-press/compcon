<template>
  <v-btn
    v-if="updateFound"
    size="small"
    color="secondary"
    class="glow-anim"
    style="z-index: 999 !important"
    @click="updateClick"
  >
    <v-icon start size="small" icon="mdi-cloud-download" />
    {{ updateText }}
  </v-btn>
  <v-btn
    v-else
    color="white"
    variant="outlined"
    size="small"
    :disabled="checking"
    @click="checkUpdates"
    :style="{ opacity: 0.4 }"
  >
    <v-icon start small :class="{ 'spin-anim': checking }">sync</v-icon>
    {{ checking ? 'Checking for Updates...' : 'Check for Updates' }}
  </v-btn>
</template>

<script lang="ts">
import updateChecker from '@/util/UpdateChecker';

export default {
  name: 'UpdateChecker',
  data: () => ({
    updateFound: false,
    checking: false,
  }),
  methods: {
    async checkUpdates() {
      this.checking = true;

      await updateChecker.checkUpdates();

      this.checking = false;
    },
    updateClick() {
      updateChecker.getUpdate();
    },
  },
  created() {
    updateChecker.on('updatefound', () => (this.updateFound = true));
  },
  computed: {
    updateText(): string {
      return 'Update and Reload';
    },
  },
};
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
