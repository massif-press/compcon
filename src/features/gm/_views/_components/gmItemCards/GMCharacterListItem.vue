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
        <cc-remote-hover :item="item" color="accent" />
        {{ item.Name }}
        <span class="text-caption text-uppercase text-disabled">
          <cc-slashes class="mx-1" />
          {{ item.Pronouns }}
        </span>
      </div>
      <div class="pl-1 text-body-2">
        <i>{{ item.Title }}</i>
      </div>
    </template>
  </gm-list-item-base>
</template>

<script lang="ts">
import GmListItemBase from './_GMListItemBase.vue';

export default {
  name: 'gm-character-list-item',
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
