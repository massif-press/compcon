<template>
  <div class="top-element" style="display: block; position: relative">
    <div
      v-if="mobile && label"
      class="text-cc-overline"
      style="position: absolute; top: -14px; left: 10px">
      <cc-slashes />
      {{ label }}
    </div>
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
          :class="`prepend bg-${color} ${isFocused && 'color-rotate'} ${(icon || label) && 'mr-n1'}`"
          :style="`min-width: ${icon ? '30' : '12'}px`">
          <v-icon v-if="icon" :icon="icon" :class="label && 'ml-2'" class="mt-1" />
          <div
            v-if="label && !mobile"
            class="d-inline-block text-cc-overline ml-3"
            style="line-height: 0; margin-top: 16px">
            {{ label }}
            <cc-slashes class="ml-1 mr-2" />
          </div>
        </div>
      </template>
      <template v-if="prependInnerIcon" #prepend-inner>
        <v-icon :icon="prependInnerIcon" />
      </template>
      <template v-if="items && typeof items[0] === 'object'" #item="{ props, item }">
        <v-list-item
          v-bind="props"
          :subtitle="item.raw.subtitle"
          :prepend-icon="item.raw.icon"
          :disabled="item.raw.disabled" />
      </template>
      <template #chip="{ item }">
        <v-chip
          style="margin-top: -4px; margin-bottom: -4px; position: relative"
          size="large"
          rounded="sm"
          class="chip-clip pl-1 pr-3 mx-1"
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

        <cc-tooltip v-if="tooltip" location="top" max-width="300px">
          {{ tooltip }}
        </cc-tooltip>
      </template>
      <template v-if="appendInnerIcon" #append-inner>
        <v-icon :icon="appendInnerIcon" />
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
    chipVariant: { type: String, default: 'tonal' },
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
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
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
  height: auto !important;
  min-height: 30px;
}

::v-deep(.v-combobox input) {
  margin-top: -10px !important;
}

::v-deep(.v-autocomplete input) {
  margin-top: -10px !important;
}

.prepend {
  height: 100%;
  min-width: 16px;
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  z-index: 1;
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
