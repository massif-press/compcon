<template>
  <v-dialog>
    <template #activator="{ props }">
      <div class="d-flex flex-column align-end">
        <cc-button color="accent"
          prepend-icon="mdi-plus"
          class="mt-2"
          v-bind="props">
          {{ $t("mainMenu.collection.addItem") }}
        </cc-button>
      </div>
    </template>
    <template #default="{ isActive }">
      <v-card min-height="90vh">
        <v-toolbar density="compact"
          color="primary">
          <v-toolbar-title>{{ $t("mainMenu.collection.addCollectionItem") }}</v-toolbar-title>
          <v-text-field v-model="search"
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
            :label="$t('common.search')"
            hide-details />
          <v-spacer />
          <v-btn icon
            @click="isActive.value = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout>
          <v-navigation-drawer>
            <v-list v-model="selectedType"
              density="compact"
              :items="itemTypes"
              @click:select="selectedType = $event.id" />
          </v-navigation-drawer>
          <v-main>
            <v-card-text>
              <div class="heading h3">{{ selectedType }}</div>
              <v-divider />
              <v-alert v-if="selectedType === 'campaigns' || selectedType === 'lcps'"
                color="warning"
                prominent
                density="compact"
                class="my-2"
                icon="mdi-alert">
                <strong>{{ $t('common.warning') }}:</strong>
                {{ $t("mainMenu.collection.distributeWarning") }}
                <br />
                {{ $t("mainMenu.collection.ensureRights") }}
              </v-alert>
              <v-data-table :items="filteredItems"
                :headers="<any>headers"
                :items-per-page="-1"
                hide-default-footer>
                <template #item.updated="{ item }">
                  {{ new Date((item as any).SaveController.LastModified).toLocaleString() }}
                </template>
                <template #item.actions="{ item }">
                  <v-btn icon
                    variant="tonal"
                    color="accent"
                    size="small"
                    @click="AddItem(item)">
                    <v-icon size="large"
                      icon="mdi-plus" />
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

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import {
CampaignStore,
CompendiumStore,
EncounterStore,
NarrativeStore,
NpcStore,
PilotStore,
} from '@/stores';

defineOptions({ name: 'collection-item-selector' })

const props = withDefaults(defineProps<{
  addedItems?: any[]
}>(), {
  addedItems: () => []
})

const emit = defineEmits<{
  'add-item': [payload: any]
}>()

const search = ref('')
const selectedType = ref('pilots' as any)
const itemTypes = ref([
      { title: t('mainMenu.titles.pilots'), value: 'pilots' },
      { title: t('common.npcs'), value: 'npcs' },
      { title: t('common.encounters'), value: 'encounters' },
      { title: t('mainMenu.titles.narrativeElements'), value: 'narrative' },
      // { title: t('mainMenu.titles.campaigns'), value: 'campaigns' },
      // { title: t('mainMenu.titles.lcps'), value: 'lcps' },
    ])

const filteredItems = computed(() => {
      let items = [] as any;
      switch (selectedType.value) {
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

      items = items.filter((item: any) => !props.addedItems.includes(item.ID));

      return search.value
        ? items.filter((item: any) => item.Name.toLowerCase().includes(search.value.toLowerCase()))
        : items;
    })
const headers = computed(() => {
      let base = [
        { title: 'Name', value: 'Name' },
        { title: t('common.type'), value: 'ItemType' },
      ] as any;
      switch (selectedType.value) {
        case 'pilots':
          base = [
            ...base,
            { title: t('common.player'), value: 'Player' },
            { title: t('common.callsign'), value: 'Callsign' },
            { title: t('mainMenu.titles.licenseLevel'), value: 'Level', align: 'center' },
            { title: t('common.status'), value: 'Status' },
            { title: t('mainMenu.titles.lastUpdate'), key: 'updated' },
          ];
          break;
        case 'npcs':
          base = [
            ...base,
            { title: t('mainMenu.titles.role'), value: 'Role' },
            { title: t('mainMenu.titles.lastUpdate'), key: 'updated' },
          ];
          break;
        case 'encounters':
          base = [...base, { title: t('mainMenu.titles.lastUpdate'), key: 'updated' }];
          break;
        case 'narrative':
          base = [...base, { title: t('mainMenu.titles.lastUpdate'), key: 'updated' }];
          break;
        case 'campaigns':
          base = [...base, { title: t('mainMenu.titles.lastUpdate'), key: 'updated' }];
          break;
        case 'lcps':
          base = [
            ...base,
            { title: t('mainMenu.titles.author'), value: 'Author' },
            { title: t('common.version'), value: 'Version' },
          ];
          break;
      }
      base.push({ title: t('mainMenu.titles.addItem'), value: 'actions', align: 'center' });
      return base;
    })

function AddItem(item: any) {
      emit('add-item', { type: selectedType.value, item });
      notify({
        title: t('mainMenu.account.itemAddedTitle'),
        text: t('mainMenu.account.itemAddedText', { name: item.Name }),
        color: 'success', icon: 'mdi-check',
      });
    }
</script>
