<template>
  <gm-card-base
    :item="item"
    :big="big"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    {{ item.Title }}
    <br v-if="item.Title" />
    <i class="text-caption">({{ item.Pronouns }})</i>
  </gm-card-base>
</template>

<script lang="ts">
import GmCardBase from './_GMCardBase.vue';

export default {
  name: 'gm-character-card',
  emits: ['open'],
  components: { GmCardBase },
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
    grouping: { type: [Object, String], required: false, default: '' },
    sorting: { type: Object, required: false, default: '' },
  },
};
</script>
