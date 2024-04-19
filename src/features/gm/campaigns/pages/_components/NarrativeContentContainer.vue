<template>
  <v-card v-if="!item.Data" variant="outlined" color="panel" class="pa-6 ma-2">
    <div class="text-center text-caption text-disabled"><i>No Element Selected</i></div>
  </v-card>
  <v-card v-else class="pa-2 ma-2" variant="outlined" color="panel">
    <narrative-content :data="item.Data" />
  </v-card>

  <v-footer height="35">
    <v-menu width="40vw">
      <template #activator="{ props }">
        <v-btn v-bind="props" size="x-small" icon class="mt-n1 ml-n3 elevation-0">
          <v-icon
            size="x-large"
            icon="mdi-link-variant"
            :color="isItemLinked ? 'success' : 'rgba(155,155,155,0.5)'" />
        </v-btn>
      </template>
      <v-card>
        <v-card-text v-if="isItemLinked">
          <div>
            This item is currently linked to a Narrative Element in your GM Collection. As
            modifications are made to the linked element, this item will automatically receive
            updates. Click the button to unlink this item from the GM Collection and store it as an
            instanced element in campaign data.
          </div>
          <div class="my-4">
            To re-link this item, select it in the "Set Narrative Element" menu.
          </div>
          <v-btn
            block
            color="error"
            variant="tonal"
            prepend-icon="mdi-link-off"
            @click="item.Unlink()">
            Unlink Element
          </v-btn>
        </v-card-text>
        <v-card-text v-else>
          <div>
            This item is not linked to a Narrative Element in your GM Collection and will not
            receive automatic updates, but will be saved as a instanced element in campaign data.
          </div>
          <div class="mt-4">
            To link this item to a Narrative Element, select it in the "Set Narrative Element" menu.
          </div>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-spacer />
    <v-menu v-model="menu" width="40vw" :close-on-content-click="false">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="accent" size="x-small" variant="tonal">
          Set Narrative Element
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="search"
            placeholder="Search"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-magnify"
            clearable />
          <v-tabs v-model="tab">
            <v-tab v-for="t in ['Characters', 'Locations', 'Factions']">
              {{ t }}
            </v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item v-for="t in [characters, locations, factions]">
              <v-list density="compact" lines="three">
                <v-list-item
                  v-for="(e, i) in t"
                  :style="i % 2 ? 'background-color: rgba(155,155,155,0.1)' : ''"
                  :title="e.Name"
                  :prepend-avatar="e.Portrait"
                  @click="select(e)">
                  <template #subtitle>
                    <span v-html-safe="getSubtitle(e)" />
                  </template>
                </v-list-item>
              </v-list>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-footer>
</template>

<script lang="ts">
import { NarrativeStore } from '@/stores';
import NarrativeContent from './NarrativeContent.vue';

export default {
  name: 'narrative-content-container',
  components: { NarrativeContent },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    menu: false,
    tab: 0,
    search: '',
  }),
  computed: {
    characters() {
      const arr = NarrativeStore().getCharacters.filter((x) => !x.SaveController.IsDeleted);
      if (this.search)
        return arr.filter((x) => x.Name.toLowerCase().includes(this.search.toLowerCase()));
      return arr;
    },
    locations() {
      const arr = NarrativeStore().getLocations.filter((x) => !x.SaveController.IsDeleted);
      if (this.search)
        return arr.filter((x) => x.Name.toLowerCase().includes(this.search.toLowerCase()));
      return arr;
    },
    factions() {
      const arr = NarrativeStore().getFactions.filter((x) => !x.SaveController.IsDeleted);
      if (this.search)
        return arr.filter((x) => x.Name.toLowerCase().includes(this.search.toLowerCase()));
      return arr;
    },
    isItemLinked() {
      return (
        this.item.Data &&
        this.item.Data.ID &&
        NarrativeStore()
          .CollectionItems.filter((x) => !x.SaveController.IsDeleted)
          .find((x) => x.ID === this.item.Data.ID)
      );
    },
  },
  methods: {
    select(e) {
      this.item.Data = e;
      this.menu = false;
    },
    getIcon(e) {
      switch (e.ItemType) {
        case 'Character':
          return 'mdi-account';
        case 'Location':
          return 'mdi-map-marker';
        case 'Faction':
          return 'mdi-account-group';
        default:
          return '';
      }
    },
    getSubtitle(e) {
      switch (e.ItemType) {
        case 'Character':
          return `${e.Title}${e.Alias ? `  //  ${e.Alias}` : ''} (${e.Pronouns})<br>${
            e.Description
          }`;
        case 'Faction':
          return `${e.FactionType}<br> ${e.Description}`;
        default:
          return e.Description;
      }
    },
  },
};
</script>
