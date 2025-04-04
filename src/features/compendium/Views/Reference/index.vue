<template>
  <v-container fluid>
    <div
      v-if="!mobile"
      class="font-weight-light text-center my-n4"
      style="letter-spacing: 2vw !important; font-size: 3.6vw !important">
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
      :justify="$vuetify.display.mdAndDown ? 'space-between' : 'space-around'"
      align="center">
      <compendium-page-button
        color="exotic"
        icon="mdi-search-web"
        name="Quick Reference"
        to="srd/reference/reference" />
      <compendium-page-button
        color="exotic"
        icon="cc:save"
        name="Basics"
        to="srd/reference/basics" />
      <compendium-page-button
        color="exotic"
        icon="cc:pilot"
        name="Pilots"
        to="srd/reference/pilots" />
      <compendium-page-button
        color="exotic"
        icon="cc:frame"
        name="Mechs"
        to="srd/reference/mechs" />
      <compendium-page-button
        color="exotic"
        icon="cc:ammo"
        name="Combat"
        to="srd/reference/combat" />
      <compendium-page-button
        color="exotic"
        icon="cc:downtime"
        name="Narrative Play"
        to="srd/reference/narrative" />
      <compendium-page-button
        color="exotic"
        icon="cc:repair"
        name="FAQ & Errata"
        to="srd/reference/errata" />
      <compendium-page-button
        color="exotic"
        icon="cc:compendium"
        name="Glossary"
        to="srd/reference/glossary" />
      <compendium-page-button
        color="exotic"
        icon="cc:system_point"
        name="Using COMP/CON"
        to="srd/reference/compcon"
        disabled />
    </v-row>
    <cc-icon-divider icon="cc:compendium" class="mb-n4" />

    <v-row>
      <compendium-page-button
        icon="cc:reserve_mech"
        name="Reserves"
        to="/srd/compendium/reserves" />
      <compendium-page-button
        icon="cc:status_exposed"
        name="Statuses & Conditions"
        to="/srd/compendium/statuses" />
      <compendium-page-button icon="mdi-tag" name="Equipment Tags" to="/srd/compendium/tags" />
      <compendium-page-button
        color="primary"
        icon="mdi-map"
        name="Environments"
        to="/srd/compendium/environments" />
      <compendium-page-button
        color="primary"
        icon="mdi-timeline-text-outline"
        name="Sitreps"
        to="/srd/compendium/sitreps" />
      <compendium-page-button
        color="primary"
        icon="cc:downtime"
        name="Downtime Actions"
        to="/srd/compendium/downtime" />
      <compendium-page-button
        color="primary"
        icon="mdi-folder-table-outline"
        name="Table Browser"
        to="/srd/compendium/tables" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import SearchBar from '../../SearchBar.vue';
import CompendiumPageButton from '../../components/CompendiumPageButton.vue';

export default {
  name: 'compendium-home',
  components: { SearchBar, CompendiumPageButton },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
