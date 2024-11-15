<template>
  <gm-list-item-base
    :item="item"
    :big="big"
    :odd="odd"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <template #title>
      <cc-missing-content-hover :item="item" />
      <cc-remote-hover :item="item" color="accent" />
      {{ item.Name }}
      <span v-if="item.NpcClassController.Class">
        &mdash; T{{ item.NpcClassController.Tier }} {{ item.NpcClassController.Class.Name }}
      </span>
      <span class="px-4">
        <v-chip
          v-for="t in item.NpcTemplateController.Templates"
          size="x-small"
          variant="flat"
          label
          color="primary"
          class="mr-3 mt-n1">
          <v-icon icon="cc:npc_template" start />
          {{ t.Name }}
        </v-chip>
      </span>
    </template>
    <div class="text-caption pt-1">
      <stat-chips
        :stat-controller="item.StatController"
        :bonuses="item.FeatureController.Bonuses" />
    </div>
  </gm-list-item-base>
</template>

<script lang="ts">
import StatChips from './_subcomponents/statChips.vue';
import GmListItemBase from './_GMListItemBase.vue';

export default {
  name: 'gm-unit-list-item',
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
