<template>
  <v-tooltip location="top"
    :text="activation">
    <template #activator="{ props }">
      <span v-bind="props"
        :class="spanClass">
        <v-icon v-bind="props"
          :icon="icon"
          :color="canActivate ? 'success' : 'error'" />
        <v-tooltip v-if="!canActivate"
          location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              icon="mdi-exclamation-thick"
              color="error" />
          </template>
          <div class="text-center text-cc-overline">Cannot activate</div>
          <v-divider class="my-1" />
          <div v-if="customDisabledText"
            class="text-center">
            {{ customDisabledText }}
          </div>
          <slot v-else
            name="reason">
            <div class="text-center">Cannot activate.</div>
          </slot>
        </v-tooltip>
      </span>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'CombatActionIndicator',
  props: {
    icon: { type: String, required: true },
    activation: { type: String, required: true },
    color: { type: String, default: '' },
    canActivate: { type: Boolean, required: true },
    customDisabledText: { type: String, default: '' },
    spanClass: { type: String, default: 'ml-1' },
  },
};
</script>
