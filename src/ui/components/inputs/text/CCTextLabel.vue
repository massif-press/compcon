<template>
  <v-hover v-slot="{ isHovering, props }"
    :disabled="mobile">
    <div class="d-inline top-element"
      style="position: relative">
      <v-slide-x-transition>
        <span v-if="(isHovering || menu || outlined) && !text"
          :class="`light bg-${color || 'stark'}`" />
      </v-slide-x-transition>
      <v-chip tile
        v-bind="props"
        offset-y
        class="label-clip"
        :color="color"
        :variant="<any>variant"
        @click="menu = !menu">
        <v-menu v-if="!readonly"
          v-model="menu"
          :close-on-content-click="false"
          location="bottom">
          <template #activator="{ props }">
            <v-slide-x-reverse-transition>
              <span v-if="isHovering || menu"
                v-bind="props"
                class="cursor-pointer"
                style="position: relative">
                <v-icon variant="plain"
                  class="ml-n1">mdi-circle-edit-outline</v-icon>
                <div class="vertical-line"></div>
              </span>
            </v-slide-x-reverse-transition>
          </template>

          <v-card tile
            min-width="300px"
            class="mt-n10 ml-6 pa-3"
            border>
            <v-text-field v-model="localValue"
              :placeholder="placeholder"
              variant="outlined"
              tile
              hide-details
              density="compact" />
            <p v-if="detail"
              class="mt-2">{{ detail }}</p>
          </v-card>
        </v-menu>

        <div
          style="display: flex; flex-direction: column; align-items: flex-start; max-width: 175px;">
          <div v-if="prependIcon || label">
            <v-icon v-if="prependIcon"
              :icon="prependIcon"
              class="mr-1"
              :class="[label && 'ml-2']" />

            <div v-if="label"
              class="text-cc-overline mt-1 text-disabled"
              style="line-height: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 175px;">
              {{ label }}
              <cc-slashes />
            </div>
          </div>

          <div
            style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 175px;">
            <span v-if="modelValue">
              {{ modelValue }}
            </span>
            <i v-else
              style="opacity: 0.5">{{ $t('ui.widget.noDataUpper') }}</i>
            <v-icon v-if="appendIcon"
              :icon="appendIcon"
              class="mr-1" />
          </div>
        </div>
      </v-chip>

      <v-menu v-if="$slots.options"
        offset-y>
        <template #activator="{ props }">
          <v-btn size="32"
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

      <div :class="`bg-${color} ${isHovering && 'color-rotate'}`"
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

      <v-tooltip v-if="tooltip"
        location="top"
        max-width="300px">
        <template #activator="{ props }">
          <v-icon v-bind="props"
            class="fade-select mx-1"
            :icon="tooltipIcon || 'mdi-information-slab-box-outline'" />
        </template>
        {{ tooltip }}
      </v-tooltip>
      <slot name="append" />
    </div>
  </v-hover>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify';

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  color?: string
  variant?: string
  prependIcon?: string
  appendIcon?: string
  detail?: string
  tooltip?: string
  tooltipIcon?: string
  optionsIcon?: string
  readonly?: boolean
}>(), {
  color: 'stark',
  variant: 'tonal',
  prependIcon: '',
  appendIcon: '',
  readonly: false
})

const emit = defineEmits<{
  'update:model-value': []
}>()

const menu = ref(false)
const localValue = ref('')

const outlined = computed(() => {
  return props.variant === 'outlined';
})
const text = computed(() => {
  return props.variant === 'text';
})
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
