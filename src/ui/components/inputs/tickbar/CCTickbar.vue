<template>
  <div>
    <v-row no-gutters
      class="top-element"
      style="position: relative">
      <v-col v-if="controls && !readonly"
        cols="auto"
        align-self="center"
        class="mr-2">
        <v-btn icon
          variant="text"
          tile
          :size="optionsSize"
          @click="setVal(Number(modelValue) - 1)">
          <v-icon :size="optionsSize"
            icon="mdi-minus" />
        </v-btn>
      </v-col>
      <v-col>
        <div :class="`${reverse ? 'reverse-light' : 'light'} ${`bg-${color}`}`" />
        <top-bar v-if="tertiaryLabel"
          :label="tertiaryLabel"
          :icon="tertiaryIcon"
          :editable="editable"
          :readonly="readonly"
          :bgColor="bgColor"
          :modelValue="tertiary"
          @update:modelValue="(val) => setTertiaryVal(val)"
          :ticks="tertiaryTicks"
          :color="tertiaryColor"
          :value-atlas="valueAtlas">
          <template #menu-content>
            <slot name="top-menu" />
          </template>
        </top-bar>
        <center-bar :no-clip="!!tertiaryLabel"
          :label="primaryLabel"
          :icon="icon"
          :editable="editable"
          :readonly="readonly"
          :bgColor="bgColor"
          :modelValue="modelValue"
          @update:modelValue="(val) => setVal(val)"
          :ticks="ticks"
          :color="color"
          :reverse="reverse">
          <slot name="middle-menu" />
        </center-bar>
        <bottom-bar v-if="secondaryLabel"
          :label="secondaryLabel"
          :icon="secondaryIcon"
          :editable="editable"
          :readonly="readonly"
          :bgColor="bgColor"
          :modelValue="secondary"
          @update:modelValue="(val) => setSecondaryVal(val)"
          :ticks="secondaryTicks"
          :color="secondaryColor">
          <slot name="bottom-menu" />
        </bottom-bar>
      </v-col>

      <v-col cols="auto"
        v-if="$slots.options">
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn :size="optionsSize"
              :color="bgColor"
              icon
              tile
              flat
              class="pa-0 ml-n1"
              v-bind="props">
              <v-icon :icon="optionsIcon || 'mdi-dots-vertical'" />
            </v-btn>
          </template>
          <slot name="options" />
        </v-menu>
      </v-col>
      <v-col cols="auto">
        <div :class="`bg-${color} tail`" />
      </v-col>
      <v-col v-if="controls && !readonly"
        cols="auto"
        align-self="center"
        class="ml-1">
        <v-btn icon
          variant="text"
          tile
          :size="optionsSize"
          @click="setVal(Number(modelValue) + 1)">
          <v-icon :size="optionsSize"
            icon="mdi-plus" />
        </v-btn>
      </v-col>
      <v-col v-if="clearable"
        cols="auto"
        align-self="center">
        <v-btn icon
          variant="text"
          tile
          size="x-small"
          @click="setVal(0)">
          <v-icon size="x-large"
            icon="mdi-close-circle-outline" />
        </v-btn>
      </v-col>
      <v-col cols="auto"
        v-if="tooltip"
        align-self="center">
        <v-tooltip location="top"
          max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              class="fade-select mx-1"
              :icon="tooltipIcon || 'mdi-information-slab-box-outline'" />
          </template>
          {{ tooltip }}
        </v-tooltip>
      </v-col>
    </v-row>
    <div v-if="label && reverse"
      class="text-cc-overline text-right"
      style="opacity: 0.6">
      {{ label }}
    </div>
    <v-slide-y-transition>
      <div v-if="details"
        class="text-right text-caption">
        {{ details }}
      </div>
    </v-slide-y-transition>
  </div>
</template>

<script lang="ts">
import BottomBar from './_bottomBar.vue';
import CenterBar from './_centerBar.vue';
import TopBar from './_topBar.vue';

