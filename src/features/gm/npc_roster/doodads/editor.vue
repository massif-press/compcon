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
    <template v-slot:stats>
      <stat-editor :item="item" :controller="item" />
    </template>
  </editor-base>
</template>

<script lang="ts">
import { Doodad } from '@/classes/npc/doodad/Doodad';
import EditorBase from '../../../gm/_components/EditorBase.vue';

import Builder from './builder.vue';

import { NpcStore } from '@/stores';
import StatEditor from '../../_components/StatEditor.vue';

export default {
  name: 'gm-doodad-editor-base',
  components: { Builder, EditorBase, StatEditor },
  props: {
    item: { type: Object, required: true },
  },
  emits: ['exit'],
  methods: {
    exit() {
      this.$emit('exit');
    },
    saveAsNew() {
      NpcStore().AddNpc(this.item as Doodad);
      this.exit();
    },
    save() {
      NpcStore().SaveNpcData();
      this.$emit('exit');
    },
    deleteItem() {
      (this.item as Doodad).SaveController.Delete();
      this.$emit('exit');
    },
    dupe() {
      NpcStore().CloneNpc(this.item as Doodad);
      this.$emit('exit');
    },
  },
};
</script>
