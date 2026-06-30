<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <p
      v-if="item.Effect && item.Effect.length"
      slot="top"
      v-html-safe="item.Effect"
      class="card-effect pa-2 mb-1"
      style="font-size: 15px"
    />
    <span slot="overline">{{ $enum('systemType', item.Type) }}</span>
  </c-card-base>
</template>

<script setup lang="ts">
import type { WeaponMod } from '@/classes/mech/components/equipment/WeaponMod'
import CCardBase from './_cCardBase.vue';

defineOptions({ name: 'frame-card-content' })

const props = defineProps<{
  item: WeaponMod
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
