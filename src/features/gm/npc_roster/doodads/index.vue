<template>
  <component
    :is="viewComponent"
    ref="view"
    title="Doodads"
    item-type="Doodad"
    :items="doodads"
    :selected="selected"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)">
    <template #tooltip>
      <v-tooltip
        text="Non-character objects (such as terrain items) that can be tracked in combat encounters. Doodads cannot take NPC items or features, but have stats and can be given narrative content."
        location="bottom"
        max-width="400">
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            end
            icon="mdi-information-outline"
            class="fade-select ml-n1 mb-n1"
            size="15" />
        </template>
      </v-tooltip>
    </template>

    <editor
      v-if="selected"
      :item="selected"
      :footer-offset="view !== 'collection'"
      :hide-toolbar="view !== 'collection'"
      @exit="($refs as any).view.dialog = false"
      @save="SaveAndClose()" />
    <no-gm-item v-else />
  </component>
</template>

<script lang="ts">
import GMSplitView from '../../_views/GMSplitView.vue';
import GmCollectionView from '../../_views/GMCollectionView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import { NpcStore } from '../../store/npc_store';
import { Doodad } from '@/classes/npc/doodad/Doodad';
import NoGmItem from '../../_views/_components/NoGmItem.vue';

export default {
  name: 'doodad-roster',
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
    selected: null as Doodad | null,
  }),
  mounted() {
    if (this.id) {
      const item = NpcStore().getNpcByID(this.id);
      if (item && item instanceof Doodad) {
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
        this.doodads.flatMap((x) => x.StatController.DisplayKeys.map((k) => k.title))
      );

      const baseGroupings = ['None'];

      return [...baseGroupings, ...statGroupings, ...allLabelTitles];
    },
    sortings() {
      const allLabelTitles = new Set(
        NpcStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const statSortings = new Set(
        this.doodads.flatMap((x) => x.StatController.DisplayKeys.map((k) => k.title))
      );

      const baseSortings = ['Name'];

      return [...baseSortings, ...statSortings, ...allLabelTitles];
    },

    doodads() {
      return NpcStore().getDoodads.filter((x) => !x.SaveController.IsDeleted);
    },
  },
  methods: {
    openItem(item) {
      this.selected = item;
      (this.$refs as any).view.dialog = true;
    },
    addNew() {
      const d = new Doodad();
      NpcStore().AddNpc(d);
      this.selected = d;
      (this.$refs as any).view.dialog = true;
    },
    SaveAndClose() {
      this.selected = null;
      (this.$refs as any).view.dialog = true;
    },
  },
};
</script>
