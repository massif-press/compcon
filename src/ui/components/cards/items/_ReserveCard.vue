<template>
  <info-card-base :item="item" :notes="notes" :charts="charts"> </info-card-base>
</template>

<script lang="ts">
import InfoCardBase from './_InfoCardBase.vue';

export default {
  name: 'cc-mech-weapon-card',
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
