<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <template #top>
      <div class="pt-8 text-text">
        <p
          v-if="item.Description"
          v-html-safe="item.Description"
          class="card-effect pa-2 mb-1 text-text"
          style="font-size: 15px" />
        <p
          v-if="item.Detail"
          v-html-safe="item.Detail"
          class="card-effect pa-2 mb-1 text-text"
          style="font-size: 15px" />
      </div>
    </template>
  </c-card-base>
</template>

<script lang="ts">
import CCardBase from './_cCardBase.vue';
export default {
  name: 'gear-card-content',
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
