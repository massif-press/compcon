<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <template #top>
      <div class="text-center text-stark py-3 px-3">
        <i>{{ item.Appearance }}</i>
      </div>
    </template>
    <template #overline>{{ $t('compendium.content.eidolonLayer') }}</template>
  </c-card-base>
</template>

<script setup lang="ts">
import { Stats } from '@/classes/components/combat/stats/Stats';
import CCardBase from './_cCardBase.vue';

defineOptions({ name: 'eidolon-layer-content' })

const props = defineProps<{
  item: object
  small?: boolean
  hover?: boolean
  highlighted?: boolean
}>()
</script>

<style scoped>
.card-effect {
  height: 75px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: 3;
}
</style>
