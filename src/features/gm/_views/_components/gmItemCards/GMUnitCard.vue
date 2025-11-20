<template>
  <gm-card-base
    :item="item"
    :big="big"
    :grouping="grouping"
    :sorting="sorting"
    @open="$emit('open', item)">
    <div v-if="item.NpcClassController.Class" class="my-1">
      T{{ item.NpcClassController.Tier }} {{ item.NpcClassController.Class.Name }}
    </div>
    <div class="my-1">
      <v-chip
        v-for="t in item.NpcTemplateController.Templates"
        size="x-small"
        variant="plain"
        label
        flat
        color="primary"
        class="mr-2">
        <v-icon icon="cc:npc_template" start />
        {{ t.Name }}
      </v-chip>
    </div>
  </gm-card-base>
</template>

<script lang="ts">
import GmCardBase from './_GMCardBase.vue';
export default {
  name: 'gm-unit-card',
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
