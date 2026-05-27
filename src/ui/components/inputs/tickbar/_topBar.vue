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
          :value-atlas="valueAtlas"
          width="125px"
          clip
          @set="setVal($event)"
          @reset="$emit('reset')">
          <template #menu-content>
            <slot name="menu-content" />
          </template>
        </tickbar-activator>
      </v-col>

      <!-- bar content -->
      <v-col class="ml-1">
        <div v-if="!ticks && !modelValue"
          class="ml-1"
          :class="`bg-${bgColor}`"
          style="height: 20px; width: 100%; margin-bottom: 4px" />

        <v-tooltip v-else-if="!ticks && modelValue"
          location="top"
          :open-delay="400">
          <template #activator="{ props }">
            <div style="
                display: flex;
                justify-content: space-between;
                height: 20px;
                width: 100%;
                margin-bottom: 4px;
              ">
              <v-btn v-for="i in modelValue"
                :key="`tick-${i}`"
                v-bind="props"
                tile
                flat
                class="pa-0 ml-1"
                :readonly="readonly || disabled || loading"
                :class="`${isHovered(i) && 'hovered'} ${isMouseovered(i) || (isActive(i) && 'highlighted')} ${isHovered(i) || isActive(i) ? `bg-${color}` : `bg-${bgColor}`}`"
                style="height: 20px; min-width: 0 !important"
                :style="`width: calc(calc(100% / ${modelValue}) - 4px)`"
                @mouseover="hover = i"
                @mouseleave="hover = null"
                @click="setVal(i)" />
            </div>
          </template>
          <div class="heading h3 text-center">
            <div class="text-cc-overline text-disabled">{{ label }}</div>
            <span v-if="valueAtlas?.length">
              {{ valueAtlas[modelValue] }}
            </span>
            <span v-else>
              {{ modelValue }}
            </span>
          </div>
        </v-tooltip>

        <div v-else-if="ticks && ticks > tickThreshold"
          style="height: 20px; width: 100%; margin-bottom: 4px; margin-right: 4px"
          :style="pctBackground" />

        <div v-else-if="ticks">
          <div v-for="i in ticks"
            :key="`tick-${i}`"
            class="d-inline-block pl-1"
            :style="`width: ${100 / ticks}%;`">
            <v-tooltip location="top"
              :open-delay="400">
              <template #activator="{ props }">
                <v-btn v-bind="props"
                  tile
                  flat
                  :readonly="readonly || disabled || loading"
                  height="20px"
                  style="width: 100%; margin-top: -5px"
                  class="tick"
                  :class="`${isHovered(i) && 'hovered'} ${isMouseovered(i) || (isActive(i) && 'highlighted')} ${isHovered(i) || isActive(i) ? `bg-${color}` : `bg-${bgColor}`}`"
                  @mouseover="hover = i"
                  @mouseleave="hover = null"
                  @click="setVal(i)" />
              </template>
              <div class="heading h3 text-center">
                <div class="text-cc-overline text-disabled">{{ label }}</div>
                <span v-if="valueAtlas?.length">
                  {{ valueAtlas[i] }}
                </span>
                <span v-else>
                  {{ i }}
                </span>
              </div>
            </v-tooltip>
          </div>
        </div>
      </v-col>

      <v-col cols="auto"
        style="width: 48px; margin-left: 10px">
        <div :class="`bg-${bgColor}`"
          style="height: 24px" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import TickbarActivator from './_TickbarActivator.vue';
import { tickbarMixin } from './_tickbarMixin';

export default {
  name: 'CcTickbarTop',
  components: { TickbarActivator },
  mixins: [tickbarMixin],
  props: {
    modelValue: { type: Number, default: 0 },
    label: { type: String, required: true },
    color: { type: String, default: 'accent' },
    bgColor: { type: String, default: 'panel' },
    disabled: { type: Boolean },
    loading: { type: Boolean },
    icon: { type: String },
    ticks: { type: Number, required: false },
    stopAdd: { type: Boolean },
    readonly: { type: Boolean },
    editable: { type: Boolean, default: false },
    valueAtlas: { type: Array, required: false },
  },
  emits: ['update:modelValue', 'reset'],
};
</script>

<style scoped>
@import './tickbar.css';

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}
</style>
