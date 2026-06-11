<template>
  <div class="text-center">
    <v-btn :color="usable ? 'grey darken-2' : action.Color"
      block
      :small="$vuetify.display.mdAndDown"
      :disabled="disabled"
      @click="($refs.dialog as any).show()">
      <v-icon v-if="!noAction || hideIcon"
        dark
        left
        :icon="action.Icon" />
      {{ action.Name }}
      <v-menu v-if="!noAction"
        offset-y
        max-width="700px">
        <template #activator="{ props }">
          <v-btn right
            icon
            v-bind="props">
            <v-icon variant="plain"
              icon="mdi-information-outline" />
          </v-btn>
        </template>
        <v-card>
          <div class="heading h3 ma-1 pl-3">
            {{ action.Name.toUpperCase() }} &mdash; {{ action.Activation.toUpperCase() }} {{ $t('ui.action.actionSuffix') }}
          </div>
          <v-divider v-if="action.Detail || displayFreq" />
          <v-card-text v-if="displayFreq"
            v-html-safe="action.Frequency.ToString()"
            class="body-text text-text mt-0 pt-1" />
          <v-card-text v-if="action.Detail"
            v-html-safe="byTier(action.Detail)"
            class="body-text text-text mt-0 pt-1" />
        </v-card>
      </v-menu>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ByTier } from '@/util/tierFormat';
import { ActivationType } from '@/classes/enums';
import type { Action } from '@/classes/Action'
import type { Pilot } from '@/classes/pilot/Pilot'

const props = withDefaults(defineProps<{
  action: Action
  activations?: number
  disabled?: boolean
  unusable?: boolean
  noAction?: boolean
  pilot?: Pilot
  tier?: number
  hideIcon?: boolean
}>(), {
  activations: 2,
})

const emit = defineEmits<{ use: []; undo: [] }>()

const cost = computed(() => {
  if (props.action.Activation === ActivationType.Quick) return 1;
  else if (props.action.Activation === ActivationType.Full) return 2;
  return 0;
})

const usable = computed(() => {
  return props.unusable || props.action.Used || props.activations < cost.value;
})

const displayFreq = computed(() => {
  return props.action.Frequency.ToString() !== 'Unlimited';
})

function byTier(value: string) {
  return ByTier(value, props.tier);
}
</script>
