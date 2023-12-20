<template>
  <gm-collection-view
    title="NPCs"
    item-type="Npc"
    :items="npcs"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @import-item="importItem()"
    @open="openItem($event)"
  />
  <v-dialog v-model="dialog" fullscreen>
    <v-card flat>
      <editor
        v-if="dialog && selected"
        :id="selected"
        @exit="dialog = false"
        @copy="copyItem()"
        @save="SaveAndClose()"
      >
        <builder slot="upper" :item="selected" />
        <features slot="lower" :item="selected" />
      </editor>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import GmCollectionView from '../../_views/GMCollectionView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import Features from './features.vue';

import { CompendiumStore, NpcStore } from '@/stores';

export default {
  name: 'npc-roster',
  components: { GmCollectionView, Editor, Builder, Features },
  data: () => ({
    dialog: false,
    selected: null,
    groupings: ['None', 'Labels', 'Size', 'Tag', 'Role', 'Tier', 'Campaign', 'Collection'],
    sortings: ['Name', 'Size', 'Tier'],
  }),
  computed: {
    npcs() {
      return NpcStore().getUnits;
    },
    eidolons() {
      return false;
      // return CompendiumStore().AllowEidolons;
    },
  },
  methods: {
    openItem(id) {
      this.selected = id;
      this.dialog = true;
    },
    addNew() {
      // this.selected = 'new';
      this.dialog = true;
    },
    importItem() {
      console.error('NOT YET IMPLEMENTED');
    },
    deleteItem() {
      console.error('NOT YET IMPLEMENTED');
    },
    SaveAndClose() {
      // const store =NpcStore();
      // TODO: check for and ask to update instances on save
      // store.addNpc(this.selected);
      this.selected = null;
      this.dialog = false;
    },
    copyItem() {
      console.error('NOT YET IMPLEMENTED');
    },
  },
};
</script>
