<template>
  <div>
    <v-hover #default="{ isHovering, props }">
      <div class="top-element" v-bind="props">
        <v-textarea
          :model-value="modelValue"
          :color="color"
          :base-color="color"
          :variant="<any>variant"
          :loading="loading"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          :clearable="clearable"
          elevation="0"
          auto-grow
          :rows="3"
          clear-icon="mdi-close-circle-outline"
          density="compact"
          hide-details
          rounded="0"
          :bg-color="isFocused ? 'surface-variant' : 'panel'"
          style="position: relative"
          @update:model-value="$emit('update:model-value', $event)">
          <template #prepend>
            <div v-if="label">
              <div
                class="text-cc-overline"
                style="
                  position: absolute;
                  top: 2px;
                  z-index: 1;
                  font-size: 0.7rem !important;
                  opacity: 0.5;
                "
                :style="`left: ${icon ? '38px' : '22px'}`">
                {{ label }}
                <cc-slashes />
              </div>
            </div>

            <div
              :class="`prepend bg-${color} ${isFocused && 'color-rotate'}  pt-1`"
              :style="`min-width: ${icon ? '30' : '16'}px`">
              <v-icon v-if="icon" :icon="icon" />
            </div>
          </template>
          <template v-if="prependInnerIcon" #prepend-inner>
            <v-icon :icon="prependInnerIcon" />
          </template>
          <template #append>
            <div
              :class="`bg-${color} ${(isHovering || isFocused) && 'color-rotate'}`"
              style="
                transition: filter 0.2s ease-in-out;
                width: 3px;
                height: calc(100% + 8px);
                margin-top: -8px;
                margin-left: 4px;
                z-index: 1;
              " />
            <v-tooltip v-if="tooltip" location="top" max-width="300px">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  class="fade-select mx-1"
                  :icon="tooltipIcon || 'mdi-information-slab-box-outline'" />
              </template>
              {{ tooltip }}
            </v-tooltip>
          </template>
          <template v-if="appendInnerIcon" #append-inner>
            <v-icon :icon="appendInnerIcon" />
          </template>
        </v-textarea>
        <v-menu v-if="$slots.options" offset-y>
          <template v-slot:activator="{ props }">
            <div :class="`bg-${color}`" style="width: 25px; height: 100%" />
            <v-btn
              block
              :variant="variant === 'default' ? 'tonal' : (variant as any)"
              class="fade-select mt-1"
              style="container-type: inline-size; text-transform: uppercase"
              tile
              size="x-small"
              flat
              v-bind="props">
              <span style="font-size: 2cqw; padding-top: 2px">
                {{ optionsText || 'Options' }}
                <v-icon v-if="optionsIcon" :icon="optionsIcon" />
              </span>
            </v-btn>
          </template>
          <slot name="options" />
        </v-menu>
        <v-slide-y-transition>
          <div v-if="details" class="text-right text-caption">
            {{ details }}
          </div>
        </v-slide-y-transition>
      </div>
    </v-hover>
  </div>
</template>

<script lang="ts">
export default {
  name: 'cc-text-area',
  props: {
    modelValue: { type: [String, Number] },
    color: { type: String, default: 'panel' },
    size: { type: String },
    variant: { type: String, default: 'default' },
    prependInnerIcon: { type: String },
    appendInnerIcon: { type: String },
    block: { type: Boolean },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    placeholder: { type: String },
    label: { type: String },
    icon: { type: String },
    clearable: { type: Boolean },
    tooltip: { type: String },
    tooltipIcon: { type: String },
    details: { type: String },
    readonly: { type: Boolean },
    optionsIcon: { type: String },
    optionsText: { type: String },
  },
  emits: ['update:model-value'],
  data: () => ({
    isFocused: false,
  }),
};
</script>

<style scoped>
.top-element >>> .v-input--horizontal .v-input__prepend {
  margin-inline-end: 0px !important;
}

.top-element >>> .v-input--horizontal .v-input__append {
  margin-inline-start: 0px !important;
}

.top-element >>> .v-field {
  transition: all 0.1s ease-in-out;
}

.top-element >>> .v-field__input {
  padding-top: 14px !important;
}

.color-rotate {
  filter: brightness(3) saturate(200%) hue-rotate(40deg);
}

.prepend {
  height: calc(100% + 8px);
  margin-top: -8px;
  margin-right: -1px;
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  z-index: 1;
  transition: all 0.1s ease-in-out;
}

.offset {
  margin-top: -5px;
}
</style>