export default {
  name: 'cc-tickbar',
  components: {
    TopBar,
    BottomBar,
    CenterBar,
  },
  props: {
    modelValue: { type: Number, default: 0 },
    secondary: { type: Number, default: 0 },
    tertiary: { type: Number, default: 0 },
    label: { type: String },
    secondaryLabel: { type: String },
    tertiaryLabel: { type: String },
    color: { type: String, default: 'primary' },
    secondaryColor: { type: String, default: 'secondary' },
    tertiaryColor: { type: String, default: 'accent' },
    bgColor: { type: String, default: 'panel' },
    disabled: { type: Boolean },
    loading: { type: Boolean },
    size: { type: String, default: 'default' },
    variant: { type: String },
    icon: { type: String },
    secondaryIcon: { type: String },
    tertiaryIcon: { type: String },
    tooltip: { type: String },
    tooltipIcon: { type: String },
    ticks: { type: Number, default: 6 },
    secondaryTicks: { type: Number, required: false },
    tertiaryTicks: { type: Number, required: false },
    optionsIcon: { type: String, default: 'mdi-dots-vertical' },
    details: { type: String },
    controls: { type: Boolean },
    clearable: { type: Boolean },
    display: { type: Boolean, default: true },
    valueTooltips: { type: Boolean, default: false },
    stopAdd: { type: Boolean },
    max: { type: Number },
    readonly: { type: Boolean },
    reverse: { type: Boolean, default: false },
    minWidth: { type: String },
    space: { type: Boolean, default: false },
    primaryLabel: { type: String },
    editable: { type: Boolean, default: false },
    valueAtlas: { type: Array },
  },
  data: () => ({
    hover: null as number | null,
  }),
  computed: {
    angle() {
      if (this.tertiaryLabel) return '45px';
      if (this.secondaryLabel) return '44px';
      return '38px';
    },
    iconOffset() {
      if (this.size === 'x-large') return this.icon && 'mt-n2';
      return this.icon && 'mt-n1';
    },
    optionsSize() {
      switch (this.size) {
        case 'x-small':
          return '20px';
        case 'small':
          return '28px';
        case 'default':
          return '36px';
        case 'large':
          return '44px';
        case 'x-large':
          return '52px';
      }
    },
  },
  methods: {
    setVal(val: number) {
      if (val < 0) val = 0
      if (val > Math.min(this.max || 100, this.ticks)) val = Math.min(this.max || 100, this.ticks)
      this.$emit('update:model-value', val);
    },
    setTertiaryVal(val: number) {
      if (val < 0) val = 0
      if (val > Math.min(this.max || 100, this.ticks)) val = Math.min(this.max || 100, this.tertiaryTicks || 100)
      this.$emit('update:tertiary', val);
    },
    setSecondaryVal(val: number) {
      if (val < 0) val = 0
      if (val > Math.min(this.max || 100, this.ticks)) val = Math.min(this.max || 100, this.secondaryTicks || 100)
      this.$emit('update:secondary', val);
    },
  },
};
</script>

<style scoped>
.v-btn {
  position: relative;
}

.offset {
  margin-top: -10px;
}

.light {
  top: 0px;
  position: absolute;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  border-top-left-radius: 1px;
  transition: filter 0.2s ease-in-out;
  width: 13px;
  height: 13px;
  z-index: 3;
}

.reverse-light {
  bottom: 0px;
  position: absolute;
  clip-path: polygon(50% 100%, 0 50%, 0 0, 100% 100%);

  border-top-left-radius: 1px;
  transition: filter 0.2s ease-in-out;
  width: 13px;
  height: 13px;
  z-index: 3;
}

.light.x-small {
  top: 1px;
  width: 8px;
  height: 8px;
}

.light.small {
  width: 12px;
  height: 12px;
}

.light.default {
  width: 13.5px;
  height: 13.5px;
}

.reverse-light.default {
  width: 13.5px;
  height: 13.5px;
}

.light.large {
  width: 17px;
  height: 17px;
}

.light.x-large {
  width: 21px;
  height: 21px;
}

