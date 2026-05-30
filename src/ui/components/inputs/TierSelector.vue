<template>
  <div>
    <div v-if="label" class="text-overline mt-1">{{ label }}</div>
    <v-btn-toggle
      :model-value="modelValue"
      mandatory
      density="compact"
      rounded="0"
      @update:model-value="emit('update:modelValue', $event)">
      <v-btn v-for="i in max"
        :key="`tier-${i}`"
        :value="i"
        flat
        tile
        size="small"
        :color="modelValue === i ? 'accent' : ''"
        :variant="modelValue === i ? 'tonal' : 'text'">
        <slot :tier="i">
          <span class="heading h3">{{ i }}</span>
        </slot>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: number
  max?: number
  label?: string
}>(), {
  max: 3,
})

const emit = defineEmits<{
  'update:modelValue': [val: number]
}>()
</script>
