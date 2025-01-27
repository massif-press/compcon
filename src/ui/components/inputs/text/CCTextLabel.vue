<!-- TODO: REMOVE -->
<template>
  <v-hover #default="{ isHovering, props }">
    <div class="d-inline top-element" style="position: relative">
      <v-slide-x-transition>
        <span
          v-if="(isHovering || menu || outlined) && !text"
          :class="`light bg-${color || 'stark'}`" />
      </v-slide-x-transition>
      <v-chip
        tile
        v-bind="props"
        offset-y
        class="label-clip"
        :color="color"
        :variant="<any>variant">
        <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
          <template #activator="{ props }">
            <v-slide-x-reverse-transition>
              <span
                v-if="isHovering || menu"
                v-bind="props"
                class="cursor-pointer"
                style="position: relative">
                <v-icon variant="plain" class="ml-n1">mdi-circle-edit-outline</v-icon>
                <div class="vertical-line"></div>
              </span>
            </v-slide-x-reverse-transition>
          </template>

          <v-card tile min-width="300px" class="mt-n10 ml-6 pa-3" border>
            <v-text-field
              :model-value="modelValue"
              :placeholder="placeholder"
              variant="outlined"
              tile
              hide-details
              autofocus
              density="compact"
              @update:model-value="$emit('update:model-value', $event)" />
            <p v-if="detail" class="mt-2">{{ detail }}</p>
          </v-card>
        </v-menu>

        <div v-if="prependIcon || label">
          <v-icon
            v-if="prependIcon"
            :icon="prependIcon"
            class="mr-1"
            :class="[iconOffset(prependIcon), label && 'ml-2 mt-n1']" />
          <div v-if="label" class="d-inline-block text-cc-overline mx-1" style="line-height: 0">
            {{ label }}
            <cc-slashes />
          </div>
        </div>

        <span v-if="modelValue">
          {{ modelValue }}
        </span>
        <i v-else class="flavor-text" style="opacity: 0.5">NO DATA</i>
        <v-icon v-if="appendIcon" :class="iconOffset(appendIcon)" :icon="appendIcon" class="mr-1" />
      </v-chip>

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
            style="margin-left: -1px">
            <v-icon :icon="optionsIcon || 'mdi-dots-vertical'" />
          </v-btn>
        </template>
        <slot name="options" />
      </v-menu>

      <div
        :class="`bg-${color} ${isHovering && 'color-rotate'}`"
        style="
          display: inline-block;
          width: 3px;
          height: 32px;
          margin-left: 3px;
          margin-bottom: -12px;
          z-index: 1;
          opacity: 0.2;
          transition: all 0.2s ease-in-out;
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
    </div>
  </v-hover>
</template>

<script lang="ts">
export default {
  name: 'cc-text-label',
  props: {
    modelValue: { type: String },
    label: { type: String },
    placeholder: { type: String },
    color: { type: String, required: false, default: 'stark' },
    variant: { type: String, default: 'tonal' },
    prependIcon: { type: String, default: '' },
    appendIcon: { type: String, default: '' },
    detail: { type: String },
    tooltip: { type: String },
    tooltipIcon: { type: String },
    optionsIcon: { type: String },
  },
  emits: ['update:model-value'],
  data: () => ({
    menu: false,
  }),
  computed: {
    outlined() {
      return this.variant === 'outlined';
    },
    text() {
      return this.variant === 'text';
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
.offset {
  margin-top: -3px;
}

.vertical-line {
  display: inline-block;
  width: 1px;
  height: 100px;
  margin: 0 8px 0 8px;
  background-color: rgb(var(--v-theme-panel)) !important;
  vertical-align: middle;
}

.label-clip {
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
}

.light {
  top: -7px;
  left: 0px;
  width: 10px;
  height: 10px;
  position: absolute;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  border-top-left-radius: 1px;
  transition: filter 0.2s ease-in-out;
}

.color-rotate {
  opacity: 1 !important;
  filter: brightness(2) saturate(200%) hue-rotate(40deg);
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(40deg);
}
</style>
