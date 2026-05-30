<template>
  <component :is="component" v-bind="$props">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import minor from './cc_heading_minor.vue';
import title from './cc_title.vue';
import h3 from './cc_h3.vue';

defineOptions({ name: 'cc-heading' })

const props = withDefaults(defineProps<{
  type?: string
  color?: string
  textColor?: string
  line?: boolean
  filled?: boolean
  isTitle?: boolean
  text?: string
  small?: boolean
  size?: string
  tooltip?: string
  dense?: boolean
  center?: boolean
}>(), {
  type: 'minor',
  color: '',
  textColor: 'accent',
  filled: false,
  text: '',
  small: false,
  size: 'small',
  tooltip: '',
  dense: false,
  center: false
})

const component = computed(() => {
      if (props.isTitle) {
        return title;
      }

      switch (props.type) {
        case 'minor':
          return minor;
        case 'h3':
          return h3;
        default:
          return title;
      }
    })
</script>
