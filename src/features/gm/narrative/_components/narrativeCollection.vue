<template>
  <gm-collection-view
    :title="itemType + 's'"
    :item-type="itemType"
    :items="items"
    :groupings="groupings"
    :sortings="sortings"
    @add-new="addNew()"
    @open="openItem($event)">
  </gm-collection-view>
  <v-dialog v-model="dialog" fullscreen>
    <v-card flat>
      <component
        v-if="dialog && selected"
        :is="editorComponent"
        :item="selected"
        @exit="dialog = false"
        @save="SaveAndClose()" />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { INarrativeElement } from '@/classes/narrative/INarrativeElement';
import GmCollectionView from '../../_views/GMCollectionView.vue';
import { NarrativeStore } from '../../store/narrative_store';
import { Character } from '@/classes/narrative/Character';
import { Location } from '@/classes/narrative/Location';
import { Faction } from '@/classes/narrative/Faction';
import CharacterEditor from './characterEditor.vue';
import LocationEditor from './locationEditor.vue';
import FactionEditor from './factionEditor.vue';

export default {
  name: 'character-roster',
  components: { GmCollectionView },
  props: {
    itemType: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    selected: null as INarrativeElement | null,
  }),
  computed: {
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

      const baseSortings = ['Name'];

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
      this.dialog = true;
    },
    addNew() {
      switch (this.itemType) {
        case 'Character':
          this.selected = new Character();
          break;
        case 'Location':
          this.selected = new Location();
          break;
        case 'Faction':
          this.selected = new Faction();
          break;
        default:
          this.selected = null;
          break;
      }
      this.dialog = true;
    },
    SaveAndClose() {
      this.selected = null;
      this.dialog = false;
    },
  },
};
</script>
