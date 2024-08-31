<template>
  <component
    :is="viewComponent"
    ref="view"
    title="NPCs"
    item-type="Unit"
    :items="npcs"
    :selected="selected"
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
      <features slot="lower" :item="selected" />
    </editor>
    <no-gm-item v-else />
  </component>
</template>

<script lang="ts">
import GmCollectionView from '../../_views/GMCollectionView.vue';
import GMSplitView from '../../_views/GMSplitView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import Features from './features.vue';
import { Unit } from '@/classes/npc/unit/Unit';

import { NpcStore } from '@/stores';
import NoGmItem from '../../_views/_components/NoGmItem.vue';

export default {
  name: 'npc-roster',
  components: { GmCollectionView, NoGmItem, Editor, Builder, Features },
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
    selected: null as Unit | null,
  }),
  mounted() {
    if (this.id) {
      const item = NpcStore().getNpcByID(this.id);
      if (item && item instanceof Unit) {
        this.selected = item;
        (this.$refs as any).view.dialog = true;
      }
    }
  },
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

      const statGroupings = new Set(
        this.npcs.flatMap((x) => x.StatController.DisplayKeys.map((k) => k.title))
      );

      const baseGroupings = ['None', 'Tier', 'Role', 'Tag', 'Folder'];

      return [...baseGroupings, ...statGroupings, ...allLabelTitles];
    },
    sortings() {
      const allLabelTitles = new Set(
        NpcStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseSortings = ['Name', 'Tier', 'Role', 'Tag'];

      const statSortings = new Set(
        this.npcs.flatMap((x) => x.StatController.DisplayKeys.map((k) => k.title))
      );

      return [...baseSortings, ...statSortings, ...allLabelTitles];
    },

    npcs() {
      return NpcStore().getUnits.filter((x) => !x.SaveController.IsDeleted);
    },
  },
  methods: {
    openItem(item) {
      this.selected = item;
      (this.$refs as any).view.dialog = true;
    },
    addNew() {
      const u = new Unit();
      NpcStore().AddNpc(u);
      this.selected = u;
      (this.$refs as any).view.dialog = true;
    },
    SaveAndClose() {
      this.selected = null;
      (this.$refs as any).view.dialog = false;
    },
  },
};
</script>
