<template>
  <v-container fluid>
    <div
      class="font-weight-light text-center my-n4"
      :style="
        $vuetify.display.mdAndDown
          ? 'letter-spacing: 1vw!important; font-size: 7vw!important;'
          : 'letter-spacing: 2vw!important; font-size: 4vw!important;'
      "
    >
      REFERENCE
    </div>
    <v-row density="compact" justify="center">
      <v-col lg="8" xs="12">
        <search-bar reference />
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row
      density="compact"
      :justify="$vuetify.display.smAndDown ? 'space-between' : 'space-around'"
      align="center"
    >
      <compendium-page-button
        color="exotic"
        icon="cc:save"
        name="Basics"
        to="srd/reference/basics"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:pilot"
        name="Pilots"
        to="srd/reference/pilots"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:frame"
        name="Mechs"
        to="srd/reference/mechs"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:ammo"
        name="Combat"
        to="srd/reference/combat"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:downtime"
        name="Narrative Play"
        to="srd/reference/narrative"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:repair"
        name="FAQ & Errata"
        to="srd/reference/errata"
        disabled
      />
      <compendium-page-button
        color="exotic"
        icon="cc:compendium"
        name="Glossary"
        to="srd/reference/glossary"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:system_point"
        name="Using COMP/CON"
        to="srd/reference/compcon"
        disabled
      />
      <compendium-page-button
        color="exotic"
        icon="mdi-search-web"
        name="Quick Reference"
        to="srd/reference/reference"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import SearchBar from '../../SearchBar.vue';
import CompendiumPageButton from '../../components/CompendiumPageButton.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'compendium-home',
  components: { SearchBar, CompendiumPageButton },
};
</script>
