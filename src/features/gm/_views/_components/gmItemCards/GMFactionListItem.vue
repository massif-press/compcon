<template>
  <gm-list-item-base
    :item="item"
    :big="big"
    :odd="odd"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <template #title>
      <div>
        {{ item.Name }}
        <span class="text-caption text-uppercase text-disabled">
          <cc-slashes class="mx-1" />
          {{ item.FactionType }}
        </span>
      </div>
    </template>
  </gm-list-item-base>
</template>

<script lang="ts">
import SortChips from './_subcomponents/sortChips.vue';
import GmListItemBase from './_GMListItemBase.vue';

export default {
  name: 'gm-location-list-item',
  components: { SortChips, GmListItemBase },
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
