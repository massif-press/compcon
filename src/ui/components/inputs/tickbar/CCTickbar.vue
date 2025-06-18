<template>
  <div>
    <v-row no-gutters class="top-element" style="position: relative">
      <div
        v-if="label && !reverse"
        class="text-cc-overline"
        style="position: absolute; top: -16px; right: 0; opacity: 0.6"
      >
        {{ label }}
      </div>
      <v-col
        v-if="controls && !readonly"
        cols="auto"
        align-self="center"
        class="mr-2"
      >
        <v-btn
          icon
          variant="text"
          tile
          :size="optionsSize"
          @click="setVal(<number>modelValue - 1)"
        >
          <v-icon :size="optionsSize" icon="mdi-minus" />
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mr-n3">
        <span
          :class="`${reverse ? 'reverse-light' : 'light'} ${size} ${`bg-${color}`}`"
        />
        <v-menu v-if="tertiaryLabel" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              tile
              flat
              :readonly="readonly"
              class="d-block tertiary-clip"
              height="17px"
              style="width: calc(100% - 33px)"
              :class="`bg-${bgColor}`"
            >
              <v-icon start :icon="tertiaryIcon" size="15" />
              <span class="heading" style="font-size: 14px">{{
                tertiary
              }}</span>
            </v-btn>
          </template>
          <v-card tile width="150px" class="mt-n1 ml-6 pa-3" border>
            <div class="text-cc-overline mb-2">
              <v-icon start :icon="tertiaryIcon" />
              <span class="heading">{{ tertiaryLabel }}</span>
            </div>
            <v-text-field
              :model-value.number="tertiary"
              variant="outlined"
              type="number"
              tile
              hide-details
              autofocus
              density="compact"
              @focus="$event.target.select()"
              @update:tertiary="setTertiaryVal(Number($event))"
            />
            <p v-if="details" class="mt-2">{{ details }}</p>
          </v-card>
        </v-menu>
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              :size="size"
              tile
              flat
              :readonly="readonly"
              class="pl-4"
              :min-width="minWidth"
              :class="`bg-${bgColor} ${size} ${reverse ? 'reverse-btn-body-clip' : tertiaryLabel ? 'btn-body' : 'btn-body-clip'}`"
              v-bind="props"
            >
              <span class="pr-7 heading">
                <v-icon
                  v-if="icon"
                  :icon="icon"
                  :class="iconOffset"
                  class="mr-2"
                />
                <span v-if="display">
                  {{ modelValue }}
                  <div
                    v-if="size !== 'x-small'"
                    class="text-cc-overline d-inline-block ml-n2"
                    style="line-height: 0; opacity: 0.5"
                  >
                    /{{ ticks }}
                  </div>
                </span>
                <v-icon
                  v-else-if="!icon && !readonly"
                  icon="mdi-keyboard-variant"
                  :class="iconOffset"
                  size="small"
                  style="opacity: 0.3"
                />
              </span>
            </v-btn>
          </template>
          <v-card tile width="150px" class="mt-n1 ml-6 pa-3" border>
            <div class="text-cc-overline mb-2">
              <v-icon start :icon="icon" />
              <span class="heading">{{ primaryLabel }}</span>
            </div>
            <v-text-field
              :model-value.number="modelValue"
              variant="outlined"
              type="number"
              tile
              hide-details
              autofocus
              density="compact"
              @focus="$event.target.select()"
              @update:model-value="setVal(Number($event))"
            />
            <p v-if="details" class="mt-2">{{ details }}</p>
          </v-card>
        </v-menu>
        <v-menu v-if="secondaryLabel" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              tile
              flat
              :readonly="readonly"
              class="d-block"
              height="17px"
              style="width: 100%"
              :class="`bg-${bgColor}`"
            >
              <v-icon start :icon="secondaryIcon" size="15" />
              <span class="heading" style="font-size: 14px">{{
                secondary
              }}</span>
            </v-btn>
          </template>
          <v-card tile width="150px" class="mt-n1 ml-6 pa-3" border>
            <div class="text-cc-overline mb-2">
              <v-icon start :icon="secondaryIcon" />
              <span class="heading">{{ secondaryLabel }}</span>
            </div>
            <v-text-field
              :model-value.number="secondary"
              variant="outlined"
              type="number"
              tile
              hide-details
              autofocus
              density="compact"
              @focus="$event.target.select()"
              @update:tertiary="setSecondaryVal(Number($event))"
            />
          </v-card>
        </v-menu>
      </v-col>
      <v-col :class="space ? 'ml-5' : ''">
        <div
          v-if="tertiaryLabel && (tertiary || tertiaryTicks)"
          style="
            margin-left: -20px;
            padding-right: 22px;
            margin-top: -3px;
            margin-bottom: 4px;
          "
        >
          <v-row no-gutters>
            <v-col
              v-if="!tertiaryTicks"
              v-for="n in tertiary"
              :style="n - 1 === tertiary ? '' : 'margin-left: 6px'"
            >
              <div :class="`bg-${color}`" style="height: 12px" />
            </v-col>
            <v-col
              v-else
              v-for="n in tertiaryTicks"
              :style="n - 1 === tertiaryTicks ? '' : 'margin-left: 6px'"
            >
              <v-btn
                :class="n <= tertiary ? `bg-${tertiaryColor}` : `bg-${bgColor}`"
                flat
                tile
                class="mt-1 pa-0 d-block"
                style="height: 13px; width: 100%"
                @click="setTertiaryVal(n)"
              />
            </v-col>
          </v-row>
        </div>
        <div
          v-else-if="tertiaryLabel"
          style="
            margin-left: -20px;
            padding-right: 22px;
            margin-top: -3px;
            margin-bottom: 4px;
          "
        >
          <div
            :class="`bg-${bgColor}`"
            class="mt-1"
            style="height: 12px; margin-left: 6px"
          />
        </div>
        <div :class="reverse && modelValue > 9 && 'ml-n4'">
          <div
            v-for="i in ticks"
            class="d-inline-block"
            :style="`width: ${100 / ticks}%; ${ticks < 30 ? 'min-width: 7px;' : ''}`"
          >
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
                  @mouseover="hover = i"
                  @mouseleave="hover = null"
                  style="width: calc(100% - 6px)"
                  @click="setVal(i)"
                  class="tick"
                  :class="`${isHovered(i) && 'hovered'} ${isMouseovered(i) || (isActive(i) && 'highlighted')} ${isHovered(i) || isActive(i) ? `bg-${color}` : `bg-${bgColor}`} ${reverse ? 'reverse' : 'angled'} ${size} px-0 `"
                />
              </template>
              <span class="heading h3">{{ i }}</span>
            </v-tooltip>
          </div>
        </div>
        <div
          v-if="secondaryLabel"
          style="padding-left: 15px; margin-right: -18px"
        >
          <v-row no-gutters>
            <v-col
              v-for="n in secondaryTicks"
              class="mt-1"
              :style="n - 1 === secondaryTicks ? '' : 'margin-left: 6px'"
            >
              <v-btn
                :class="`bg-${n - 1 < secondary ? secondaryColor : bgColor}`"
                flat
                tile
                class="pa-0 d-block"
                style="height: 12px; width: 100%"
                @click="setSecondaryVal(n)"
              />
            </v-col>
          </v-row>
        </div>
      </v-col>

      <v-col cols="auto" :class="tertiaryLabel && 'ml-n1'">
        <div
          v-if="tertiaryLabel"
          :class="`bg-${bgColor}`"
          style="height: 12px; width: 47px; margin-top: 1px; margin-left: -11px"
        />
        <div
          class="ml-4 end-cap"
          :class="`bg-${bgColor} ${size}`"
          :style="
            reverse
              ? `clip-path: polygon(70% 0, 100% 0, 100% 100%, 4px 100%)`
              : `clip-path: polygon(10% 0%, 100% 0%, 100% 100%, ${angle} 100%)`
          "
        >
          &nbsp;
        </div>
        <div
          v-if="secondaryLabel"
          :class="`bg-${bgColor}`"
          :style="!tertiaryLabel ? 'margin-top: -4px' : ''"
          style="height: 12px; width: 8px; margin-left: 28px"
        />
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
              v-bind="props"
            >
              <v-icon :icon="optionsIcon || 'mdi-dots-vertical'" />
            </v-btn>
          </template>
          <slot name="options" />
        </v-menu>
      </v-col>
      <v-col cols="auto">
        <div :class="`bg-${color} tail`" />
      </v-col>
      <v-col
        v-if="controls && !readonly"
        cols="auto"
        align-self="center"
        class="ml-1"
      >
        <v-btn
          icon
          variant="text"
          tile
          :size="optionsSize"
          @click="setVal(<number>modelValue + 1)"
        >
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
              :icon="tooltipIcon || 'mdi-information-slab-box-outline'"
            />
          </template>
          {{ tooltip }}
        </v-tooltip>
      </v-col>
    </v-row>
    <div
      v-if="label && reverse"
      class="text-cc-overline text-right"
      style="opacity: 0.6"
    >
      {{ label }}
    </div>
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
    maxSelectable: { type: Number },
    readonly: { type: Boolean },
    reverse: { type: Boolean, default: false },
    minWidth: { type: String },
    space: { type: Boolean, default: false },
    primaryLabel: { type: String },
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
    pctBackground() {
      const pct = Math.round((this.modelValue / this.ticks) * 100);

      return `linear-gradient(to right, rgb(var(--v-theme-${this.color})) ${pct}%, rgb(var(--v-theme-${this.bgColor})) ${pct}%)`;
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
      if (this.modelValue === 1 && val === 1) val = 0;
      this.$emit('update:model-value', val);
    },
    setTertiaryVal(val: number) {
      if (this.stopAdd && val > this.tertiary) return;
      if (this.tertiaryTicks && val > this.tertiaryTicks)
        val = this.tertiaryTicks;
      if (val < 0) val = 0;
      if (this.tertiary === 1 && val === 1) val = 0;
      this.$emit('update:tertiary', val);
    },
    setSecondaryVal(val: number) {
      if (this.stopAdd && val > this.secondary) return;
      if (this.secondaryTicks && val > this.secondaryTicks)
        val = this.secondaryTicks;
      if (val < 0) val = 0;
      if (this.secondary === 1 && val === 1) val = 0;
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
}
.reverse-light {
  bottom: 0px;
  position: absolute;
  clip-path: polygon(50% 100%, 0 50%, 0 0, 100% 100%);

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
  clip-path: polygon(
    0 0,
    100% 0,
    calc(100% - 33px) 100%,
    16px 100%,
    0 calc(100% - 16px)
  );
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
