<template>
  <v-card v-if="!item.Data" variant="outlined" color="panel" class="pa-6 ma-2">
    <div class="text-center text-caption text-disabled"><i>{{ $t('gm.narrativeLink.noElementSelected') }}</i></div>
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
          <div>{{ $t('gm.narrativeLink.linkedHelp') }}</div>
          <div class="my-4">{{ $t('gm.narrativeLink.relinkHelp') }}</div>
          <v-btn
            block
            color="error"
            variant="tonal"
            prepend-icon="mdi-link-off"
            @click="item.Unlink()">
            {{ $t('gm.narrativeLink.unlinkElement') }}
          </v-btn>
        </v-card-text>
        <v-card-text v-else>
          <div>{{ $t('gm.narrativeLink.notLinkedHelp') }}</div>
          <div class="mt-4">{{ $t('gm.narrativeLink.linkHelp') }}</div>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-spacer />
    <v-menu v-model="menu" width="40vw" :close-on-content-click="false">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="accent" size="x-small" variant="tonal">
          {{ $t('gm.narrativeLink.setNarrativeElement') }}
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="search"
            :placeholder="$t('common.search')"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-magnify"
            clearable />
          <v-tabs v-model="tab">
            <v-tab v-for="t in ['Characters', 'Locations', 'Factions']" :key="t">
              {{ t }}
            </v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item v-for="(t, index) in [characters, locations, factions]" :key="`tab-${index}`">
              <v-list density="compact" lines="three">
                <v-list-item
                  v-for="(e, i) in t"
                  :key="e.ID"
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NarrativeStore } from '@/stores';
import NarrativeContent from './NarrativeContent.vue';

defineOptions({ name: 'narrative-content-container' })

const props = defineProps<{
  item: object
}>()

const menu = ref(false)
const tab = ref(0)
const search = ref('')

const characters = computed(() => {
      const arr = NarrativeStore().getCharacters.filter((x) => !x.SaveController.IsDeleted);
      if (search.value)
        return arr.filter((x) => x.Name.toLowerCase().includes(search.value.toLowerCase()));
      return arr;
    })
const locations = computed(() => {
      const arr = NarrativeStore().getLocations.filter((x) => !x.SaveController.IsDeleted);
      if (search.value)
        return arr.filter((x) => x.Name.toLowerCase().includes(search.value.toLowerCase()));
      return arr;
    })
const factions = computed(() => {
      const arr = NarrativeStore().getFactions.filter((x) => !x.SaveController.IsDeleted);
      if (search.value)
        return arr.filter((x) => x.Name.toLowerCase().includes(search.value.toLowerCase()));
      return arr;
    })
const isItemLinked = computed(() => {
      return (
        props.item.Data &&
        props.item.Data.ID &&
        NarrativeStore()
          .CollectionItems.filter((x) => !x.SaveController.IsDeleted)
          .find((x) => x.ID === props.item.Data.ID)
      );
    })

function select(e) {
      props.item.Data = e;
      menu.value = false;
    }
function getIcon(e) {
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
    }
function getSubtitle(e) {
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
    }
</script>
