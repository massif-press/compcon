<template>
  <c-card-base :item="item"
    :small="small"
    :highlighted="highlighted"
    :hover="hover">
    <template #top>
      <p v-if="item.Effect && item.Effect.length"
        v-html-safe="item.Effect"
        class="card-effect pa-2 mb-1"
        style="font-size: 15px" />
    </template>
    <template #overline>
      <span>{{ item.Type }}</span>
    </template>
  </c-card-base>
</template>

<script setup lang="ts">
import type { MechSystem } from '@/classes/mech/components/equipment/MechSystem'
import CCardBase from './_cCardBase.vue';

defineOptions({ name: 'FrameCardContent' })

const props = defineProps<{
  item: MechSystem
  small?: boolean
  hover?: boolean
  highlighted?: boolean
}>()
</script>

<style scoped>
.card-effect {
  max-height: 75px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: 3;
}
</style>
