<template>
  <gm-list-item-base
    :item="item"
    :big="big"
    :odd="odd"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <template #title>
      {{ item.Name }}
    </template>
    <div class="text-caption">
      <stat-chips :stat-controller="item.StatController" />
    </div>
  </gm-list-item-base>
</template>

<script lang="ts">
import StatChips from './_subcomponents/statChips.vue';
import GmListItemBase from './_GMListItemBase.vue';

export default {
  name: 'gm-doodad-list-item',
  components: { StatChips, GmListItemBase },
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
