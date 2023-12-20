<template>
  <gm-collection-view
    title="Characters"
    item-type="Character"
    :items="characters"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)"
  >
  </gm-collection-view>
  <v-dialog v-model="dialog" fullscreen>
    <v-card flat>
      <editor
        v-if="dialog && selected"
        :item="selected"
        @exit="dialog = false"
        @copy="copyItem()"
        @save="SaveAndClose()"
      />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import GmCollectionView from '../../_views/GMCollectionView.vue';
import Editor from './editor.vue';
import { NarrativeStore } from '../../store/narrative_store';
import { Character } from '@/classes/narrative/Character';

export default {
  name: 'character-roster',
  components: { GmCollectionView, Editor },
  data: () => ({
    dialog: false,
    selected: null as Character | null,
    groupings: ['None', 'Labels', 'Campaign'],
    sortings: ['Name', 'Layers'],
  }),
  computed: {
    characters() {
      return NarrativeStore().getCharacters.filter((x) => !x.SaveController.IsDeleted);
    },
  },
  methods: {
    openItem(item) {
      this.selected = item;
      this.dialog = true;
    },
    addNew() {
      this.selected = new Character();
      this.dialog = true;
    },
    SaveAndClose() {
      // const store =EidolonStore();
      // TODO: check for and ask to update instances on save
      // store.addEidolon(this.selected);
      // this.$set(this, 'selected', null);
      this.selected = null;
      this.dialog = false;
    },
    deleteItem() {
      console.error('NOT YET IMPLEMENTED');
    },
    copyItem() {
      console.error('NOT YET IMPLEMENTED');
    },
  },
};
</script>
