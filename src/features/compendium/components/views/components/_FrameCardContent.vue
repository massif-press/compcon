<template>
  <c-card-base :item="item" :small="small" :hover="hover">
    <template #top>
      <v-img
        v-if="item.DefaultImage"
        :src="item.DefaultImage"
        :max-height="small ? '175px' : '225px'"
        contain
        class="py-2"
      />
    </template>
    <template #overline> {{ item.MechTypeString }} Frame </template>
  </c-card-base>
</template>

<script lang="ts">
import CCardBase from './_cCardBase.vue';

export default {
  name: 'frame-card-content',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
  },
};
</script>
