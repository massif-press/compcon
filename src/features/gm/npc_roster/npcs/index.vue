<template>
  <gm-split-view ref="view"
    title="NPCs"
    item-type="Unit"
    :items="npcs"
    :selected="<any>selected"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)">
    <editor v-if="!!selected"
      :key="selected.ID"
      :item="selected"
      :readonly="selected.Readonly"
      hide-toolbar
      @exit="exit()">
      <template #upper>
        <builder :item="selected"
          :readonly="selected.Readonly" />
      </template>
      <template #lower>
        <features :npc="selected"
          :readonly="selected.Readonly" />
      </template>
    </editor>
    <no-gm-item v-else />
  </gm-split-view>
</template>

<script lang="ts">
import GmSplitView from '../../_views/GMSplitView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import Features from './features.vue';
import { Unit } from '@/classes/npc/unit/Unit';

import { NpcStore } from '@/stores';
import NoGmItem from '../../_views/_components/NoGmItem.vue';
import { useMobile } from '@/mixins/useMobile';
import { ref, onUnmounted } from 'vue';


export default {
  name: 'NpcRoster',
  components: { GmSplitView, NoGmItem, Editor, Builder, Features },
  mixins: [useMobile],
  props: {
    id: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup() {
    const npcStore = NpcStore();
    const npcs = ref(npcStore.getUnits.filter((x) => !x.SaveController.IsDeleted));
    const unsub = npcStore.$subscribe(() => {
      npcs.value = npcStore.getUnits.filter((x) => !x.SaveController.IsDeleted);
    });
    onUnmounted(unsub);
    return { npcStore, npcs };
  },
  data: () => ({
    selected: null as Unit | null,
  }),
  computed: {
    groupings() {
      const allLabelTitles = new Set(
        this.npcStore.getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseGroupings = ['None', 'Tier', 'Role', 'Tag', 'Folder'];

      return [...baseGroupings, ...allLabelTitles];
    },
    sortings() {
      const allLabelTitles = new Set(
        this.npcStore.getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseSortings = ['Name', 'Created', 'Updated', 'Tier', 'Role', 'Tag'];

      const statSortings = new Set(
        this.npcs.flatMap((x) => x.StatController.DisplayKeys.map((k) => k.title)).filter((t) => t !== 'Burn')
      );

      return [...baseSortings, ...statSortings, ...allLabelTitles];
    },
  },
  mounted() {
    if (this.id) {
      const item = NpcStore().getNpcByID(this.id);
      if (item && item instanceof Unit) {
        this.selected = item;
        (this.$refs as any).view.dialog = true;
      }
    }
  },
  methods: {
    openItem(item) {
      this.selected = item;
      if (this.mobile) (this.$refs as any).view.minimize();
    },
    async addNew() {
      const u = new Unit();
      await NpcStore().AddNpc(u);
      this.selected = u;
      if (this.mobile) (this.$refs as any).view.minimize();
    },
    exit() {
      this.selected = null;
    },
  },
};
</script>