.btn-body.x-small {
  clip-path: polygon(10px 0, calc(100% - 18px) 0, 100% 100%, 0 100%, 0 10px);
  font-size: 0.9rem;
  margin-right: -8px !important;
  padding-left: 12px !important;
  padding-right: 0px !important;
}

.btn-body.small {
  clip-path: polygon(16px 0, calc(100% - 26px) 0, 100% 100%, 0 100%, 0 16px);
  font-size: 1.3rem;
  margin-right: -14px !important;
  padding-left: 20px !important;
  padding-right: 4px !important;
}

.tertiary-clip {
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
}

.btn-body.default {
  clip-path: polygon(0px 0, calc(100% - 33px) 0, 100% 100%, 0 100%, 0 16px);
  /* clip-path: polygon(16px 0, calc(100% - 33px) 0, 100% 100%, 0 100%, 0 16px); */
  font-size: 1.75rem;
  margin-right: -20px !important;
  padding-left: 22px !important;
  padding-right: 12px !important;
}

.btn-body-clip.default {
  /* clip-path: polygon(0px 0, calc(100% - 33px) 0, 100% 100%, 0 100%, 0 16px); */
  clip-path: polygon(16px 0, calc(100% - 33px) 0, 100% 100%, 0 100%, 0 16px);
  font-size: 1.75rem;
  margin-right: -20px !important;
  padding-left: 22px !important;
  padding-right: 12px !important;
}

.reverse-btn-body-clip.default {
  clip-path: polygon(0 0, 100% 0, calc(100% - 33px) 100%, 16px 100%, 0 calc(100% - 16px));
  font-size: 1.75rem;
  margin-right: -20px !important;
  padding-left: 22px !important;
  padding-right: 12px !important;
  min-width: 150px !important;
}

.btn-body.large {
  clip-path: polygon(20px 0, calc(100% - 40px) 0, 100% 100%, 0 100%, 0 20px);
  font-size: 2.2rem;
  margin-right: -24px !important;
  padding-left: 28px !important;
  padding-right: 22px !important;
}

.btn-body.x-large {
  clip-path: polygon(24px 0, calc(100% - 47px) 0, 100% 100%, 0 100%, 0 24px);
  margin-right: -30px !important;
  z-index: 2;
  font-size: 2.8rem;
  padding-left: 36px !important;
  padding-right: 34px !important;
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.top-element:hover .reverse-light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.tail {
  display: inline-block;
  width: 3px;
  height: 100%;
  margin-left: 3px;
  z-index: 1;
  transition: all 0.2s ease-in-out;
}

.top-element:hover .tail {
  opacity: 1;
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.angled {
  min-width: 0px !important;
  transform: skew(42deg) translateZ(0);

  backface-visibility: hidden;

  filter: blur(0.5px);
}

.reverse {
  min-width: 0px !important;
  transform: skew(-42deg) translateZ(0);

  backface-visibility: hidden;

  filter: blur(0.5px);
}

.angled.x-small {
  width: 10px !important;
  margin: 0 2px 0 2px;
}

.angled.small {
  width: 16px !important;
  margin: 0 2px 0 2px;
}

.angled.default {
  margin: 0 4px 0 4px;
}

.angled.large {
  width: 24px !important;
  margin: 0 4px 0 4px;
}

.angled.x-large {
  width: 30px !important;
  margin: 0 4px 0 4px;
}

.end-cap.x-small {
  clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 22px 100%);
  height: 100%;
  width: 30px;
  margin-left: -12px !important;
}

.end-cap.small {
  clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 29px 100%);
  height: 100%;
  width: 35px;
  margin-left: -14px !important;
}

.end-cap.default {
  height: 100%;
  max-height: 44px;
  width: 52px;
  margin-left: -16px !important;
}

.end-cap.large {
  clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 45px 100%);
  height: 100%;
  width: 50px;
  margin-left: -22px !important;
}

.end-cap.x-large {
  clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 53px 100%);
  height: 100%;
  width: 60px;
  margin-left: -25px !important;
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
