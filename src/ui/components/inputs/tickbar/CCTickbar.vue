<template>
  <div style="width: fit-content">
    <v-row no-gutters class="top-element" style="position: relative">
      <div
        v-if="label"
        class="text-cc-overline"
        style="position: absolute; top: -16px; right: 0; opacity: 0.6">
        {{ label }}
      </div>
      <v-col v-if="controls && !readonly" cols="auto" align-self="center" class="mr-2">
        <v-btn icon variant="text" tile :size="optionsSize" @click="setVal(<number>modelValue - 1)">
          <v-icon :size="optionsSize" icon="mdi-minus" />
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <span :class="`light ${size} ${`bg-${color}`}`" />
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              :size="size"
              tile
              flat
              :readonly="readonly"
              class="pl-4 btn-body"
              :class="`bg-${bgColor} ${size}`"
              v-bind="props">
              <span class="pr-7 heading">
                <v-icon v-if="icon" :icon="icon" :class="iconOffset" class="mr-2" />
                <span v-if="display">
                  {{ modelValue }}
                  <div
                    v-if="size !== 'x-small'"
                    class="text-cc-overline d-inline-block ml-n2"
                    style="line-height: 0; opacity: 0.5">
                    /{{ ticks }}
                  </div>
                </span>
                <v-icon
                  v-else-if="!icon && !readonly"
                  icon="mdi-keyboard-variant"
                  :class="iconOffset"
                  size="small"
                  style="opacity: 0.3" />
              </span>
            </v-btn>
          </template>
          <v-card tile width="150px" class="mt-n1 ml-6 pa-3" border>
            <v-text-field
              :model-value.number="modelValue"
              variant="outlined"
              type="number"
              tile
              hide-details
              autofocus
              density="compact"
              @focus="$event.target.select()"
              @update:model-value="setVal(Number($event))" />
            <p v-if="details" class="mt-2">{{ details }}</p>
          </v-card>
        </v-menu>
      </v-col>
      <v-col cols="auto">
        <div class="mr-1 d-inline-block" style="height: 100%" v-for="i in ticks">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="valueTooltips ? props : ''"
                tile
                flat
                :readonly="
                  readonly ||
                  disabled ||
                  loading ||
                  (!!maxSelectable && modelValue + i - 1 >= maxSelectable)
                "
                :size="size"
                @mouseover="hover = i"
                @mouseleave="hover = null"
                @click="setVal(i)"
                class="tick"
                :class="`${isHovered(i) && 'hovered'} ${isMouseovered(i) || (isActive(i) && 'highlighted')} ${isHovered(i) || isActive(i) ? `bg-${color}` : `bg-${bgColor}`} angled ${size} px-0 `" />
            </template>
            <span class="heading h3">{{ i }}</span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col cols="auto">
        <div class="ml-4 end-cap" :class="`bg-${bgColor} ${size}`">&nbsp;</div>
      </v-col>
      <v-col cols="auto" v-if="$slots.options">
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn
              :size="optionsSize"
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
      <v-col v-if="controls && !readonly" cols="auto" align-self="center" class="ml-1">
        <v-btn icon variant="text" tile :size="optionsSize" @click="setVal(<number>modelValue + 1)">
          <v-icon :size="optionsSize" icon="mdi-plus" />
        </v-btn>
      </v-col>
      <v-col v-if="clearable" cols="auto" align-self="center">
        <v-btn icon variant="text" tile size="x-small" @click="setVal(0)">
          <v-icon size="x-large" icon="mdi-close-circle-outline" />
        </v-btn>
      </v-col>
      <v-col cols="auto" v-if="tooltip" align-self="center">
        <v-tooltip location="top" max-width="300px">
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              class="fade-select mx-1"
              :icon="tooltipIcon || 'mdi-information-slab-box-outline'" />
          </template>
          {{ tooltip }}
        </v-tooltip>
      </v-col>
    </v-row>
    <v-slide-y-transition>
      <div v-if="details" class="text-right text-caption">
        {{ details }}
      </div>
    </v-slide-y-transition>
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-tickbar',
  props: {
    modelValue: { type: Number, default: 0 },
    label: { type: String },
    color: { type: String, default: 'primary' },
    bgColor: { type: String, default: 'panel' },
    disabled: { type: Boolean },
    loading: { type: Boolean },
    size: { type: String, default: 'default' },
    variant: { type: String },
    icon: { type: String },
    tooltip: { type: String },
    tooltipIcon: { type: String },
    ticks: { type: Number, default: 6 },
    optionsIcon: { type: String, default: 'mdi-dots-vertical' },
    details: { type: String },
    controls: { type: Boolean },
    clearable: { type: Boolean },
    display: { type: Boolean, default: true },
    valueTooltips: { type: Boolean, default: false },
    stopAdd: { type: Boolean },
    maxSelectable: { type: Number },
    readonly: { type: Boolean },
  },
  data: () => ({
    hover: null as number | null,
  }),
  computed: {
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
      if (val > this.ticks) val = this.ticks;
      if (val < 0) val = 0;
      this.$emit('update:model-value', val);
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

.btn-body.default {
  clip-path: polygon(16px 0, calc(100% - 33px) 0, 100% 100%, 0 100%, 0 16px);
  font-size: 1.75rem;
  margin-right: -20px !important;
  padding-left: 22px !important;
  padding-right: 12px !important;
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
  transform: skew(42deg);
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
  width: 20px !important;
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
  clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 35px 100%);
  height: 100%;
  width: 40px;
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
