<template>
  <v-expansion-panels
    v-model="model"
    :multiple="multiple"
    :flat="flat"
    :tile="tile"
    :color="color"
    :bg-color="bgColor"
    :variant="variant"
    :focusable="focusable">
    <slot />
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: any
  multiple?: boolean
  flat?: boolean
  tile?: boolean
  color?: string
  bgColor?: string
  variant?: string
  focusable?: boolean
}>(), {
  flat: true,
  tile: true,
  bgColor: 'panel',
  variant: 'accordion',
})

const emit = defineEmits<{
  'update:modelValue': [val: any]
}>()

const model = ref(props.modelValue)
</script>
