<template>
  <v-container fluid>
    <div
      v-if="!mobile"
      class="font-weight-light text-center my-n4"
      style="letter-spacing: 2vw !important; font-size: 3.6vw !important"
    >
      {{ $t('compendium.shared.reference') }}
    </div>
    <v-row
      density="compact"
      justify="center"
    >
      <v-col
        lg="8"
        xs="12"
      >
        <search-bar reference />
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row
      density="compact"
      :justify="$vuetify.display.mdAndDown ? 'space-between' : 'space-around'"
      align="center"
    >
      <compendium-page-button
        color="exotic"
        icon="mdi-search-web"
        :name="$t('nav.nav.quickReference')"
        to="srd/reference/reference"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:save"
        :name="$t('compendium.reference.lancerBasics')"
        to="srd/reference/basics"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:pilot"
        :name="$t('compendium.shared.referencePilots')"
        to="srd/reference/pilots"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:frame"
        :name="$t('compendium.shared.referenceMechs')"
        to="srd/reference/mechs"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:ammo"
        :name="$t('compendium.shared.referenceCombat')"
        to="srd/reference/combat"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:downtime"
        :name="$t('compendium.shared.referenceNarrativePlay')"
        to="srd/reference/narrative"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:repair"
        :name="$t('compendium.shared.referenceErrata')"
        to="srd/reference/errata"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:compendium"
        :name="$t('compendium.shared.referenceGlossary')"
        to="srd/reference/glossary"
      />
      <compendium-page-button
        color="exotic"
        icon="cc:system_point"
        :name="$t('compendium.reference.usingCompcon')"
        to="srd/reference/compcon"
        disabled
      />
    </v-row>
    <cc-icon-divider
      icon="cc:compendium"
      class="mb-n4"
    />

    <v-row>
      <compendium-page-button
        icon="cc:reserve_mech"
        :name="$t('common.reserves')"
        to="/srd/compendium/reserves"
      />
      <compendium-page-button
        icon="cc:status_exposed"
        :name="$t('compendium.categories.statusesConditions')"
        to="/srd/compendium/statuses"
      />
      <compendium-page-button
        icon="mdi-tag"
        :name="$t('compendium.categories.equipmentTags')"
        to="/srd/compendium/tags"
      />
      <compendium-page-button
        color="primary"
        icon="mdi-map"
        :name="$t('compendium.categories.environments')"
        to="/srd/compendium/environments"
      />
      <compendium-page-button
        color="primary"
        icon="mdi-timeline-text-outline"
        :name="$t('compendium.categories.sitreps')"
        to="/srd/compendium/sitreps"
      />
      <compendium-page-button
        color="primary"
        icon="cc:downtime"
        :name="$t('compendium.categories.downtimeActions')"
        to="/srd/compendium/downtime"
      />
      <compendium-page-button
        color="primary"
        icon="mdi-table-multiple"
        :name="$t('common.tables')"
        to="/srd/compendium/tables"
      />
      <compendium-page-button
        color="primary"
        icon="mdi-list-box-outline"
        :name="$t('compendium.shared.lists')"
        to="/srd/compendium/lists"
      />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useDisplay } from 'vuetify'
  import SearchBar from '../../SearchBar.vue'
  import CompendiumPageButton from '../../components/CompendiumPageButton.vue'

  const { smAndDown: mobile, xs: portrait } = useDisplay()
</script>
