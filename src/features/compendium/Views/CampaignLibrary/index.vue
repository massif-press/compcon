<template>
  <v-container fluid>
    <div
      v-if="!mobile"
      class="font-weight-light text-center my-n4"
      style="letter-spacing: 2vw !important; font-size: 3.6vw !important">
      CAMPAIGN LIBRARY
    </div>
    <v-row density="compact" justify="center">
      <v-col lg="8" xs="12">
        <div class="top-element">
          <v-text-field
            ref="input"
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
              <div
                class="prepend bg-panel"
                :class="isFocused && 'color-rotate'"
                style="min-width: 42px">
                <v-icon icon="mdi-magnify" size="34" class="mt-1 ml-3 mr-2" />
              </div>
            </template>
            <template #append>
              <div
                :class="`bg-panel ${isFocused && 'color-rotate'}`"
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

export default {
  name: 'compendium-home',
  components: { SearchBar, CampaignBookshelf },
  data: () => ({
    search: '',
    isFocused: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

<style scoped>
.top-element >>> .v-input--horizontal .v-input__prepend {
  margin-inline-end: 0px !important;
}

.top-element >>> .v-input--horizontal .v-input__append {
  margin-inline-start: 0px !important;
}

.top-element >>> .v-field__input {
  min-height: auto !important;
}

.top-element >>> .v-field {
  transition: all 0.1s ease-in-out;
}

.color-rotate {
  filter: brightness(1.5) saturate(200%) hue-rotate(40deg);
}

.prepend {
  height: 100%;
  margin-right: -1px;
  min-width: 16px;
  clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
  z-index: 1;
  transition: all 0.1s ease-in-out;
}

.offset {
  margin-top: -5px;
}
</style>
