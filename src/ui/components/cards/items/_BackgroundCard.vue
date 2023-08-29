<template>
  <info-card-base :item="item" />
</template>

<script lang="ts">
import InfoCardBase from './_InfoCardBase.vue';

export default {
  name: 'cc-background-card',
  components: { InfoCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
