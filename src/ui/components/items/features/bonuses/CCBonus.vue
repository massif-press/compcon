<template>
  <component :is="chip || icon ? 'bonusChip' : 'bonusPopup'"
    :bonus="bonus"
    :tier="tier"
    :icon="icon" />
</template>

<script setup lang="ts">
import bonusPopup from './_bonusPopup.vue';
import bonusChip from './_bonusChip.vue';

const props = withDefaults(defineProps<{
  bonus: object
  popup?: boolean
  panel?: boolean
  chip?: boolean
  icon?: boolean
  tier?: number
}>(), {
  popup: true,
  icon: false,
  tier: 1,
})
</script>
