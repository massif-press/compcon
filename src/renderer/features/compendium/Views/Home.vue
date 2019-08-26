<template>
  <div>
    <v-container fluid>
      <h1 class="display-1 font-weight-thin">Compendium</h1>
      <v-layout justify-center>
        <v-flex xs="4" offset-xs="4">
          <search-bar />
        </v-flex>
      </v-layout>
    </v-container>
    <div class="ml-5 mr-5">
      <v-container fluid grid-list-lg class="mt-0 pt-0">
        <v-layout wrap justify-center>
          <category-card
            color="primary"
            icon="mdi-factory"
            loc="manufacturers"
            name="Manufacturers"
          />
          <category-card color="primary" icon="mdi-view-week" loc="licenses" name="Licenses" />
          <category-card
            color="primary"
            icon="cci-corebonus"
            loc="corebonuses"
            name="CORE Bonuses"
          />
        </v-layout>
        <v-layout wrap justify-center>
          <category-card color="frame" icon="cci-frame" loc="frames" name="Frames" />
          <category-card color="weapon" icon="cci-melee" loc="weapons" name="Mech Weapons" />
          <category-card color="system" icon="mdi-chip" loc="systems" name="Mech Systems" />
        </v-layout>
        <v-layout wrap justify-center>
          <category-card color="secondary" icon="cci-pilot" loc="pilot_gear" name="Pilot Gear" />
          <category-card color="secondary" icon="public" loc="backgrounds" name="Backgrounds" />
          <category-card color="secondary" icon="cci-accuracy" loc="skills" name="Skill Triggers" />
          <category-card color="secondary" icon="cci-rank-3" loc="talents" name="Talents" />
        </v-layout>
        <!-- <v-layout wrap justify-center>
          <category-card
            color="template"
            icon="cci-role-striker"
            loc="backgrounds"
            name="NPC Classes"
          />
          <category-card
            color="template"
            icon="cci-reticule"
            loc="backgrounds"
            name="NPC Templates"
          />
          <category-card color="template" icon="cci-large-beam" loc="skills" name="NPC Systems" />
        </v-layout>-->
        <v-layout wrap justify-center>
          <category-card
            color="primary"
            icon="mdi-gauge"
            loc="statuses"
            name="Statuses & Conditions"
          />
          <category-card color="primary" icon="cci-barrage" loc="reserves" name="Reserves" />
          <category-card color="primary" icon="mdi-map" loc="actions" name="Action Economy" />
        </v-layout>
        <v-layout wrap justify-center>
          <category-card color="primary" icon="mdi-tag" loc="tags" name="Equipment Tags" />
          <category-card color="primary" icon="mdi-map" loc="reference" name="Reference" />
          <category-card color="primary" icon="mdi-library-books" loc="glossary" name="Glossary" />
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
