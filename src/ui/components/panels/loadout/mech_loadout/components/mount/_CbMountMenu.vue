<template>
  <v-menu>
    <template #activator="{ props }">
      <div v-if="visible"
        style="position: relative">
        <div class="side-legend">
          <cc-button size="x-small"
            :color="isAvailable ? 'accent' : 'panel'"
            prepend-icon="cc:corebonus"
            :class="isAvailable && 'pulse mb-n1'"
            v-bind="props">
            <span v-if="!hasEffect && !portrait">Core Bonus Available</span>
          </cc-button>
        </div>
      </div>
    </template>
    <template #default="{ isActive }">
      <v-card tile
        border>
        <v-toolbar :color="color"
          tile
          height="24"
          class="px-1">
          <v-icon start
            icon="cc:corebonus" />
          <span class="heading h3">Mount CORE Bonus</span>
        </v-toolbar>
        <v-card-text class="text-center">
          <cc-button v-for="(b, index) in mech.AvailableBonuses"
            :key="`available-${index}`"
            size="small"
            block
            color="primary"
            class="my-1"
            prepend-icon="cc:corebonus"
            @click="
              mount.AddCoreBonus(b);
            isActive.value = false;
            ">
            Install {{ b.Name }}
          </cc-button>
          <cc-button v-for="(b, index) in mount.Bonuses"
            :key="`bonus-${index}`"
            size="small"
            block
            color="error"
            class="my-1"
            prepend-icon="mdi-cancel"
            @click="
              mount.RemoveCoreBonus(b);
            isActive.value = false;
            ">
            Remove {{ b.Name }}
          </cc-button>
        </v-card-text>
      </v-card>
    </template>
  </v-menu>
</template>

<script lang="ts">
import { useMobile } from '@/mixins/useMobile'

export default {
  name: 'CbMountMenu',
  mixins: [useMobile],
  props: {
    mech: {
      type: Object,
      required: true,
    },
    mount: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasEffect(): boolean {
      return this.mount.Bonuses.length;
    },
    color(): string {
      return this.mech.Frame.ManufacturerColor;
    },
    visible(): boolean {
      return this.mech.AvailableBonuses.length || this.mount.Bonuses.length;
    },
    isAvailable(): boolean {
      return this.mech.AvailableBonuses.length > 0;
    },
  },
};
</script>

<style scoped>
.side-legend {
  position: absolute;
  right: 4px;
  top: -22px;
  background-color: rgb(var(--v-theme-background));
  height: 30px;
  border: 2px;
  border-color: rgb(var(--v-theme-stark));
  border-radius: 5px;
}

.pulse {
  animation: talent-pulse 3s infinite;
  z-index: 2;
}

@keyframes talent-pulse {
  0% {
    box-shadow: 0 0 0 0px rgb(var(--v-theme-accent));
  }

  100% {
    box-shadow: 0 0 0 6px rgba(0, 0, 0, 0);
  }
}
</style>
