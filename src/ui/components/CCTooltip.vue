<template>
  <v-tooltip :open-on-hover="!mobile"
    :open-on-click="mobile"
    max-width="350px"
    :location="getLocation">
    <template #activator="{ props }">
      <v-icon v-bind="showTooltip ? props : ''"
        :icon="getIcon"
        :start="start"
        :end="end"
        :color="color"
        style="align-self: center; margin-top: -3px"
        :size="size" />
    </template>
    <template #default>
      <span v-if="text"
        v-html-safe="text" />
      <slot v-else />
    </template>
  </v-tooltip>
</template>

<<<<<<< Updated upstream
<script lang="ts">
import { Anchor } from 'vuetify';


export default {
  props: {
    text: {
      type: String,
    },
    icon: {
      type: String,
    },
    start: {
      type: Boolean,
      default: false,
    },
    end: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [String, Number],
      default: undefined,
    },
    location: {
      type: String,
      default: 'top',
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    getIcon() {
      return this.icon || 'mdi-information-slab-box-outline';
    },
    showTooltip() {
      return this.text || this.$slots.default;
    },
    mobile(): boolean {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    getLocation() {
      if (this.mobile) return 'top' as Anchor;
      return this.location as Anchor;
    },
  },
};
=======
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { Anchor } from 'vuetify'

const slots = useSlots()

interface Props {
  text?: string
  icon?: string
  start?: boolean
  end?: boolean
  size?: string | number
  location?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  start: false,
  end: false,
  location: 'top',
  color: '',
})

const getIcon = computed(() => props.icon || 'mdi-information-slab-box-outline')
const showTooltip = computed(() => props.text || slots.default)
const mobile = computed(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0)
const getLocation = computed(() => (mobile.value ? 'top' : props.location) as Anchor)
>>>>>>> Stashed changes
</script>
