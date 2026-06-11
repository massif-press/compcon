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
          <div class="text-center text-cc-overline">{{ $t('ui.combat.cannotActivateShort') }}</div>
          <v-divider class="my-1" />
          <div v-if="customDisabledText"
            class="text-center">
            {{ customDisabledText }}
          </div>
          <slot v-else
            name="reason">
            <div class="text-center">{{ $t('ui.combat.cannotActivate') }}</div>
          </slot>
        </v-tooltip>
      </span>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  icon: string
  activation: string
  color?: string
  canActivate: boolean
  customDisabledText?: string
  spanClass?: string
}>(), {
  color: '',
  customDisabledText: '',
  spanClass: 'ml-1'
})
</script>
