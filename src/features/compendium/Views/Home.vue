<template>
  <div>
    <v-container fluid>
      <div class="display-3 text-center mt-n2 mb-n2" style="letter-spacing: 15px!important">
        COMPENDIUM
      </div>
      <v-row justify="center">
        <v-col cols="8">
          <search-bar />
        </v-col>
      </v-row>
    </v-container>
    <div class="ml-5 mr-5">
      <v-container fluid grid-list-lg class="mt-0 pt-0">
        <v-row dense justify="space-around" align="center">
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="mdi-factory"
            name="Manufacturers"
            @clicked="$router.push('compendium/manufacturers')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="mdi-view-week"
            name="Licenses"
            @clicked="$router.push('compendium/licenses')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-corebonus"
            name="CORE Bonuses"
            @clicked="$router.push('compendium/corebonuses')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="frame"
            icon="cci-frame"
            name="Frames"
            @clicked="$router.push('compendium/frames')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="weapon"
            icon="cci-melee"
            name="Mech Weapons"
            @clicked="$router.push('compendium/weapons')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="system"
            icon="mdi-chip"
            name="Mech Systems"
            @clicked="$router.push('compendium/systems')"
          />
          <compendium-page-button
            lg="3"
            md="6"
            sm="12"
            color="secondary"
            icon="cci-pilot"
            name="Pilot Gear"
            @clicked="$router.push('compendium/pilot_gear')"
          />
          <compendium-page-button
            lg="3"
            md="6"
            sm="12"
            color="secondary"
            icon="public"
            name="Backgrounds"
            @clicked="$router.push('compendium/backgrounds')"
          />
          <compendium-page-button
            lg="3"
            md="6"
            sm="12"
            color="secondary"
            icon="cci-accuracy"
            name="Skill Triggers"
            @clicked="$router.push('compendium/skills')"
          />
          <compendium-page-button
            lg="3"
            md="6"
            sm="12"
            color="secondary"
            icon="cci-rank-3"
            name="Talents"
            @clicked="$router.push('compendium/talents')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cci-role-striker"
            name="NPC Classes"
            @clicked="$router.push('compendium/npc_classes')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cci-role-striker"
            name="NPC Features"
            @clicked="$router.push('compendium/npc_features')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cci-role-striker"
            name="NPC Templates"
            @clicked="$router.push('compendium/npc_templates')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="mdi-gauge"
            name="Statuses & Conditions"
            @clicked="$router.push('compendium/statuses')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-barrage"
            name="Reserves"
            @clicked="$router.push('compendium/reserves')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="mdi-map"
            name="Action Economy"
            @clicked="$router.push('compendium/actions')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="mdi-tag"
            name="Equipment Tags"
            @clicked="$router.push('compendium/tags')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="mdi-map"
            name="Reference"
            @clicked="$router.push('compendium/reference')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="mdi-library-books"
            name="Glossary"
            @clicked="$router.push('compendium/glossary')"
          />
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchBar from '../SearchBar.vue'
import CompendiumPageButton from '../components/CompendiumPageButton.vue'

export default Vue.extend({
  name: 'compendium-home',
  components: { SearchBar, CompendiumPageButton },
})
</script>
