<template>
  <cc-alert prominent
    icon="mdi-alert"
    title="Development Preview"
    class="ma-4"
    color="warning">
    Campaigns are currently in active development and will not be deployed until v3.1. This preview
    should be ignored for testing, but feel free to explore the existing functionality.
  </cc-alert>
  <v-container fluid>
    <div v-if="!mobile"
      class="font-weight-light text-center my-n4"
      style="letter-spacing: 2vw !important; font-size: 3.6vw !important">
      CAMPAIGN LIBRARY
    </div>
    <v-row density="compact"
      justify="center">
      <v-col lg="8"
        xs="12">
        <div class="top-element">
          <v-text-field ref="input"
            v-model="search"
            class="search-field"
            tile
            flat
            hide-details
            variant="solo"
            density="compact"
            placeholder="Search the Campaign Library"
            @update:focused="isFocused = $event">
            <template #prepend>
              <div class="prepend bg-panel"
                :class="isFocused && 'color-rotate'"
                style="min-width: 42px">
                <v-icon icon="mdi-magnify"
                  size="34"
                  class="mt-1 ml-3 mr-2" />
              </div>
            </template>
            <template #append>
              <div :class="`bg-panel ${isFocused && 'color-rotate'}`"
                style="
                  transition: filter 0.2s ease-in-out;
                  width: 3px;
                  height: 100%;
                  margin-left: 4px;
                  z-index: 1;
                " />
            </template>
          </v-text-field>
        </div>
      </v-col>
    </v-row>

    <campaign-bookshelf :search="search" />
  </v-container>
</template>

<script lang="ts">
import SearchBar from '../../SearchBar.vue';
import CampaignBookshelf from './components/CampaignBookshelf.vue';
import { useMobile } from '@/composables/useMobile';


export default {
  mixins: [useMobile],
  name: 'compendium-home',
  components: { SearchBar, CampaignBookshelf },
  data: () => ({
    search: '',
    isFocused: false,
  }),
};
</script>

<style scoped>
@import '../../search-bar.css';
</style>
