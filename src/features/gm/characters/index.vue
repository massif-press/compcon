<template>
  <div>
    <gm-collection-view
      title="Characters"
      item-type="Character"
      :items="characters"
      :groupings="['Campaign', 'Labels']"
      :sortings="['Name']"
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
          <!-- <builder slot="upper" :item="selected" />
          <features slot="lower" :item="selected" /> -->
        </editor>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import GmCollectionView from '../_views/GMCollectionView.vue';
import Editor from './editor.vue';

import { NarrativeStore } from '@/stores';

export default {
  name: 'characters-roster',
  components: { GmCollectionView, Editor },
  data: () => ({
    dialog: false,
    selected: null,
    groupings: ['None', 'Labels', 'Campaign'],
    sortings: ['Name'],
  }),
  computed: {
    characters() {
      return NarrativeStore().Characters;
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
      const store = NarrativeStore();
      // TODO: check for and ask to update instances on save
      store.addCharacter(this.selected);
      this.$set(this, 'selected', null);
      this.dialog = false;
    },
  },
};
</script>
