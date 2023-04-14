<template>
  <div>
    <v-container fluid>
      <div
        class="font-weight-light text-center my-n2"
        :style="
          $vuetify.display.mdAndDown
            ? 'letter-spacing: 1vw!important; font-size: 7vw!important;'
            : 'letter-spacing: 2vw!important; font-size: 4vw!important;'
        "
      >
        COMPENDIUM
      </div>
      <v-row density="compact" justify="center">
        <v-col lg="8" xs="12">
          <search-bar />
        </v-col>
      </v-row>
    </v-container>
    <div>
      <v-container grid-list-lg class="mt-0 pt-0">
        <v-row
          density="compact"
          :justify="
            $vuetify.display.smAndDown ? 'space-between' : 'space-around'
          "
          align="center"
        >
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cc:manufacturer"
            name="Manufacturers"
            to="compendium/manufacturers"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cc:license"
            name="Licenses"
            to="compendium/licenses"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cc:corebonus"
            name="CORE Bonuses"
            to="compendium/corebonuses"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="frame"
            icon="cc:frame"
            name="Frames"
            to="compendium/frames"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="weapon"
            icon="cc:melee"
            name="Mech Weapons"
            to="compendium/weapons"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="system"
            icon="mdi-chip"
            name="Mech Systems"
            to="compendium/systems"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="secondary"
            icon="cc:pilot"
            name="Pilot Gear"
            to="compendium/pilot_gear"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="secondary"
            icon="cc:orbit"
            name="Backgrounds"
            to="compendium/backgrounds"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="secondary"
            icon="cc:accuracy"
            name="Skill Triggers"
            to="compendium/skills"
          />
          <compendium-page-button
            :lg="hasBonds ? '6' : '4'"
            md="6"
            sm="12"
            color="secondary"
            icon="cc:rank_3"
            name="Talents"
            to="compendium/talents"
          />
          <compendium-page-button
            v-show="hasBonds"
            lg="6"
            md="6"
            sm="12"
            color="secondary"
            icon="mdi-vector-link"
            name="Bonds"
            to="compendium/bonds"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cc:npc_class"
            name="NPC Classes"
            to="compendium/npc_classes"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cc:npc_feature"
            name="NPC Features"
            to="compendium/npc_features"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cc:npc_template"
            name="NPC Templates"
            to="compendium/npc_templates"
          />
        </v-row>
        <v-row align="center">
          <v-col>
            <v-divider />
          </v-col>
          <v-col cols="auto" class="heading h6"> Reference </v-col>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>

        <v-row
          density="compact"
          :justify="
            $vuetify.display.smAndDown ? 'space-between' : 'space-around'
          "
          align="center"
        >
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cc:status_exposed"
            name="Statuses & Conditions"
            to="compendium/statuses"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cc:reserve_mech"
            name="Reserves"
            to="compendium/reserves"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cc:activate"
            name="Action Economy"
            to="compendium/actions"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="mdi-tag"
            name="Equipment Tags"
            to="compendium/tags"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cc:accuracy"
            name="Reference"
            to="compendium/reference"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cc:compendium"
            name="Glossary"
            to="compendium/glossary"
          />
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import SearchBar from '../SearchBar.vue';
import CompendiumPageButton from '../components/CompendiumPageButton.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'compendium-home',
  components: { SearchBar, CompendiumPageButton },
  computed: {
    hasBonds() {
      return CompendiumStore().Bonds.length > 0;
    },
  },
};
</script>
