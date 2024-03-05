<template>
  <gm-collection-view
    title="Eidolons"
    item-type="Eidolon"
    :items="eidolons"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)" />
  <v-dialog v-model="dialog" fullscreen>
    <v-card flat>
      <editor
        v-if="dialog && selected"
        :item="selected"
        @exit="dialog = false"
        @save="SaveAndClose()">
        <builder slot="upper" :item="selected" />
      </editor>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import GmCollectionView from '../../_views/GMCollectionView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { NpcStore } from '@/stores';

export default {
  name: 'eidolon-roster',
  components: { GmCollectionView, Editor, Builder },
  data: () => ({
    dialog: false,
    selected: null as Eidolon | null,
  }),
  computed: {
    groupings() {
      const allLabelTitles = new Set(
        NpcStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseGroupings = ['None', 'Class'];

      return [...baseGroupings, ...allLabelTitles];
    },
    sortings() {
      const allLabelTitles = new Set(
        NpcStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseSortings = ['Name', 'Class'];

      return [...baseSortings, ...allLabelTitles];
    },

    eidolons() {
      return NpcStore().getEidolons.filter((x) => !x.SaveController.IsDeleted);
    },
  },
  methods: {
    openItem(item) {
      this.selected = item;
      this.dialog = true;
    },
    addNew() {
      this.selected = new Eidolon();
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
  },
};
</script>
