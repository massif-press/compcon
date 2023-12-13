<template>
  <!-- TODO: eidolon check -->
  <v-tabs v-model="tab" grow color="secondary" density="compact" mandatory height="30" class="mt-2">
    <v-tab>NPCs</v-tab>
    <v-tab>Eidolons</v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item>
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
            v-if="dialog"
            :id="selected"
            @exit="dialog = false"
            @copy="copyItem()"
            @deleteItem="deleteItem()"
            @save="SaveAndClose()"
          >
            <builder slot="upper" :item="selected" />
            <features slot="lower" :item="selected" />
          </editor>
        </v-card>
      </v-dialog>
    </v-window-item>
    <v-window-item>
      <eidolon-index />
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import GmCollectionView from '../_views/GMCollectionView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import Features from './features.vue';
import EidolonIndex from '../eidolons/index.vue';

import { CompendiumStore, NpcStore } from '@/stores';

export default {
  name: 'npc-roster',
  components: { GmCollectionView, Editor, Builder, Features, EidolonIndex },
  data: () => ({
    tab: 0,
    dialog: false,
    selected: null,
    groupings: ['None', 'Labels', 'Size', 'Tag', 'Role', 'Tier', 'Campaign', 'Collection'],
    sortings: ['Name', 'Size', 'Tier'],
  }),
  computed: {
    npcs() {
      return NpcStore().Npcs;
    },
    eidolons() {
      return CompendiumStore().AllowEidolons;
    },
  },
  methods: {
    openItem(id) {
      this.selected = id;
      this.dialog = true;
    },
    addNew() {
      this.selected = 'new';
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
      this.$set(this, 'selected', null);
      this.dialog = false;
    },
  },
};
</script>
