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
    <template v-slot:builder>
      <builder :item="item" :readonly="readonly" />
    </template>
    <template v-slot:stats>
      <persistent-traits />
    </template>
    <tier-selector v-if="!readonly" :item="item" />
    <eidolon-layer-editor :item="item" :readonly="readonly" />
  </editor-base>
</template>

<script lang="ts">
import EditorBase from '../../../gm/_components/EditorBase.vue';
import EidolonLayerEditor from './_components/EidolonLayerEditor.vue';

import { NpcStore } from '@/stores';
import Builder from './builder.vue';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import PersistentTraits from './_components/PersistentTraits.vue';
import TierSelector from './_components/TierSelector.vue';
import exportAsJson from '@/util/jsonExport';

export default {
  name: 'gm-eidolon-editor-base',
  components: { Builder, EditorBase, EidolonLayerEditor, PersistentTraits, TierSelector },
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
      (this.item as Eidolon).SaveController.Delete();
      this.$emit('exit');
    },
    dupe() {
      NpcStore().CloneNpc(this.item as Eidolon);
      this.$emit('exit');
    },
    exportItem(item) {
      exportAsJson(Eidolon.Serialize(item, false), `${item.Name}.json`);
    },
  },
};
</script>
