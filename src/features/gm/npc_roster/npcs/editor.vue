<template>
  <editor-base
    :item="item"
    :readonly="readonly"
    :hide-toolbar="hideToolbar"
    :hide-footer="hideFooter"
    @exit="$emit('exit')"
    @add-new="saveAsNew()"
    @save="save()"
    @delete="deleteItem()"
    @export="exportItem($event)"
    @copy="dupe()">
    <template v-slot:builder>
      <builder :item="item" :readonly="readonly" />
    </template>
    <div v-if="item.NpcClassController.Class">
      <npc-tier-selector :item="item" :readonly="readonly" class="mb-n8" />
      <stat-editor
        :item="item"
        :controller="item.NpcClassController"
        :bonuses="item.FeatureController.Bonuses"
        :readonly="readonly" />
      <features :item="item" :readonly="readonly" />
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
import exportAsJson from '@/util/jsonExport';

export default {
  name: 'gm-editor-npc',
  components: { Builder, Features, EditorBase, StatEditor, NpcTierSelector },
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
    exportItem(item) {
      exportAsJson(Unit.Serialize(item, false), `${item.Name}.json`);
    },
  },
};
</script>
