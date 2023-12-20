<template>
  <editor-base
    :item="item"
    @exit="$emit('exit')"
    @add-new="saveAsNew()"
    @save="save()"
    @delete="deleteItem()"
    @copy="dupe()"
  >
    <template v-slot:builder> builder slot </template>
    <template v-slot:stats> stats </template>
  </editor-base>
</template>

<script lang="ts">
import { Faction } from '@/classes/narrative/Faction';
import EditorBase from '../../../gm/_components/EditorBase.vue';
import { NarrativeStore } from '@/stores';

export default {
  name: 'gm-faction-editor-base',
  components: { EditorBase },
  props: {
    item: { type: Object, required: true },
  },
  emits: ['exit'],
  methods: {
    exit() {
      this.$emit('exit');
    },
    saveAsNew() {
      NarrativeStore().AddItem(this.item as Faction);
      this.exit();
    },
    save() {
      NarrativeStore().SaveItemData();
      this.$emit('exit');
    },
    deleteItem() {
      (this.item as Faction).SaveController.Delete();
      this.$emit('exit');
    },
    dupe() {
      NarrativeStore().CloneItem(this.item as Faction);
      this.$emit('exit');
    },
  },
};
</script>
