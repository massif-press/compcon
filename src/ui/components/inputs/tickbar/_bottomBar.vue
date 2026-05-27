<template>
  <div>
    <v-row no-gutters>
      <v-col cols="auto">
        <tickbar-activator :label="label"
          :icon="icon"
          :readonly="readonly"
          :bg-color="bgColor"
          :editable="editable"
          :model-value="modelValue"
          :internal-value="internalValue"
          width="158px"
          @set="setVal($event)"
          @reset="$emit('reset')" />
      </v-col>

      <v-col class="ml-2">
        <div v-if="!ticks"
          class="ml-1"
          :class="`bg-${bgColor}`"
          style="height: 20px; width: 100%; margin-top: 4px" />

        <div v-else-if="ticks > tickThreshold"
          style="height: 20px; width: 100%; margin-top: 4px; margin-right: 4px"
          :style="pctBackground" />

        <div v-for="i in ticks"
          :key="`tick-${i}`"
          v-else-if="ticks"
          class="d-inline-block"
          :style="`width: ${100 / ticks}%;`">
          <v-tooltip location="top"
            :open-delay="400">
            <template #activator="{ props }">
              <v-btn v-bind="props"
                tile
                flat
                :readonly="readonly || disabled || loading"
                height="20px"
                style="width: calc(100% - 4px)"
                class="tick"
                :class="`${isHovered(i) && 'hovered'} ${isMouseovered(i) || (isActive(i) && 'highlighted')} ${isHovered(i) || isActive(i) ? `bg-${color}` : `bg-${bgColor}`}  px-0 `"
                @mouseover="hover = i"
                @mouseleave="hover = null"
                @click="setVal(i)" />
            </template>
            <div class="heading h3 text-center">
              <div class="text-cc-overline text-disabled">{{ label }}</div>
              {{ i }}
            </div>
          </v-tooltip>
        </div>
      </v-col>

      <v-col cols="auto"
        class="ml-1">
        <div :class="`bg-${bgColor}`"
          style="height: 24px; width: 14px" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import TickbarActivator from './_TickbarActivator.vue';
import { tickbarMixin } from './_tickbarMixin';

export default {
  name: 'CcTickbarBottom',
  components: { TickbarActivator },
  mixins: [tickbarMixin],
  props: {
    modelValue: { type: Number, default: 0 },
    label: { type: String },
    color: { type: String, default: 'secondary' },
    bgColor: { type: String, default: 'panel' },
    disabled: { type: Boolean },
    icon: { type: String },
    ticks: { type: Number, required: false },
    stopAdd: { type: Boolean },
    readonly: { type: Boolean },
    editable: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'reset'],
};
</script>

<style scoped>
@import './tickbar.css';
</style>
