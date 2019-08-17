<template>
  <div>
    <v-container fluid>
      <v-layout row class="compendium-header mt-0 pt-0 mb-3" justify-center>
        <v-flex>
          <h1 class="display-1 font-weight-thin">Compendium</h1>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs8 px-2 pb-3>
          <search-bar />
        </v-flex>
      </v-layout>
    </v-container>
    <div class="ml-5 mr-5">
      <v-container fluid grid-list-lg class="mt-0 pt-0">
        <v-layout row wrap justify-center>
          <category-card
            color="primary"
            icon="mdi-factory"
            loc="manufacturers"
            name="Manufacturers"
          />
          <category-card color="primary" icon="mdi-view-week" loc="licenses" name="Licenses" />
          <category-card
            color="primary"
            icon="mdi-hexagon-multiple"
            loc="corebonuses"
            name="CORE Bonuses"
          />
        </v-layout>
        <v-layout row wrap justify-center>
          <category-card color="frame" icon="cci-frame" loc="frames" name="Frames" />
          <category-card color="weapon" icon="cci-melee" loc="weapons" name="Mech Weapons" />
          <category-card color="system" icon="mdi-chip" loc="systems" name="Mech Systems" />
        </v-layout>
        <v-layout row wrap justify-center>
          <category-card color="primary" icon="cci-pilot" loc="pilot_gear" name="Equipment" />
          <category-card color="primary" icon="public" loc="backgrounds" name="Backgrounds" />
        </v-layout>
        <v-layout row wrap justify-center>
          <category-card color="trait" icon="cci-accuracy" loc="skills" name="Skill Triggers" />
          <category-card color="trait" icon="cci-rank-3" loc="talents" name="Talents" />
        </v-layout>
        <v-layout row wrap justify-center>
          <category-card color="secondary" icon="label" loc="tags" name="Tags" />
          <category-card color="secondary" icon="mdi-gauge" loc="statuses" name="Statuses" />
          <category-card color="secondary" icon="mdi-map" loc="reference" name="Reference" />
          <!-- <category-card color="secondary" icon="mdi-library-books" loc="" name="Glossary" /> -->
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchBar from '../SearchBar.vue'
import CategoryCard from '../UI/CategoryCard.vue'

export default Vue.extend({
  name: 'compendium-home',
  components: { SearchBar, CategoryCard },
})
</script>

<style scoped>
.compendium-header h1 {
  font-size: 3em !important;
  letter-spacing: 0.2em !important;
  text-align: center;
  text-transform: uppercase;
}
</style>
