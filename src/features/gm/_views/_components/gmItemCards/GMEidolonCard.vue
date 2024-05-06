<template>
  <gm-card-base
    :item="item"
    :big="big"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <div>
      T{{ item.Tier }}
      <cc-slashes />
      CLASS {{ item.Class }}
    </div>
    <v-chip
      v-for="l in item.Layers"
      size="x-small"
      label
      prepend-icon="mdi-layers"
      class="mx-1 my-1">
      {{ l.Layer.Name }}
    </v-chip>
  </gm-card-base>
</template>

<script lang="ts">
import GmCardBase from './_GMCardBase.vue';

export default {
  name: 'gm-eidolon-card',
  components: { GmCardBase },
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
    grouping: { type: [Object, String], required: false, default: '' },
    sorting: { type: Object, required: false, default: '' },
  },
  emits: ['open'],
};
</script>
