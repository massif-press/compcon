<template>
  <v-card flat
    border
    tile>
    <v-toolbar density="compact"
      color="panel">
      <v-toolbar-title>
        <cc-heading is-title
          text="Data Viewer"
          tooltip="This is a view of your COMP/CON data, stored both locally and in the cloud. You can
              use this tool to manage the state of your data, and to sync changes between your local
              data and the cloud." />
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip max-width="300px"
        location="top">
        <template #activator="{ props }">
          <div v-bind="props"
            class="mx-2">
            <cc-button v-bind="props"
              variant="tonal"
              :size="mobile ? 'small' : ''"
              :loading="loading"
              icon="mdi-refresh"
              @click="refresh()" />
          </div>
        </template>
        <div class="text-center">
          {{ $t("mainMenu.cloudData.reloadData") }}
          <br />
          {{ $t("mainMenu.ui.doesNotSync") }}
        </div>
      </v-tooltip>
      <template #extension>
        <cc-text-field v-if="!mobile"
          v-model="search"
          variant="outlined"
          color="primary"
          icon="mdi-magnify"
          bg-color="background"
          placeholder="Search"
          width="250px"
          clearable />
        <cc-select v-if="!mobile && tab === 0"
          v-model="itemTypeFilter"
          :items="syncableItemTypes"
          multiple
          small
          chip-variant="elevated"
          color="primary"
          density="compact"
          hide-details
          max="4"
          select-all
          icon="mdi-filter-variant"
          all-text="All Item Types"
          none-text="No Item Types"
          class="mx-2 mb-1" />
        <v-spacer />
        <v-tabs v-model="tab">
          <v-tab>
            <v-tooltip max-width="300px"
              location="top">
              <template #activator="{ props }">
                <span v-bind="props">{{ $t("mainMenu.cloudData.dataTab") }}</span>
              </template>
              <div class="text-center">{{ $t("mainMenu.cloudData.dataTabDesc") }}</div>
            </v-tooltip>
          </v-tab>
          <v-divider vertical />
          <v-tab>
            <v-tooltip max-width="300px"
              location="top">
              <template #activator="{ props }">
                <span v-bind="props">{{ $t("mainMenu.cloudData.imagesTab") }}</span>
              </template>
              <div class="text-center">
                {{ $t("mainMenu.cloudData.imagesTabDesc") }}
              </div>
            </v-tooltip>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-row v-if="mobile"
      no-gutters
      class="mx-1 mt-1">
      <v-col>
        <v-text-field v-model="search"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          density="compact"
          clearable
          hide-details />
      </v-col>
      <v-col v-if="tab === 0"
        cols="5"
        class="ml-1">
        <v-select v-model="itemTypeFilter"
          :items="syncableItemTypes"
          multiple
          density="compact"
          variant="outlined"
          hide-details
          placeholder="Filter" />
      </v-col>
    </v-row>
    <v-window v-model="tab">
      <v-window-item :value="0">
        <item-data-tab :search="search"
          :item-type-filter="itemTypeFilter"
          :loading="loading"
          @refresh="refresh" />
      </v-window-item>
      <v-window-item :value="1">
        <image-data-tab :search="search"
          :loading="loading"
          @refresh="refresh" />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { UserStore } from '@/stores'
import ItemDataTab from './data_viewer/ItemDataTab.vue'
import ImageDataTab from './data_viewer/ImageDataTab.vue'

const display = useDisplay()
const mobile = computed(() => display.mdAndDown.value)

const tab = ref(0)
const search = ref('')
const loading = ref(false)
const itemTypeFilter = ref<string[]>(['pilot', 'pilotgroup', 'npc', 'collectionItem', 'encounter', 'campaign'])

const syncableItemTypes = [
  { title: 'Pilot', value: 'pilot' },
  { title: 'Pilot Groups', value: 'pilotgroup' },
  { title: 'NPC', value: 'npc' },
  { title: 'Narrative Element', value: 'collectionItem' },
  { title: 'Encounter', value: 'encounter' },
  // { title: 'Campaign', value: 'campaign' },
]

watch(itemTypeFilter, (val) => {
  if (val) UserStore().User.SetView('cloudItemFilters', val)
})

async function refresh() {
  loading.value = true
  await UserStore().refreshDbData()
  loading.value = false
}

onMounted(async () => {
  itemTypeFilter.value = UserStore().User.View('cloudItemFilters', [
    'pilot', 'pilotgroup', 'npc', 'collectionItem', 'encounter', 'campaign',
  ])
  if (UserStore().IsLoggedIn) {
    await refresh()
  }
})
</script>

<style>
.v-data-table-header__content {
  font-weight: bold !important;
}
</style>
