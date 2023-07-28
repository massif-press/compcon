<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <template #top>
      <v-row no-gutters justify="space-around" align="start">
        <v-col cols="auto">
          <div class="pa-4 text-text">{{ item.Effect }}</div>
        </v-col>
      </v-row>
    </template>
  </c-card-base>
</template>

<script lang="ts">
import CCardBase from './_cCardBase.vue';
export default {
  name: 'core-bonus-card-content',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
    highlighted: { type: Boolean },
  },
};
</script>
