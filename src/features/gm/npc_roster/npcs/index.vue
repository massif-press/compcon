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

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import GmSplitView from '../../_views/GMSplitView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import Features from './features.vue';
import { Unit } from '@/classes/npc/unit/Unit';
import { NpcStore } from '@/stores';
import NoGmItem from '../../_views/_components/NoGmItem.vue';
import { useMobile } from '@/composables/useMobile';
import { ref, onUnmounted } from 'vue';

defineOptions({ name: 'NpcRoster' })

const npcStore = NpcStore();
    const selected = ref<Unit | null>(null);
    const npcs = ref(npcStore.getUnits.filter((x) => !x.SaveController.IsDeleted));
    const unsub = npcStore.$subscribe(() => {
      npcs.value = npcStore.getUnits.filter((x) => !x.SaveController.IsDeleted);
      if (selected.value) {
        const updated = npcStore.getNpcByID(selected.value.ID);
        if (updated) selected.value = updated as Unit;
      }
    });
    onUnmounted(unsub);
const { mobile, portrait } = useMobile()

const props = withDefaults(defineProps<{
  id?: string
}>(), {
  id: null
})

const view = ref<any>(null)

const groupings = computed(() => {
      const allLabelTitles = new Set(
        npcStore.getAllLabels.filter((x: any) => x.title && x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseGroupings = ['None', 'Tier', 'Role', 'Tag', 'Folder'];

      return [...baseGroupings, ...allLabelTitles];
    })
const sortings = computed(() => {
      const allLabelTitles = new Set(
        npcStore.getAllLabels.filter((x: any) => x.title && x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseSortings = ['Name', 'Created', 'Updated', 'Tier', 'Role', 'Tag'];

      const statSortings = new Set(
        npcs.value.flatMap((x) => x.StatController.DisplayKeys.map((k) => k.title)).filter((t) => t !== 'Burn')
      );

      return [...baseSortings, ...statSortings, ...allLabelTitles];
    })

function openItem(item) {
      selected.value = item;
      if (mobile.value) view.value.minimize();
    }
async function addNew() {
      const u = new Unit();
      await NpcStore().AddNpc(u);
      selected.value = u;
      if (mobile.value) view.value.minimize();
    }
function exit() {
      selected.value = null;
    }

onMounted(() => {
if (props.id) {
      const item = NpcStore().getNpcByID(props.id);
      if (item && item instanceof Unit) {
        selected.value = item;
        view.value.dialog = true;
      }
    }
})
</script>
