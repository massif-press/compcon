<template>
  <gm-card-base
    :item="item"
    :big="big"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    {{ item.FactionType }}
  </gm-card-base>
</template>

<script lang="ts">
import GmCardBase from './_GMCardBase.vue';

export default {
  name: 'gm-faction-card',
  components: { GmCardBase },
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    grouping: { type: [Object, String], required: false, default: '' },
    sorting: { type: Object, required: false, default: '' },
  },
  emits: ['open'],
};
</script>
