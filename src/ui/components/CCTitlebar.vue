<template>
  <v-toolbar
    :color="color"
    :class="{ 'clipped-large': clipped }"
    :style="`${fixed ? 'position: fixed; width: 100%; z-index: 2' : ''}`"
    :density="<any>density">
    <v-toolbar-title style="text-transform: uppercase" class="heading h2 mt-1">
      <v-icon v-if="icon" size="large" class="mt-n1 mr-2" :icon="icon" />
      <slot name="title" />
    </v-toolbar-title>
    <slot name="title-chips" />
    <v-spacer />
    <span class="pr-5">
      <slot name="title-items" />
    </span>
  </v-toolbar>
</template>

<script setup lang="ts">
interface Props {
  fixed?: boolean
  dark?: boolean
  clipped?: boolean
  color?: string
  icon?: string
  large?: boolean
  density?: string
}

withDefaults(defineProps<Props>(), {
  dark: true,
  clipped: true,
  color: 'primary',
  icon: '',
  density: 'default',
})
</script>

<style>
.v-toolbar-title__placeholder {
  overflow: visible;
}
</style>
