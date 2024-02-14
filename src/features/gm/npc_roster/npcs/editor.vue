<template>
  <editor-base
    :item="item"
    @exit="$emit('exit')"
    @add-new="saveAsNew()"
    @save="save()"
    @delete="deleteItem()"
    @copy="dupe()">
    <template v-slot:builder>
      <builder :item="item" />
    </template>
    <div v-if="item.NpcClassController.Class">
      <npc-tier-selector :item="item" class="mb-n8" />
      <stat-editor :item="item" />
      <features :item="item" />
    </div>
  </editor-base>
</template>

<script lang="ts">
import EditorBase from '../../../gm/_components/EditorBase.vue';
import StatEditor from '../../_components/StatEditor.vue';
import NpcTierSelector from './_components/NpcTierSelector.vue';

import { NpcStore } from '@/stores';
import Features from './features.vue';
import Builder from './builder.vue';
import { Unit } from '@/classes/npc/unit/Unit';

export default {
  name: 'gm-editor-npc',
  components: { Builder, Features, EditorBase, StatEditor, NpcTierSelector },
  props: {
    item: { type: Object, required: true },
  },
  emits: ['exit'],
  methods: {
    exit() {
      this.$emit('exit');
    },
    saveAsNew() {
      NpcStore().AddNpc(this.item as Unit);
      this.exit();
    },
    save() {
      NpcStore().SaveNpcData();
      this.$emit('exit');
    },
    deleteItem() {
      (this.item as Unit).SaveController.Delete();
      this.$emit('exit');
    },
    dupe() {
      NpcStore().CloneNpc(this.item as Unit);
      this.$emit('exit');
    },
  },
};
</script>
