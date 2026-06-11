<template>
  <v-tooltip location="top">
    <template #activator="{ props }">
      <v-icon v-bind="props"
        class="mt-n1"
        :size="small ? 'small' : '28'"
        icon="cc:reticle" />
      <b class="px-1 heading">{{ attackBonus }}</b>
    </template>
    <span>{{ $t('common.attackBonus') }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  attackBonus: number
  small?: boolean
}>(), {
  small: false
})
</script>
