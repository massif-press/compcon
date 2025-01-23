<template>
  <div class="top-element" style="display: block; position: relative">
    <span :class="`light bg-${color || 'stark'}`" />
    <component
      :is="component"
      :model-value="modelValue"
      :items="items"
      :color="color"
      :base-color="color"
      item-color="accent"
      :loading="loading"
      :disabled="disabled"
      :clearable="clearable"
      :autofocus="autofocus"
      :closable-chips="closeableChips"
      :item-title="itemTitle || 'title'"
      :item-value="itemValue || 'value'"
      :list-props="{ density: 'compact' }"
      :multiple="multiple"
      :readonly="readonly"
      :bg-color="isSelect ? color : isFocused ? 'surface-variant' : 'panel'"
      center-affix
      chips
      flat
      variant="default"
      clear-icon="mdi-close-circle-outline"
      density="compact"
      hide-details
      rounded="0"
      @update:focused="isFocused = $event"
      @update:model-value="$emit('update:model-value', $event)">
      <template #prepend>
        <div
          :class="`prepend bg-${color} ${isFocused && 'color-rotate'} mr-n1`"
          :style="`min-width: ${icon ? '30' : '12'}px`">
          <v-icon v-if="icon" :icon="icon" :class="label && 'ml-2 mt-n1'" />
          <div
            v-if="label"
            class="d-inline-block text-overline ml-3"
            style="line-height: 0; margin-top: 16px">
            {{ label }}
            <cc-slashes class="ml-1 mr-2" />
          </div>
        </div>
      </template>
      <template v-if="prependInnerIcon" #prepend-inner>
        <v-icon :class="iconOffset(prependInnerIcon)" :icon="prependInnerIcon" />
      </template>
      <template #chip="{ item }">
        <v-chip
          style="margin-top: -5px; position: relative"
          size="large"
          rounded="0"
          class="chip-clip px-3"
          :style="!isSelect && 'margin-bottom: 6px'"
          :variant="<any>chipVariant">
          <v-icon v-if="(item as any).icon" :icon="(item as any).icon" />
          <span>{{ item.title }}</span>
          <div v-if="chipVariant === 'outlined'" class="chip-diagonal" :class="getChipClass" />
        </v-chip>
      </template>
      <template #append>
        <v-menu v-if="$slots.options" offset-y>
          <template v-slot:activator="{ props }">
            <v-btn size="32" :color="color" icon tile flat v-bind="props" style="margin-left: -1px">
              <v-icon :icon="optionsIcon || 'mdi-dots-vertical'" />
            </v-btn>
          </template>
          <slot name="options" />
        </v-menu>

        <div
          v-if="!autocomplete"
          :class="`bg-${color} end-light`"
          style="width: 3px; height: 100%; margin-left: 3px; z-index: 1" />

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
        <v-icon :class="iconOffset(appendInnerIcon)" :icon="appendInnerIcon" />
      </template>
    </component>
    <v-slide-y-transition>
      <div v-if="details" class="text-right text-caption">
        {{ details }}
      </div>
    </v-slide-y-transition>
  </div>
</template>

<script lang="ts">
import { VSelect, VAutocomplete, VCombobox } from 'vuetify/lib/components/index.mjs';

export default {
  name: 'CCTextField',
  props: {
    modelValue: { type: String },
    items: { type: Array, default: () => [] },
    color: { type: String, default: 'panel' },
    size: { type: String },
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
    autofocus: { type: Boolean },
    details: { type: String },
    closeableChips: { type: Boolean },
    readonly: { type: Boolean },
    itemTitle: { type: String },
    itemValue: { type: String },
    multiple: { type: Boolean },
    chipVariant: { type: String },
    lightChip: { type: Boolean },
    combobox: { type: Boolean },
    autocomplete: { type: Boolean },
    optionsIcon: { type: String },
  },
  data: () => ({
    isFocused: false,
  }),
  emits: ['update:model-value'],
  computed: {
    getChipClass() {
      return this.lightChip ? 'chip-light' : 'chip-dark';
    },
    isSelect() {
      return !this.combobox && !this.autocomplete;
    },
    component() {
      return this.combobox ? VCombobox : this.autocomplete ? VAutocomplete : VSelect;
    },
  },
  methods: {
    iconOffset(icon: string) {
      return icon.includes('cc:') ? 'offset' : '';
    },
  },
};
</script>

<style scoped>
.top-element >>> .v-field__input {
  padding-left: 4px !important;
}

.top-element >>> .v-input--horizontal .v-input__prepend {
  margin-inline-end: 0px !important;
}

.top-element >>> .v-input--horizontal .v-input__append {
  margin-inline-start: 0px !important;
}

.top-element >>> .v-field__input {
  min-height: auto !important;
  height: 30px;
}

::v-deep(.v-combobox input) {
  margin-top: -10px !important;
}

::v-deep(.v-autocomplete input) {
  margin-top: -10px !important;
}

.prepend {
  height: 100%;
  margin-right: -1px;
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  z-index: 1;
}

.offset {
  margin-top: -5px;
}

.light {
  top: 0;
  left: 0;
  width: 9px;
  height: 9px;
  position: absolute;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  border-top-left-radius: 1px;
  transition: filter 0.2s ease-in-out;
}

.end-light {
  transition: filter 0.2s ease-in-out;
}

.top-element:hover .light,
.top-element:hover .end-light {
  filter: brightness(3) saturate(200%) hue-rotate(40deg);
}

.chip-clip {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
}

.chip-diagonal {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
}

.chip-light {
  background-color: white;
}

.chip-dark {
  background-color: black;
}
</style>
