<template>
  <div>
    <v-container fluid>
      <div class="heading mech text-center mt-n2 mb-n2">COMPENDIUM</div>
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
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            icon="mdi-factory"
            name="Manufacturers"
            @clicked="$router.push('compendium/manufacturers')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            color="primary"
            icon="mdi-view-week"
            name="Licenses"
            @clicked="$router.push('compendium/licenses')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            icon="cci-corebonus"
            name="CORE Bonuses"
            @clicked="$router.push('compendium/corebonuses')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            color="frame"
            icon="cci-frame"
            name="Frames"
            @clicked="$router.push('compendium/frames')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            color="weapon"
            icon="cci-melee"
            name="Mech Weapons"
            @clicked="$router.push('compendium/weapons')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            color="system"
            icon="mdi-chip"
            name="Mech Systems"
            @clicked="$router.push('compendium/systems')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '3' : '6'"
            color="secondary"
            icon="cci-pilot"
            name="Pilot Gear"
            @clicked="$router.push('compendium/pilot_gear')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '3' : '6'"
            color="secondary"
            icon="public"
            name="Backgrounds"
            @clicked="$router.push('compendium/backgrounds')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '3' : '6'"
            color="secondary"
            icon="cci-accuracy"
            name="Skill Triggers"
            @clicked="$router.push('compendium/skills')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '3' : '6'"
            color="secondary"
            icon="cci-rank-3"
            name="Talents"
            @clicked="$router.push('compendium/talents')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            color="primary"
            icon="cci-role-striker"
            name="NPC Classes"
            @clicked="$router.push('compendium/npc_classes')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            color="primary"
            icon="cci-role-striker"
            name="NPC Features"
            @clicked="$router.push('compendium/npc_features')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            color="primary"
            icon="cci-role-striker"
            name="NPC Templates"
            @clicked="$router.push('compendium/npc_templates')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            icon="mdi-gauge"
            name="Statuses & Conditions"
            @clicked="$router.push('compendium/statuses')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            icon="cci-barrage"
            name="Reserves"
            @clicked="$router.push('compendium/reserves')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            icon="mdi-map"
            name="Action Economy"
            @clicked="$router.push('compendium/actions')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            icon="mdi-tag"
            name="Equipment Tags"
            @clicked="$router.push('compendium/tags')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
            icon="mdi-map"
            name="Reference"
            @clicked="$router.push('compendium/reference')"
          />
          <cc-major-btn
            :cols="$vuetify.breakpoint.lg ? '4' : '6'"
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

export default Vue.extend({
  name: 'compendium-home',
  components: { SearchBar },
})
</script>
