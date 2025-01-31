<template>
  <v-hover #default="{ isHovering, props }">
    <div class="top-element" style="display: block; position: relative" v-bind="props">
      <v-text-field
        :model-value.number="modelValue"
        :color="color"
        :base-color="color"
        :variant="<any>variant"
        :loading="loading"
        :disabled="disabled"
        :readonly="readonly"
        :clearable="clearable"
        :autofocus="autofocus"
        clear-icon="mdi-close-circle-outline"
        density="compact"
        hide-details
        rounded="0"
        class="shrink"
        :bg-color="isFocused ? 'surface-variant' : 'panel'"
        @click:clear="setVal(min > 0 ? min : 0)"
        @update:focused="isFocused = $event"
        @update:model-value="setVal($event)">
        <template #prepend>
          <div
            :class="`prepend bg-${color} ${isFocused && 'color-rotate'} ${(icon || label) && 'mr-n2'}`"
            :style="`min-width: ${icon ? '30' : '12'}px`">
            <v-icon v-if="icon" :icon="icon" :class="label && 'ml-2'" class="mt-1" />
            <div
              v-if="label"
              class="d-inline-block text-cc-overline ml-3"
              style="line-height: 0; margin-top: 16px">
              {{ label }}
              <cc-slashes class="ml-1 mr-2" />
            </div>
          </div>
        </template>
        <template v-if="controls" #prepend-inner>
          <v-btn icon variant="text" tile size="x-small" @click="setVal(<number>modelValue - 1)">
            <v-icon size="x-large" icon="mdi-minus" />
          </v-btn>
        </template>
        <template #append>
          <v-menu v-if="$slots.options" offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                size="32"
                :color="color"
                icon
                tile
                flat
                v-bind="props"
                style="margin-left: -1px">
                <v-icon :icon="optionsIcon || 'mdi-dots-vertical'" />
              </v-btn>
            </template>
            <slot name="options" />
          </v-menu>

          <div
            :class="`bg-${color} ${(isHovering || isFocused) && 'color-rotate'}`"
            style="
              transition: filter 0.2s ease-in-out;
              width: 3px;
              height: 100%;
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
        <template v-if="controls" #append-inner>
          <v-btn icon variant="text" tile size="x-small" @click="setVal(<number>modelValue + 1)">
            <v-icon size="x-large" icon="mdi-plus" />
          </v-btn>
        </template>
      </v-text-field>
      <v-slide-y-transition>
        <div v-if="details" class="text-right text-caption">
          {{ details }}
        </div>
      </v-slide-y-transition>
    </div>
  </v-hover>
</template>

<script lang="ts">
import { max, min } from 'lodash';

export default {
  name: 'CCTextField',
  props: {
    modelValue: { type: [String, Number] },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    color: { type: String, default: 'panel' },
    size: { type: String },
    variant: { type: String, default: 'default' },
    controls: { type: Boolean },
    block: { type: Boolean },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    placeholder: { type: String },
    label: { type: String },
    icon: { type: String },
    clearable: { type: Boolean },
    tooltip: { type: String },
    tooltipIcon: { type: String },
    autofocus: { type: Boolean },
    details: { type: String },
    readonly: { type: Boolean },
    optionsIcon: { type: String },
  },
  data: () => ({
    isFocused: false,
  }),
  emits: ['update:model-value'],
  methods: {
    setVal(val: string | number) {
      const value = max([min([val, this.max]), this.min]);
      this.$emit('update:model-value', value);
    },
  },
};
</script>

<style scoped>
.top-element >>> .v-input--horizontal .v-input__prepend {
  margin-inline-end: 0px !important;
}

.top-element >>> .v-input--horizontal .v-input__append {
  margin-inline-start: 0px !important;
}

.top-element >>> .v-field__input {
  min-height: auto !important;
  height: 32px;
}

.top-element >>> .v-field {
  transition: all 0.1s ease-in-out;
}

.color-rotate {
  filter: brightness(3) saturate(200%) hue-rotate(40deg);
}

.prepend {
  height: 100%;
  margin-right: -1px;
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  z-index: 1;
  transition: all 0.1s ease-in-out;
}

.offset {
  margin-top: -5px;
}
</style>
