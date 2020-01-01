<template>
  <v-container fluid style="margin-top: 50px; min-height: calc(100vh - 50px)">
    <v-row dense style="min-height: 80%">
      <v-col>
        <v-card flat outlined height="100%">
          up here is the active actor's stat trackers, weapon cards, GM notes, etc.
          <br />
          once it uses all its activations itll get shuffled into the right side of the selector
          <br />
          there will be a sidebar for managing graveyard, reinforcements, enemy waves, etc
          <br />
          also a between encounter/downtime screen
        </v-card>
      </v-col>
    </v-row>
    <v-row dense style="min-height: 20%">
      <v-col>
        <v-card flat outlined height="100%">
          <v-slide-group v-model="model" active-class="success" show-arrows style="height: 100%">
            <v-slide-item
              v-for="n in 6"
              :key="n"
              v-slot:default="{ active, toggle }"
              style="height: 100%"
            >
              <v-card
                :color="active ? undefined : 'grey lighten-1'"
                class="mx-2 my-1"
                height="calc(100% - 4px)"
                width="100"
                @click="toggle"
              >
                ENEMY
                <v-row class="fill-height" align="center" justify="center">
                  <v-scale-transition>
                    <v-icon
                      v-if="active"
                      color="white"
                      size="48"
                      v-text="'mdi-close-circle-outline'"
                    ></v-icon>
                  </v-scale-transition>
                </v-row>
              </v-card>
            </v-slide-item>
            <v-slide-item
              v-for="n in 3"
              :key="n"
              v-slot:default="{ active, toggle }"
              style="height: 100%"
            >
              <v-card
                :color="active ? undefined : 'secondary lighten-1'"
                class="mx-2 my-1"
                height="calc(100% - 4px)"
                width="100"
                @click="toggle"
              >
                PILOT
                <v-row class="fill-height" align="center" justify="center">
                  <v-scale-transition>
                    <v-icon
                      v-if="active"
                      color="white"
                      size="48"
                      v-text="'mdi-close-circle-outline'"
                    ></v-icon>
                  </v-scale-transition>
                </v-row>
              </v-card>
            </v-slide-item>
            <v-divider vertical class="mx-4" />
            <v-slide-item
              v-for="n in 4"
              :key="n"
              v-slot:default="{ active, toggle }"
              style="height: 100%"
            >
              <v-card
                :color="active ? undefined : 'grey darken-2'"
                class="mx-2 my-1"
                height="calc(100% - 4px)"
                width="100"
                @click="toggle"
              >
                TURN FINISHED
                <v-row class="fill-height" align="center" justify="center">
                  <v-scale-transition>
                    <v-icon
                      v-if="active"
                      color="white"
                      size="48"
                      v-text="'mdi-close-circle-outline'"
                    ></v-icon>
                  </v-scale-transition>
                </v-row>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
