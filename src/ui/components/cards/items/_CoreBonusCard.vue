<template>
  <info-card-base :item="item"
    :notes="notes"
    :charts="charts" />
</template>

<script lang="ts">
import InfoCardBase from './_InfoCardBase.vue';

export default {
  name: 'CcCoreBonusCard',
  components: { InfoCardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    notes: { type: Boolean },
    charts: { type: Boolean },
    collapseActions: { type: Boolean },
    tier: { type: Number },
  },
};
</script>
