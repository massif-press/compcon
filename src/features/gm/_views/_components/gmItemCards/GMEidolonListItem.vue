<template>
  <gm-list-item-base
    :item="item"
    :big="big"
    :odd="odd"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <template #title>
      {{ item.Name }}&mdash; T{{ item.Tier }}
      <cc-slashes />
      CLASS {{ item.Class }}
    </template>
    <v-chip v-for="l in item.Layers" label prepend-icon="mdi-layers" class="mx-1 my-1">
      {{ l.Layer.Name }}
    </v-chip>
  </gm-list-item-base>
</template>

<script lang="ts">
import GmListItemBase from './_GMListItemBase.vue';

export default {
  name: 'gm-doodad-list-item',
  components: { GmListItemBase },
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
    grouping: { type: [Object, String], required: false, default: '' },
    sorting: { type: [Object, String], required: false, default: '' },
  },
  emits: ['open'],
};
</script>
