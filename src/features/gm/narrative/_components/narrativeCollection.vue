<template>
  <gm-split-view
    :title="itemType + 's'"
    :item-type="itemType"
    :items="items"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)">
    <component
      v-if="selected"
      :is="editorComponent"
      :item="selected"
      :footer-offset="view !== 'collection'"
      hide-toolbar />
    <no-gm-item v-else />
  </gm-split-view>
</template>

<script lang="ts">
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

export default {
  name: 'character-roster',
  components: { GmSplitView, NoGmItem },
  props: {
    itemType: {
      type: String,
      required: true,
    },
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
    selected: null as INarrativeElement | null,
  }),
  mounted() {
    if (this.id) {
      const item = NarrativeStore().getItemByID(this.id);
      if (item) {
        this.selected = item;
      }
    }
  },
  computed: {
    allNarrativeItems() {
      return NarrativeStore().CollectionItems.length;
    },
    groupings() {
      const allLabelTitles = new Set(
        NarrativeStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      return ['None', ...allLabelTitles];
    },
    sortings() {
      const allLabelTitles = new Set(
        NarrativeStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseSortings = ['Name', 'Created', 'Updated'];

      return [...baseSortings, ...allLabelTitles];
    },
    editorComponent() {
      switch (this.itemType) {
        case 'Character':
          return CharacterEditor;
        case 'Location':
          return LocationEditor;
        case 'Faction':
          return FactionEditor;
        default:
          return null;
      }
    },
    items() {
      switch (this.itemType) {
        case 'Character':
          return NarrativeStore().getCharacters.filter((x) => !x.SaveController.IsDeleted);
        case 'Location':
          return NarrativeStore().getLocations.filter((x) => !x.SaveController.IsDeleted);
        case 'Faction':
          return NarrativeStore().getFactions.filter((x) => !x.SaveController.IsDeleted);
        default:
          return [];
      }
    },
  },
  methods: {
    openItem(item) {
      this.selected = item;
    },
    addNew() {
      let e;
      switch (this.itemType) {
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
      this.selected = e;
    },
  },
};
</script>
