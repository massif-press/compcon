<template>
  <v-hover #default="{ isHovering, props }">
    <div
      class="top-element mx-1"
      style="display: block; position: relative"
      v-bind="props"
    >
      <v-text-field
        :model-value="modelValue"
        :color="color"
        :base-color="color"
        :variant="<any>variant"
        :loading="loading"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :clearable="clearable"
        :autofocus="autofocus"
        :width="width"
        :height="height"
        clear-icon="mdi-close-circle-outline"
        density="compact"
        hide-details
        :autocomplete="autocomplete"
        :type="type"
        rounded="0"
        :bg-color="isFocused ? 'surface-variant' : 'panel'"
        @update:focused="isFocused = $event"
        @update:model-value="$emit('update:model-value', $event)"
      >
        <template #prepend>
          <div
            :class="`prepend bg-${color} ${isFocused && 'color-rotate'} `"
            :style="`min-width: ${icon ? '30' : '16'}px`"
          >
            <v-icon v-if="icon" :icon="icon" class="mt-1 ml-3 mr-2" />
            <div
              v-if="label"
              class="d-inline-block text-cc-overline ml-3"
              style="line-height: 0; margin-top: 16px"
            >
              {{ label }}
              <cc-slashes class="ml-1 mr-2" />
            </div>
          </div>
        </template>
        <template v-if="prependInnerIcon" #prepend-inner>
          <v-icon :icon="prependInnerIcon" />
        </template>
        <template #append>
          <v-menu v-if="$slots.options" offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                size="32"
                :color="color"
                icon
                :variant="<any>variant"
                tile
                flat
                v-bind="props"
                style="margin-left: -1px"
              >
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
            "
          />
          <span v-if="$slots.extra" class="pl-4">
            <slot name="extra" />
          </span>

          <v-tooltip v-if="tooltip" location="top" max-width="300px">
            <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                class="fade-select mx-1"
                :icon="tooltipIcon || 'mdi-information-slab-box-outline'"
              />
            </template>
            {{ tooltip }}
          </v-tooltip>
        </template>
        <template v-if="appendInnerIcon" #append-inner>
          <v-icon
            :icon="appendInnerIcon"
            @click.stop="$emit('click-append-inner')"
          />
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
export default {
  name: 'CCTextField',
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
    autofocus: { type: Boolean },
    details: { type: String },
    readonly: { type: Boolean },
    optionsIcon: { type: String },
    type: { type: String },
    autocomplete: { type: String },
    width: { type: String, default: '100%' },
    height: { type: String },
  },
  data: () => ({
    isFocused: false,
  }),
  emits: ['update:model-value', 'click-append-inner'],
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
  filter: brightness(1.5) saturate(200%) hue-rotate(40deg);
}

.prepend {
  height: 100%;
  margin-right: -1px;
  min-width: 16px;
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  z-index: 1;
  transition: all 0.1s ease-in-out;
}

.offset {
  margin-top: -5px;
}
</style>
