<template>
  <v-row dense
    align="center">
    <v-col v-if="item.IsLimited"
      cols="auto"
      class="mx-2">
      <!-- <cc-item-uses :item="item" :bonus="useBonus" :color="color" class="d-inline" /> -->
      <!-- <span class="text-overline">({{ item.Uses }}/{{ item.getTotalUses(useBonus) }}) USES</span> -->
    </v-col>

    <v-col cols="auto">
      <slot name="left" />
    </v-col>
    <v-col cols="auto">
      <slot />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import CCItemUses from '@/ui/components/CCItemUses.vue'
const props = withDefaults(defineProps<{
  item: object
  color?: string
  useBonus?: number
  interior?: boolean
  dark?: boolean
  mod?: boolean
}>(), {
  color: null,
  useBonus: 0
})
</script>
