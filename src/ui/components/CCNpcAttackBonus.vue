<template>
  <v-tooltip location="top">
    <template #activator="{ props }">
      <v-icon v-bind="props"
        class="mt-n1"
        :size="small ? 'small' : '28'"
        icon="cc:reticle" />
      <b class="px-1 heading">{{ attackBonus }}</b>
    </template>
    <span>Attack Bonus</span>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'CcNpcAttackBonus',
  props: {
    attackBonus: {
      type: Number,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
