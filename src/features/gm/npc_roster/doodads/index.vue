<template>
  <gm-split-view ref="view"
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
          <template #activator="{ props }">
            <v-chip v-bind="props"
              size="x-small"
              block
              append-icon="mdi-information-outline">
              What is a Doodad?
            </v-chip>
          </template>
        </v-tooltip>
      </div>
    </template>

    <editor v-if="selected"
      :item="selected"
      :footer-offset="view !== 'collection'"
      :hide-toolbar="view !== 'collection'"
      @exit="exit()"
      @save="SaveAndClose()" />
    <no-gm-item v-else />
  </gm-split-view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import GmSplitView from '../../_views/GMSplitView.vue';
import Editor from './editor.vue';
import Builder from './builder.vue';
import { NpcStore } from '../../store/npc_store';
import { Doodad } from '@/classes/npc/doodad/Doodad';
import NoGmItem from '../../_views/_components/NoGmItem.vue';
import { ref, onUnmounted } from 'vue';

defineOptions({ name: 'DoodadRoster' })

const npcStore = NpcStore();
    const doodads = ref(npcStore.getDoodads.filter((x) => !x.SaveController.IsDeleted));
    const unsub = npcStore.$subscribe(() => {
      doodads.value = npcStore.getDoodads.filter((x) => !x.SaveController.IsDeleted);
    });
    onUnmounted(unsub);

const props = withDefaults(defineProps<{
  id?: string
  view?: string
}>(), {
  view: 'collection'
})

const view = ref<any>(null)

const selected = ref(null as Doodad | null)

const groupings = computed(() => {
      const allLabelTitles = new Set(
        npcStore.getAllLabels.filter((x: any) => x.title && x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseGroupings = ['None'];

      return [...baseGroupings, ...allLabelTitles];
    })
const sortings = computed(() => {
      const allLabelTitles = new Set(
        npcStore.getAllLabels.filter((x: any) => x.title && x.title.length > 0)
          .map((x: any) => x.title)
      );

      const statSortings = new Set(
        doodads.value.flatMap((x) => x.StatController.DisplayKeys.map((k) => k.title))
      );

      const baseSortings = ['Name', 'Created', 'Updated'];

      return [...baseSortings, ...statSortings, ...allLabelTitles];
    })

function openItem(item) {
      selected.value = item;
      view.value.dialog = true;
    }
async function addNew() {
      const d = new Doodad();
      await NpcStore().AddNpc(d);
      selected.value = d;
      view.value.dialog = true;
    }
function SaveAndClose() {
      selected.value = null;
      view.value.dialog = false;
    }
function exit() {
      selected.value = null;
      view.value.dialog = false;
    }

onMounted(() => {
if (props.id) {
      const item = NpcStore().getNpcByID(props.id);
      if (item && item instanceof Doodad) {
        selected.value = item;
        view.value.dialog = true;
      }
    }
})
</script>
