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
  props: {
    id: {
      type: String,
      required: false,
    },
  },
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
  mounted() {
    if (this.id) {
      const item = NpcStore().getNpcByID(this.id);
      if (item) {
        this.selected = item;
        this.dialog = true;
      }
    }
  },
  methods: {
    openItem(item) {
      this.selected = item;
      this.dialog = true;
    },
    addNew() {
      const e = new Eidolon();
      NpcStore().AddNpc(e);
      this.selected = e;
      this.dialog = true;
    },
    SaveAndClose() {
      this.selected = null;
      this.dialog = false;
    },
  },
};
</script>
