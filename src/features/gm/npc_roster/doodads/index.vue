<template>
  <gm-collection-view
    title="Doodads"
    item-type="Doodad"
    :items="doodads"
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
  </gm-collection-view>
  <v-dialog v-model="dialog" fullscreen>
    <v-card flat>
      <editor
        v-if="dialog && selected"
        :item="selected"
        @exit="dialog = false"
        @save="SaveAndClose()" />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import GmCollectionView from '../../_views/GMCollectionView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import { NpcStore } from '../../store/npc_store';
import { Doodad } from '@/classes/npc/doodad/Doodad';

export default {
  name: 'doodad-roster',
  components: { GmCollectionView, Editor, Builder },
  data: () => ({
    dialog: false,
    selected: null as Doodad | null,
  }),
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
      this.dialog = true;
    },
    addNew() {
      const d = new Doodad();
      NpcStore().AddNpc(d);
      this.selected = d;
      this.dialog = true;
    },
    SaveAndClose() {
      this.selected = null;
      this.dialog = false;
    },
  },
};
</script>
