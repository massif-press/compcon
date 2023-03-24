<template>
  <div>
    <gm-collection-view
      title="Eidolons"
      item-type="Eidolon"
      :items="eidolons"
      :groupings="groupings"
      :sortings="sortings"
      @add-new="addNew()"
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
  </div>
</template>

<script lang="ts">
import GmCollectionView from '../_views/GMCollectionView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import Features from './features.vue';

// import { EidolonStore } from '@/store';

export default {
  name: 'eidolon-roster',
  components: { GmCollectionView, Editor, Builder, Features },
  data: () => ({
    dialog: false,
    selected: null,
    groupings: ['None', 'Labels', 'Layers', 'Campaign'],
    sortings: ['Name', 'Layers'],
  }),
  computed: {
    eidolons() {
      return this.getModule(EidolonStore).Eidolons;
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
    SaveAndClose() {
      // const store =this.getModule(EidolonStore);
      // TODO: check for and ask to update instances on save
      store.addEidolon(this.selected);
      this.$set(this, 'selected', null);
      this.dialog = false;
    },
  },
};
</script>
