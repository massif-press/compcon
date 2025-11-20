<template>
  <v-col>
    <div class="text-cc-overline text-disabled">
      <span v-if="aoe">Targets</span>
      <span v-else>Target</span>
    </div>
    <v-select
      v-for="(t, idx) in selectedTargets"
      v-model="selectedTargets[idx]"
      density="compact"
      variant="outlined"
      :item-title="(c) => c.actor.CombatController.Name"
      return-object
      class="mb-1"
      :items="filteredTargets"
      flat
      hide-details
      tile>
      <template #prepend>
        <div v-if="idx === 0">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-btn
                icon
                size="x-small"
                variant="text"
                flat
                tile
                class="mr-n2"
                v-bind="props"
                @click="$emit('toggle-aoe')">
                <v-icon size="25" :icon="aoeIcon" class="mr-n2" />
              </v-btn>
            </template>

            <div v-if="aoe">
              Area of Effect
              <span v-if="typeof aoe === 'string'">
                <cc-slashes />
                {{ aoe }}
              </span>
              <div>
                <i class="text-caption text-disabled">Click to Override</i>
              </div>
            </div>

            <div v-else class="text-center">
              Single Target
              <div>
                <i class="text-caption text-disabled">Click to Override</i>
              </div>
            </div>
          </v-tooltip>
        </div>
        <div v-else style="width: 24px"></div>
      </template>
      <template #append>
        <v-btn icon size="x-small" variant="text" flat tile class="mx-n2">
          <v-icon size="20" icon="mdi-close" @click="$emit('remove-target', idx)" />
        </v-btn>
      </template>
    </v-select>
    <v-btn
      v-if="aoe"
      size="x-small"
      block
      flat
      tile
      color="primary"
      class="ma-1"
      @click="$emit('add-target')">
      Add Target
    </v-btn>
  </v-col>
</template>

<script>
import { Damage } from '@/classes/Damage';

export default {
  name: 'BaseTargetSelector',
  props: {
    selectedTargets: { type: Array, required: true },
    targets: { type: Array, required: true },
    aoe: { type: [Boolean, String], required: true },
  },
  emits: ['toggle-aoe', 'add-target', 'remove-target'],
  computed: {
    filteredTargets() {
      return this.targets.filter((t) => !this.selectedTargets.includes(t));
    },
    aoeIcon() {
      let aoe = this.aoe;
      if (typeof aoe === 'boolean') {
        aoe = aoe ? 'true' : 'false';
      }
      return Damage.getAoeIcon(aoe);
    },
  },
};
</script>
