<template>
  <v-container fluid style="overflow: hidden; height: calc(100vh - 50px)">
    <v-row justify="center" align="center">
      <v-col><v-divider /></v-col>
      <v-col cols="auto">
        <div
          class="font-weight-light text-center my-n2"
          style="letter-spacing: 2vw !important; font-size: 2vw !important"
        >
          ACTIVE MODE
        </div>
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <v-row style="height: 100%" class="mt-1 px-5" justify="space-around">
      <v-col>
        <v-list>
          <v-list-item>
            <v-list-item-avatar tile width="100px" height="100px">
              <v-img :src="pcImg" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="heading mech" v-text="'LANCER'" />
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item three-line :to="'/active-mode/new-character-sheet'">
            <v-list-item-avatar>
              <v-icon size="60" color="accent" v-text="'cci-pilot'" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                class="heading h3 accent--text"
                v-text="'Start a Character Sheet'"
              />
              <v-list-item-subtitle>
                Create a new Character Sheet, an instance of a Pilot and their active Mech, for use
                in a LANCER game
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line :to="'/active-mode/open-character-sheet'">
            <v-list-item-avatar tile>
              <v-icon size="40" color="accent" v-text="'mdi-book-open'" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                class="heading h3 accent--text"
                v-text="'Open a Character Sheet'"
              />
              <v-list-item-subtitle>
                Open a previously created Character Sheet to continue a LANCER game
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line disabled>
            <v-list-item-avatar tile>
              <v-icon size="50" v-text="'cci-squad'" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="heading h3" v-text="'Join a Table'" />
              <v-list-item-subtitle>
                Join an realtime LANCER table to play with friends online (in development!)
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col>
        <v-list>
          <v-list-item>
            <v-list-item-avatar tile width="100px" height="100px">
              <v-img :src="gmImg" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="heading mech" v-text="'GAME MASTER'" />
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item three-line @click.stop="">
            <v-list-item-avatar tile>
              <v-icon size="50" color="accent" v-text="'cci-encounter'" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="heading h3 accent--text" v-text="'Begin a new Encounter'" />
              <v-list-item-subtitle>Configure and run an Encounter</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line @click.stop="">
            <v-list-item-avatar tile>
              <v-icon size="40" color="accent" v-text="'mdi-motion-play-outline'" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="heading h3 accent--text" v-text="'Resume an Encounter'" />
              <v-list-item-subtitle>Continue an active Encounter</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line disabled>
            <v-list-item-avatar tile>
              <v-icon size="50" v-text="'mdi-plus-network-outline'" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="heading h3" v-text="'Create a Table'" />
              <v-list-item-subtitle>
                Create an online LANCER table and invite players to join (in development!)
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line disabled>
            <v-list-item-avatar tile>
              <v-icon size="50" v-text="'mdi-lan'" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="heading h3" v-text="'Resume a Table'" />
              <v-list-item-subtitle>
                Resume an online LANCER table (in development!)
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col>
        <v-list>
          <v-list-item>
            <v-list-item-avatar tile width="100px" height="100px">
              <v-img :src="specImg" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="heading mech" v-text="'DISPLAY'" />
            </v-list-item-content>
          </v-list-item>
          <v-divider />

          <v-list-item three-line disabled>
            <v-list-item-avatar tile>
              <v-icon size="40" v-text="'mdi-monitor-share'" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="heading h3" v-text="'Spectator Mode'" />
              <v-list-item-subtitle>
                Run a non-interactive spectator display for a realtime LANCER game (in development!)
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item three-line disabled>
            <v-list-item-avatar tile>
              <v-icon size="40" v-text="'mdi-monitor-dashboard'" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="heading h3" v-text="'Campaign Display'" />
              <v-list-item-subtitle>
                Run an interactive GM display for a loaded LANCER campaign (in development!)
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ImageTag } from '@/classes/enums'
import { getImagePath } from '@/io/ImageManagement'
import Vue from 'vue'

export default Vue.extend({
  name: 'home',
  computed: {
    pcImg() {
      return getImagePath(ImageTag.Misc, 'patreon_tiers\\lancer.svg')
    },
    gmImg() {
      return getImagePath(ImageTag.Misc, 'patreon_tiers\\nhp.svg')
    },
    specImg() {
      return getImagePath(ImageTag.Misc, 'patreon_tiers\\diasporan.svg')
    },
  },
})
</script>
