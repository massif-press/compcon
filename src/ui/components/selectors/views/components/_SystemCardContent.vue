<template>
  <c-card-base :item="item" :small="small" :hover="hover" @equip="$emit('equip', $event)">
    <p
      v-if="item.Effect && item.Effect.length"
      slot="top"
      v-html-safe="item.Effect"
      class="card-effect pa-2 mb-1"
      style="font-size: 15px"
    />
    <span slot="overline">{{ item.Type }}</span>
  </c-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import CCardBase from './_cCardBase.vue'
export default Vue.extend({
  name: 'frame-card-content',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
  },
})
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
