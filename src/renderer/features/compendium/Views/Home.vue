<template>
  <div>
    <v-container fluid>
      <h1 class="display-1 font-weight-thin text-center">COMPENDIUM</h1>
      <v-row justify="center">
        <v-col cols="8">
          <search-bar />
        </v-col>
      </v-row>
    </v-container>
    <div class="ml-5 mr-5">
      <v-container fluid grid-list-lg class="mt-0 pt-0">
        <v-row wrap justify="center">
          <cc-major-btn
            icon="mdi-factory"
            name="Manufacturers"
            @clicked="$router.push('manufacturers')"
          />
          <cc-major-btn
            color="primary"
            icon="mdi-view-week"
            name="Licenses"
            @clicked="$router.push('licenses')"
          />
          <cc-major-btn
            icon="cci-corebonus"
            name="CORE Bonuses"
            @clicked="$router.push('corebonuses')"
          />
        </v-row>
        <v-row wrap justify="center">
          <cc-major-btn
            color="frame"
            icon="cci-frame"
            name="Frames"
            @clicked="$router.push('frames')"
          />
          <cc-major-btn
            color="weapon"
            icon="cci-melee"
            name="Mech Weapons"
            @clicked="$router.push('weapons')"
          />
          <cc-major-btn
            color="system"
            icon="mdi-chip"
            name="Mech Systems"
            @clicked="$router.push('systems')"
          />
        </v-row>
        <v-row wrap justify="center">
          <cc-major-btn
            color="secondary"
            icon="cci-pilot"
            name="Pilot Gear"
            @clicked="$router.push('pilot_gear')"
          />
          <cc-major-btn
            color="secondary"
            icon="public"
            name="Backgrounds"
            @clicked="$router.push('backgrounds')"
          />
          <cc-major-btn
            color="secondary"
            icon="cci-accuracy"
            name="Skill Triggers"
            @clicked="$router.push('skills')"
          />
          <cc-major-btn
            color="secondary"
            icon="cci-rank-3"
            name="Talents"
            @clicked="$router.push('talents')"
          />
        </v-row>
        <!-- <v-row wrap justify="center">
          <cc-major-btn
            color="template"
            icon="cci-role-striker"
            @clicked="$router.push('backgrounds')"
            name="NPC Classes"
          />
          <cc-major-btn
            color="template"
            icon="cci-reticule"
            @clicked="$router.push('backgrounds')"
            name="NPC Templates"
          />
          <cc-major-btn color="template" icon="cci-large-beam" @clicked="$router.push('skills')" name="NPC Systems" />
        </v-row>-->
        <v-row wrap justify="center">
          <cc-major-btn
            icon="mdi-gauge"
            name="Statuses & Conditions"
            @clicked="$router.push('statuses')"
          />
          <cc-major-btn icon="cci-barrage" name="Reserves" @clicked="$router.push('reserves')" />
          <cc-major-btn icon="mdi-map" name="Action Economy" @clicked="$router.push('actions')" />
        </v-row>
        <v-row wrap justify="center">
          <cc-major-btn icon="mdi-tag" name="Equipment Tags" @clicked="$router.push('tags')" />
          <cc-major-btn icon="mdi-map" name="Reference" @clicked="$router.push('reference')" />
          <cc-major-btn
            icon="mdi-library-books"
            name="Glossary"
            @clicked="$router.push('glossary')"
          />
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchBar from '../SearchBar.vue'

export default Vue.extend({
  name: 'compendium-home',
  components: { SearchBar },
})
</script>
