<template>
  <div>
    <v-container fluid>
      <div
        class="font-weight-light text-center my-n2"
        :style="
          $vuetify.breakpoint.mdAndDown
            ? 'letter-spacing: 1vw!important; font-size: 7vw!important;'
            : 'letter-spacing: 2vw!important; font-size: 4vw!important;'
        "
      >
        COMPENDIUM
      </div>
      <v-row dense justify="center">
        <v-col lg="8" xs="12">
          <search-bar />
        </v-col>
      </v-row>
    </v-container>
    <div>
      <v-container fluid grid-list-lg class="mt-0 pt-0">
        <v-row
          dense
          :justify="$vuetify.breakpoint.smAndDown ? 'space-between' : 'space-around'"
          align="center"
        >
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-manufacturer"
            name="Manufacturers"
            @clicked="$router.push('compendium/manufacturers')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cci-license"
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
            icon="cci-npc-class"
            name="NPC Classes"
            @clicked="$router.push('compendium/npc_classes')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cci-npc-feature"
            name="NPC Features"
            @clicked="$router.push('compendium/npc_features')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cci-npc-template"
            name="NPC Templates"
            @clicked="$router.push('compendium/npc_templates')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-status-exposed"
            name="Statuses & Conditions"
            @clicked="$router.push('compendium/statuses')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-reserve-tac"
            name="Reserves"
            @clicked="$router.push('compendium/reserves')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-activate"
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
            icon="cci-accuracy"
            name="Reference"
            @clicked="$router.push('compendium/reference')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-compendium"
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
