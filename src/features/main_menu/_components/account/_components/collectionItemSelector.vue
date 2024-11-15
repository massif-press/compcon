<template>
  <v-dialog>
    <template #activator="{ props }">
      <div class="text-right">
        <v-btn color="accent" size="small" prepend-icon="mdi-plus" class="mt-2" v-bind="props">
          Add Item
        </v-btn>
      </div>
    </template>
    <template #default="{ isActive }">
      <v-card min-height="90vh">
        <v-toolbar density="compact" color="primary">
          <v-toolbar-title>Add Collection Item</v-toolbar-title>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
            label="Search"
            hide-details />
          <v-spacer />
          <v-btn icon @click="isActive.value = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout>
          <v-navigation-drawer>
            <v-list
              v-model="selectedType"
              density="compact"
              :items="itemTypes"
              @click:select="selectedType = $event.id" />
          </v-navigation-drawer>
          <v-main>
            <v-card-text>
              <div class="heading h3">{{ selectedType }}</div>
              <v-divider />
              <v-alert
                v-if="selectedType === 'campaigns' || selectedType === 'lcps'"
                color="warning"
                prominent
                density="compact"
                class="my-2"
                icon="mdi-alert">
                <strong>Warning:</strong>
                Distributing content that you are not authorized to is against against the COMP/CON
                terms of service and will result in a ban from the cloud service, deletion of your
                cloud account and data, and removal and blocking from COMP/CON Patreon membership.
                <br />
                Please ensure you have the rights to distribute any content you add to the cloud
                service. If in doubt, contact the author of the content.
              </v-alert>
              <v-data-table
                :items="filteredItems"
                :headers="<any>headers"
                :items-per-page="-1"
                hide-default-footer>
                <template #item.updated="{ item }">
                  {{ new Date((item as any).SaveController.LastModified).toLocaleString() }}
                </template>
                <template #item.actions="{ item }">
                  <v-btn icon variant="tonal" color="accent" size="small" @click="AddItem(item)">
                    <v-icon size="large" icon="mdi-plus" />
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-main>
        </v-layout>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import {
  CampaignStore,
  CompendiumStore,
  EncounterStore,
  NarrativeStore,
  NpcStore,
  PilotStore,
} from '@/stores';

export default {
  name: 'collection-item-selector',
  props: {
    addedItems: { type: Array, default: () => [] },
  },
  emits: ['add-item'],
  data: () => ({
    search: '',
    selectedType: 'pilots' as any,
    itemTypes: [
      { title: 'Pilots', value: 'pilots' },
      { title: 'NPCs', value: 'npcs' },
      { title: 'Encounters', value: 'encounters' },
      { title: 'Narrative Elements', value: 'narrative' },
      // { title: 'Campaigns', value: 'campaigns' },
      // { title: 'LCPs', value: 'lcps' },
    ],
  }),
  computed: {
    filteredItems() {
      let items = [] as any;
      switch (this.selectedType) {
        case 'pilots':
          items = PilotStore().Pilots;
          break;
        case 'npcs':
          items = NpcStore().Npcs;
          break;
        case 'encounters':
          items = EncounterStore().Encounters;
          break;
        case 'narrative':
          items = NarrativeStore().CollectionItems;
          break;
        case 'campaigns':
          items = CampaignStore().Campaigns;
          break;
        case 'lcps':
          items = CompendiumStore().ContentPacks;
          break;
      }

      items = items.filter(
        (item: any) =>
          !item.SaveController.IsDeleted &&
          !item.SaveController.IsRemote &&
          (!item.BrewController || (item.BrewController && !item.BrewController.IsUnableToLoad))
      );

      items = items.filter((item: any) => !this.addedItems.includes(item.ID));

      return this.search
        ? items.filter((item: any) => item.Name.toLowerCase().includes(this.search.toLowerCase()))
        : items;
    },
    headers() {
      let base = [
        { title: 'Name', value: 'Name' },
        { title: 'Type', value: 'ItemType' },
      ] as any;
      switch (this.selectedType) {
        case 'pilots':
          base = [
            ...base,
            { title: 'Player', value: 'Player' },
            { title: 'Callsign', value: 'Callsign' },
            { title: 'License Level', value: 'Level', align: 'center' },
            { title: 'Status', value: 'Status' },
            { title: 'Last Update', key: 'updated' },
          ];
          break;
        case 'npcs':
          base = [
            ...base,
            { title: 'Role', value: 'Role' },
            { title: 'Last Update', key: 'updated' },
          ];
          break;
        case 'encounters':
          base = [...base, { title: 'Last Update', key: 'updated' }];
          break;
        case 'narrative':
          base = [...base, { title: 'Last Update', key: 'updated' }];
          break;
        case 'campaigns':
          base = [...base, { title: 'Last Update', key: 'updated' }];
          break;
        case 'lcps':
          base = [
            ...base,
            { title: 'Author', value: 'Author' },
            { title: 'Version', value: 'Version' },
          ];
          break;
      }
      base.push({ title: 'Add Item', value: 'actions', align: 'center' });
      return base;
    },
  },
  methods: {
    AddItem(item: any) {
      this.$emit('add-item', { type: this.selectedType, item });
      this.$notify({
        title: 'Item Added',
        text: `Item ${item.Name} added to collection`,
        data: { color: 'success', icon: 'mdi-check' },
      });
    },
  },
};
</script>
