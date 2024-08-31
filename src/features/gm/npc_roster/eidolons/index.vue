<template>
  <component
    :is="viewComponent"
    ref="view"
    title="Eidolons"
    item-type="Eidolon"
    :selected="selected"
    :items="eidolons"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)">
    <editor
      v-if="selected"
      :item="selected"
      :footer-offset="view !== 'collection'"
      :hide-toolbar="view !== 'collection'"
      @exit="($refs as any).view.dialog = false"
      @save="SaveAndClose()">
      <builder slot="upper" :item="selected" />
    </editor>
    <no-gm-item v-else />
  </component>
</template>

<script lang="ts">
import GMSplitView from '../../_views/GMSplitView.vue';
import GmCollectionView from '../../_views/GMCollectionView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { NpcStore } from '@/stores';
import NoGmItem from '../../_views/_components/NoGmItem.vue';

export default {
  name: 'eidolon-roster',
  components: { GmCollectionView, Editor, Builder, NoGmItem },
  props: {
    id: {
      type: String,
      required: false,
    },
    view: {
      type: String,
      required: false,
      default: 'collection',
    },
  },
  data: () => ({
    selected: null as Eidolon | null,
  }),
  computed: {
    viewComponent() {
      return this.view === 'collection' ? GmCollectionView : GMSplitView;
    },
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
      if (item && item instanceof Eidolon) {
        this.selected = item;
        (this.$refs as any).view.dialog = true;
      }
    }
  },
  methods: {
    openItem(item) {
      this.selected = item;
      (this.$refs as any).view.dialog = true;
    },
    addNew() {
      const e = new Eidolon();
      NpcStore().AddNpc(e);
      this.selected = e;
      (this.$refs as any).view.dialog = true;
    },
    SaveAndClose() {
      this.selected = null;
      (this.$refs as any).view.dialog = true;
    },
  },
};
</script>
