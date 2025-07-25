<template>
  <div>
    <v-row no-gutters>
      <v-col cols="auto">
        <v-tooltip location="top" :text="label" :open-delay="400">
          <template #activator="{ props }">
            <div v-bind="props">
              <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                  <!-- activator button -->
                  <v-btn
                    v-bind="props"
                    size="small"
                    tile
                    flat
                    :readonly="readonly"
                    class="d-block modelValue-clip pl-5"
                    height="24px"
                    width="125px"
                    :class="`bg-${bgColor}`">
                    <v-icon start :icon="icon" size="20" />
                    <span v-if="valueAtlas?.length" class="heading" style="font-size: 14px">
                      {{ valueAtlas[modelValue] }}
                    </span>
                    <span v-else class="heading" style="font-size: 14px">{{ modelValue }}</span>
                  </v-btn>
                </template>

                <!-- menu content -->
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

      <!-- bar content -->
      <v-col class="ml-1">
        <div
          v-if="!ticks && !modelValue"
          class="ml-1"
          :class="`bg-${bgColor}`"
          style="height: 20px; width: 100%; margin-bottom: 4px" />

        <v-tooltip v-else-if="!ticks && modelValue" location="top" :open-delay="400">
          <template #activator="{ props }">
            <div
              style="
                display: flex;
                justify-content: space-between;
                height: 20px;
                width: 100%;
                margin-bottom: 4px;
              ">
              <v-btn
                v-for="i in modelValue"
                v-bind="props"
                tile
                flat
                class="pa-0 ml-1"
                @mouseover="hover = i"
                @mouseleave="hover = null"
                :readonly="readonly || disabled || loading"
                :class="`${isHovered(i) && 'hovered'} ${isMouseovered(i) || (isActive(i) && 'highlighted')} ${isHovered(i) || isActive(i) ? `bg-${color}` : `bg-${bgColor}`}`"
                style="height: 20px; min-width: 0 !important"
                :style="`width: calc(calc(100% / ${modelValue}) - 4px)`"
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

        <div
          v-else-if="ticks && ticks > tickThreshold"
          style="height: 20px; width: 100%; margin-bottom: 4px; margin-right: 4px"
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
                style="width: calc(100% - 4px); margin-top: -5px"
                @click="setVal(i)"
                class="tick"
                :class="`${isHovered(i) && 'hovered'} ${isMouseovered(i) || (isActive(i) && 'highlighted')} ${isHovered(i) || isActive(i) ? `bg-${color}` : `bg-${bgColor}`}  px-0 `" />
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
      </v-col>

      <v-col cols="auto" style="width: 48px; margin-left: 10px">
        <div :class="`bg-${bgColor}`" style="height: 24px" />
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
.modelValue-clip {
  clip-path: polygon(17px 0, 100% 0, 100% 100%, 0 100%, 0 17px);
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

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
