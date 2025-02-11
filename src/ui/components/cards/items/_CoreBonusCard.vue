<template>
  <info-card-base :item="item" :notes="notes" :charts="charts" />
</template>

<script lang="ts">
import InfoCardBase from './_InfoCardBase.vue';

export default {
  name: 'cc-core-bonus-card',
  components: { InfoCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    notes: { type: Boolean },
    charts: { type: Boolean },
  },
};
</script>
