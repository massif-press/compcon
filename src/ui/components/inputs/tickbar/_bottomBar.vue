<template>
  <div>
    <v-row no-gutters>
      <v-col cols="auto">
        <v-tooltip location="top" :text="label" :open-delay="400">
          <template #activator="{ props }">
            <div v-bind="props">
              <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    size="small"
                    tile
                    flat
                    :readonly="readonly"
                    class="d-block pl-5"
                    height="24px"
                    style="width: 158px"
                    :class="`bg-${bgColor}`">
                    <v-icon start :icon="icon" size="20" />
                    <span class="heading" style="font-size: 14px">{{ modelValue }}</span>
                  </v-btn>
                </template>
                <tickbar-menu
                  :icon="icon"
                  :label="label"
                  :editable="editable"
                  @set="setVal($event)"
                  @reset="$emit('reset')">
                  <v-text-field
                    v-model.number="internalValue"
                    variant="outlined"
                    type="number"
                    tile
                    hide-details
                    autofocus
                    density="compact"
                    @focus="$event.target.select()"
                    @update:model-value="setVal(Number($event))" />
                  <template #edit-max-value>
                    <v-text-field
                      :model-value.number="internalValue"
                      variant="outlined"
                      type="number"
                      tile
                      hide-details
                      autofocus
                      density="compact"
                      @focus="$event.target.select()"
                      @update:model-value="setVal(Number($event))" />
                  </template>
                </tickbar-menu>
              </v-menu>
            </div>
          </template>
        </v-tooltip>
      </v-col>

      <v-col class="ml-2">
        <div
          v-if="!ticks"
          class="ml-1"
          :class="`bg-${bgColor}`"
          style="height: 20px; width: 100%; margin-top: 4px" />

        <div
          v-else-if="ticks > tickThreshold"
          style="height: 20px; width: 100%; margin-top: 4px; margin-right: 4px"
          :style="pctBackground" />

        <div
          v-else-if="ticks"
          v-for="i in ticks"
          class="d-inline-block"
          :style="`width: ${100 / ticks}%;`">
          <v-tooltip location="top" :open-delay="400">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                tile
                flat
                :readonly="readonly || disabled || loading"
                @mouseover="hover = i"
                @mouseleave="hover = null"
                height="20px"
                style="width: calc(100% - 4px)"
                @click="setVal(i)"
                class="tick"
                :class="`${isHovered(i) && 'hovered'} ${isMouseovered(i) || (isActive(i) && 'highlighted')} ${isHovered(i) || isActive(i) ? `bg-${color}` : `bg-${bgColor}`}  px-0 `" />
            </template>
            <div class="heading h3 text-center">
              <div class="text-cc-overline text-disabled">{{ label }}</div>
              {{ i }}
            </div>
          </v-tooltip>
        </div>
      </v-col>

      <v-col cols="auto" class="ml-1">
        <div :class="`bg-${bgColor}`" style="height: 24px; width: 14px" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import TickbarMenu from './_tickbarMenu.vue';

export default {
  name: 'cc-tickbar',
  components: { TickbarMenu },
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
  data() {
    return {
      hover: null as number | null,
      internalValue: this.modelValue,
    };
  },
  emits: ['update:modelValue', 'reset'],
  watch: {
    modelValue(val) {
      this.internalValue = val;
    },
    internalValue(val) {
      this.$emit('update:modelValue', val);
    },
  },
  computed: {
    tickThreshold() {
      if (this.$vuetify.display.mdAndDown) return 1;
      if (this.$vuetify.display.lgAndDown) return 4;
      return 6;
    },
    pctBackground() {
      if (!this.ticks || this.ticks <= 0) return '';
      const pct = Math.round((this.modelValue / this.ticks) * 100);

      return `background: linear-gradient(45deg, rgb(var(--v-theme-${this.color})) ${pct}%, rgb(var(--v-theme-${this.bgColor})) ${pct}%)`;
    },
  },
  methods: {
    isHovered(i: number) {
      return this.hover && this.hover >= i;
    },
    isMouseovered(i: number) {
      return this.hover === i;
    },
    isActive(i: number) {
      return this.modelValue && this.modelValue >= i;
    },
    setVal(val: number) {
      if (this.stopAdd && val > this.modelValue) return;
      if (this.ticks && val > this.ticks) val = this.ticks;
      if (val < 0) val = 0;
      if (this.modelValue === 1 && val === 1) val = 0;
      this.$emit('update:modelValue', val);
    },
  },
};
</script>

<style scoped>
.tick {
  opacity: 0.3;
  transform: opacity 0.2s ease-in-out;
}

.hovered {
  opacity: 0.5;
}

.highlighted {
  opacity: 1;
  filter: saturate(200%);
}
</style>
