<template>
  <gm-split-view :title="itemType + 's'"
    :item-type="itemType"
    :items="items"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)">
    <component :is="editorComponent"
      v-if="selected"
      :item="selected"
      :footer-offset="view !== 'collection'"
      hide-toolbar
      @exit="exit()" />
    <no-gm-item v-else />
  </gm-split-view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { INarrativeElement } from '@/classes/narrative/INarrativeElement';
import { NarrativeStore } from '../../store/narrative_store';
import { Character } from '@/classes/narrative/Character';
import { Location } from '@/classes/narrative/Location';
import { Faction } from '@/classes/narrative/Faction';
import CharacterEditor from './characterEditor.vue';
import LocationEditor from './locationEditor.vue';
import FactionEditor from './factionEditor.vue';
import GmSplitView from '../../_views/GMSplitView.vue';
import NoGmItem from '../../_views/_components/NoGmItem.vue';

defineOptions({ name: 'CharacterRoster' })

const props = withDefaults(defineProps<{
  itemType: string
  id?: string
  view?: string
}>(), {
  id: null,
  view: 'collection'
})

const selected = ref(null as INarrativeElement | null)

const allNarrativeItems = computed(() => {
      return NarrativeStore().CollectionItems.length;
    })
const groupings = computed(() => {
      const baseGroupings = ['None', 'Folder'];

      const allLabelTitles = new Set(
        NarrativeStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      return [...baseGroupings, ...allLabelTitles];
    })
const sortings = computed(() => {
      const allLabelTitles = new Set(
        NarrativeStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseSortings = ['Name', 'Created', 'Updated'];

      return [...baseSortings, ...allLabelTitles];
    })
const editorComponent = computed(() => {
      switch (props.itemType) {
        case 'Character':
          return CharacterEditor;
        case 'Location':
          return LocationEditor;
        case 'Faction':
          return FactionEditor;
        default:
          return null;
      }
    })
const items = computed(() => {
      switch (props.itemType) {
        case 'Character':
          return NarrativeStore().getCharacters.filter((x) => !x.SaveController.IsDeleted);
        case 'Location':
          return NarrativeStore().getLocations.filter((x) => !x.SaveController.IsDeleted);
        case 'Faction':
          return NarrativeStore().getFactions.filter((x) => !x.SaveController.IsDeleted);
        default:
          return [];
      }
    })

function exit() {
      selected.value = null;
    }
function openItem(item) {
      selected.value = item;
    }
function addNew() {
      let e;
      switch (props.itemType) {
        case 'Character':
          e = new Character();
          break;
        case 'Location':
          e = new Location();
          break;
        case 'Faction':
          e = new Faction();
          break;
      }
      NarrativeStore().AddItem(e);
      selected.value = e;
    }

onMounted(() => {
if (props.id) {
      const item = NarrativeStore().getItemByID(props.id);
      if (item) {
        selected.value = item;
      }
    }
})
</script>
