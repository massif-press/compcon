<template>
  <page-base :item="item">
    {{ item }}
    {{ typeof item }}
  </page-base>
</template>

<script lang="ts">
import PageBase from './_components/PageBase.vue';

export default {
  name: 'campaign-beat-page',
  components: { PageBase },
  props: {
    item: { type: Object, required: true },
  },
};
</script>
