<template>
  <cc-alert prominent
    icon="mdi-alert"
    :title="$t('compendium.titles.developmentPreview')"
    class="ma-4"
    color="warning">
    {{ $t('compendium.campaign.developmentPreview') }}
  </cc-alert>
  <v-container fluid>
    <div v-if="!mobile"
      class="font-weight-light text-center my-n4"
      style="letter-spacing: 2vw !important; font-size: 3.6vw !important">
      {{ $t('common.campaignLibrary') }}
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
            :placeholder="$t('compendium.fields.searchTheCampaignLibrary')"
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

<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '../../SearchBar.vue';
import CampaignBookshelf from './components/CampaignBookshelf.vue';
import { useDisplay } from 'vuetify';

defineOptions({ name: 'compendium-home' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const input = ref<any>(null)

const search = ref('')
const isFocused = ref(false)
</script>

<style scoped>
@import '../../search-bar.css';
</style>
