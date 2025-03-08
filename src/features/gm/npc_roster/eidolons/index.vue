<template>
  <gm-split-view
    ref="view"
    title="Eidolons"
    item-type="Eidolon"
    :items="eidolons"
    :selected="<any>selected"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)">
    <editor
      v-if="selected"
      :item="selected"
      footer-offset
      hide-toolbar
      @exit="exit()"
      @save="SaveAndClose()">
      <builder slot="upper" :item="selected" />
    </editor>
    <no-gm-item v-else />
  </gm-split-view>
</template>

<script lang="ts">
import GmSplitView from '../../_views/GMSplitView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { NpcStore } from '@/stores';
import NoGmItem from '../../_views/_components/NoGmItem.vue';

export default {
  name: 'eidolon-roster',
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
    async addNew() {
      const e = new Eidolon();
      await NpcStore().AddNpc(e);
      this.selected = e;
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
