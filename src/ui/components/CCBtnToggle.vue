<template>
  <v-btn-toggle
    v-model="model"
    :color="color"
    :variant="variant"
    :density="density"
    :multiple="multiple"
    :mandatory="mandatory"
    rounded="0"
    class="flex-wrap">
    <slot />
  </v-btn-toggle>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: any
  color?: string
  variant?: string
  density?: string
  multiple?: boolean
  mandatory?: boolean
}>(), {
  color: 'primary',
  variant: 'outlined',
  density: 'compact',
})

const emit = defineEmits<{
  'update:modelValue': [val: any]
}>()

const model = ref(props.modelValue)
watch(model, val => emit('update:modelValue', val))
watch(() => props.modelValue, val => { model.value = val })
</script>
