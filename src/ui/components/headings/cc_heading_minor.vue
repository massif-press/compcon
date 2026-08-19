<template>
  <v-row
    dense
    align="center"
    :class="!filled && `text-${color}`"
  >
    <v-col
      v-if="isLine"
      cols="auto"
      style="width: 2.5vw; min-width: 20px"
    >
      <v-divider />
    </v-col>
    <v-col cols="auto">
      <div
        class="text-overline"
        :style="`${compact ? 'line-height: 1.2' : ''}`"
      >
        <slot />
      </div>
    </v-col>
    <v-col v-if="isLine"><v-divider /></v-col>
  </v-row>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  defineOptions({ name: 'cc-heading-minor' })

  const props = withDefaults(
    defineProps<{
      color?: string
      density?: string
      line?: boolean
      filled?: boolean
    }>(),
    {
      color: '',
      density: '',
      line: false,
      filled: false,
    }
  )

  const compact = computed(() => {
    return props.density === 'compact'
  })
  const isLine = computed(() => {
    return props.line && !props.filled
  })
</script>

<style scoped>
  @import './cc_heading_base.css';
</style>
