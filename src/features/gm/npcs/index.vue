<template>
  <v-container>
    <v-card flat>
      <v-toolbar>
        <v-row dense align="center">
          <v-col cols="auto">
            <span class="heading h2">NPCS</span>
          </v-col>
          <v-col cols="4" class="pl-4">
            <v-autocomplete placeholder="Search NPCs" dense hide-details />
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <v-select label="Group By" hide-details outlined />
          </v-col>
          <v-col cols="auto">
            <v-select label="Sort By" hide-details outlined />
          </v-col>
        </v-row>
      </v-toolbar>
      <v-row>
        <v-col cols="auto">
          <v-btn-toggle mandatory>
            <v-btn small icon value="split">
              <v-icon color="accent">mdi-view-list</v-icon>
            </v-btn>
            <v-btn small icon value="list">
              <v-icon color="accent">mdi-view-grid</v-icon>
            </v-btn>
            <v-btn small icon value="cards">
              <v-icon color="accent">mdi-grid</v-icon>
            </v-btn>
            <v-btn small icon value="cards">
              <v-icon color="accent">mdi-table</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-card-text>
        <v-row dense>
          <v-col v-for="n in 16" :key="`ex_${n}`" cols="2">
            <v-hover v-slot="{ hover }" style="cursor: pointer">
              <v-card :elevation="hover ? 12 : 0" :outlined="!hover">
                <v-img :aspect-ratio="1" src="../../../../static/img/misc/combat.jpg">
                  <v-fade-transition>
                    <div
                      v-if="hover"
                      class="
                        d-flex
                        text-center
                        primary
                        darken-2
                        v-card--reveal
                        heading
                        h2
                        white--text
                      "
                      style="height: 100%"
                    >
                      stats
                      <br />
                      features
                      <br />
                      notes
                    </div>
                  </v-fade-transition>
                </v-img>
                <v-card-text class="py-2 text-center" style="position: relative">
                  <div class="body-text" :class="hover ? 'primary--text' : ''">tier - class</div>
                  <div class="heading h2" :class="hover ? 'primary--text' : ''">name</div>
                  <div class="body-text" :class="hover ? 'primary--text' : ''">
                    template
                    <br />
                    tags
                  </div>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-footer fixed>
      <v-btn small to="/gm">
        <v-icon left>mdi-chevron-left</v-icon>
        Return to GM Menu
      </v-btn>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'npc-roster',
})
</script>