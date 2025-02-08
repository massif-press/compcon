<template>
  <v-container>
    <div
      v-if="!mobile"
      class="font-weight-light text-center my-n4"
      style="letter-spacing: 2vw !important; font-size: 3.6vw !important">
      COMPENDIUM
    </div>
    <v-row justify="center">
      <v-col lg="8" xs="12">
        <search-bar />
      </v-col>
    </v-row>
  </v-container>
  <v-container class="mt-0 pt-0">
    <v-row
      :dense="mobile"
      :justify="$vuetify.display.smAndDown ? 'space-between' : 'space-around'"
      align="center">
      <compendium-page-button
        icon="cc:manufacturer"
        name="Manufacturers"
        to="/srd/compendium/manufacturers" />
      <compendium-page-button
        color="primary"
        icon="cc:license"
        name="Licenses"
        to="/srd/compendium/licenses" />
      <compendium-page-button
        icon="cc:corebonus"
        name="CORE Bonuses"
        to="/srd/compendium/corebonuses" />
      <compendium-page-button
        color="frame"
        icon="cc:frame"
        name="Frames"
        to="/srd/compendium/frames" />
      <compendium-page-button
        color="weapon"
        icon="cc:melee"
        name="Mech Weapons"
        to="/srd/compendium/weapons" />
      <compendium-page-button
        color="system"
        icon="mdi-chip"
        name="Mech Systems"
        to="/srd/compendium/systems" />
      <compendium-page-button
        color="secondary"
        icon="cc:pilot"
        name="Pilot Gear"
        to="/srd/compendium/pilot_gear" />
      <compendium-page-button
        color="secondary"
        icon="cc:orbit"
        name="Backgrounds"
        to="/srd/compendium/backgrounds" />
      <compendium-page-button
        color="secondary"
        icon="cc:accuracy"
        name="Skill Triggers"
        to="/srd/compendium/skills" />
      <compendium-page-button
        color="secondary"
        icon="cc:rank_3"
        name="Talents"
        to="/srd/compendium/talents" />
      <compendium-page-button
        color="secondary"
        icon="mdi-vector-link"
        name="Bonds"
        to="/srd/compendium/bonds" />
    </v-row>
    <cc-icon-divider icon="cc:campaign" class="mb-n4" />
    <v-row :dense="mobile">
      <compendium-page-button
        color="error"
        icon="cc:npc_class"
        name="NPC Classes"
        to="/srd/compendium/npc_classes" />
      <compendium-page-button
        color="error"
        icon="cc:npc_feature"
        name="NPC Features"
        to="/srd/compendium/npc_features" />
      <compendium-page-button
        color="error"
        icon="cc:npc_template"
        name="NPC Templates"
        to="/srd/compendium/npc_templates" />
      <compendium-page-button
        color="exotic"
        icon="cc:monist"
        name="Eidolon Layers"
        to="/srd/compendium/eidolon_layers" />
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
