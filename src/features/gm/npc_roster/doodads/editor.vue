<template>
  <editor-base
    :item="item"
    :readonly="readonly"
    :hide-toolbar="hideToolbar"
    :hide-footer="hideFooter"
    @exit="$emit('exit')"
    @save="save()"
    @delete="deleteItem()"
    @export="exportItem($event)"
    @copy="dupe()">
    <template #builder>
      <builder :item="item" :readonly="readonly" />
    </template>
    <template #stats>
      <stat-editor :item="item" :controller="item" :readonly="readonly" />
    </template>
  </editor-base>
</template>

<script lang="ts">
import { Doodad } from '@/classes/npc/doodad/Doodad';
import EditorBase from '../../../gm/_components/EditorBase.vue';

import Builder from './builder.vue';

import { NpcStore } from '@/stores';
import StatEditor from '../../_components/StatEditor.vue';
import exportAsJson from '@/util/jsonExport';

export default {
  name: 'gm-doodad-editor-base',
  components: { Builder, EditorBase, StatEditor },
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    hideToolbar: { type: Boolean, default: false },
    hideFooter: { type: Boolean, default: false },
  },
  emits: ['exit'],
  methods: {
    exit() {
      this.$emit('exit');
    },
    async save() {
      await NpcStore().SaveNpcData();
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
    exportItem(item) {
      exportAsJson(Doodad.Serialize(item, false), `${item.Name}.json`);
    },
  },
};
</script>
