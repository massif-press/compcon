<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <template #top>
      <div class="text-center text-stark py-3 px-3">
        <i>{{ item.Appearance }}</i>
      </div>
    </template>
    <template #overline>Eidolon Layer</template>
  </c-card-base>
</template>

<script lang="ts">
import { Stats } from '@/classes/components/combat/stats/Stats';
import CCardBase from './_cCardBase.vue';

export default {
  name: 'eidolon-layer-content',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
    highlighted: { type: Boolean },
  },
};
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
