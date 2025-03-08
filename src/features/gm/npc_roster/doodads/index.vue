<template>
  <gm-split-view
    ref="view"
    title="Doodads"
    item-type="Doodad"
    :items="doodads"
    :selected="<any>selected"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)">
    <template #tooltip>
      <div class="text-center mt-n1 mb-1">
        <v-tooltip
          text="Non-character objects (such as terrain items) that can be tracked in combat encounters."
          location="bottom"
          max-width="400">
          <template v-slot:activator="{ props }">
            <v-chip v-bind="props" size="x-small" block>What is a Doodad?</v-chip>
          </template>
        </v-tooltip>
      </div>
    </template>

    <editor
      v-if="selected"
      :item="selected"
      :footer-offset="view !== 'collection'"
      :hide-toolbar="view !== 'collection'"
      @exit="exit()"
      @save="SaveAndClose()" />
    <no-gm-item v-else />
  </gm-split-view>
</template>

<script lang="ts">
import GmSplitView from '../../_views/GMSplitView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import { NpcStore } from '../../store/npc_store';
import { Doodad } from '@/classes/npc/doodad/Doodad';
import NoGmItem from '../../_views/_components/NoGmItem.vue';

export default {
  name: 'doodad-roster',
  components: { GmSplitView, Editor, Builder, NoGmItem },
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
    async addNew() {
      const d = new Doodad();
      await NpcStore().AddNpc(d);
      this.selected = d;
      (this.$refs as any).view.dialog = true;
    },
    SaveAndClose() {
      this.selected = null;
      (this.$refs as any).view.dialog = false;
    },
    exit() {
      this.selected = null;
      (this.$refs as any).view.dialog = false;
    },
  },
};
</script>
