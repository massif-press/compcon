<template>
  <v-container fluid>
    <div
      class="font-weight-light text-center my-n4"
      style="letter-spacing: 2vw !important; font-size: 3.6vw !important">
      CAMPAIGN LIBRARY
    </div>
    <v-row density="compact" justify="center">
      <v-col lg="8" xs="12">
        <v-text-field
          v-model="search"
          class="search-field"
          prepend-inner-icon="mdi-magnify"
          solo
          hide-details
          placeholder="Search the Campaign Library" />
      </v-col>
    </v-row>
    <v-container>
      <campaign-bookshelf :search="search" />
    </v-container>
  </v-container>
</template>

<script lang="ts">
import SearchBar from '../../SearchBar.vue';
import CampaignBookshelf from './components/CampaignBookshelf.vue';

export default {
  name: 'compendium-home',
  components: { SearchBar, CampaignBookshelf },
  data: () => ({
    search: '',
  }),
};
</script>
