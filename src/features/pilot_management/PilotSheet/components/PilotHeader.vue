<template>
  <div :style="`height: ${$vuetify.breakpoint.mdAndUp ? '155px' : '45px'};`">
    <div id="header-container">
      <v-row dense class="pt-9 ml-2" style="width: 97vw">
        <v-col>
          <v-row
            dense
            :style="`height: ${$vuetify.breakpoint.mdAndUp ? '60px' : '45px'};`"
            align="end"
            align-md="start"
          >
            <v-col cols="auto">
              <div
                :class="
                  `heading ${
                    $vuetify.breakpoint.lgAndUp ? 'h1' : $vuetify.breakpoint.mdAndUp ? 'h2' : 'h3'
                  }`
                "
                style="letter-spacing: 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
              >
                {{ pilot.Callsign }}
              </div>
            </v-col>
            <v-col v-if="$vuetify.breakpoint.smAndDown" cols="auto" class="ml-auto">
              <cc-tooltip
                v-if="!isLevelingUp"
                delayed
                simple
                inline
                bottom
                content="Edit License Level"
              >
                <v-icon small dark class="fadeSelect" @click="$refs.levelEdit.show()">
                  mdi-circle-edit-outline
                </v-icon>
              </cc-tooltip>
              <span class="caption">LL</span>
              <span class="heading h3 px-2">{{ pilot.Level }}</span>
              <v-btn
                v-if="!isLevelingUp && pilot.Level < 12"
                tile
                outlined
                x-small
                right
                dark
                @click="$router.push({ name: 'level-up', params: { id: pilot.ID } })"
              >
                Level Up
              </v-btn>
            </v-col>
            <v-col
              v-else
              cols="auto"
              class="ml-auto text-center mt-2"
              :style="$vuetify.breakpoint.lgAndUp ? `margin-right:200px` : ''"
            >
              <div class="overline mb-n9">
                license level
                <cc-tooltip
                  v-if="!isLevelingUp"
                  delayed
                  simple
                  inline
                  bottom
                  content="Edit License Level"
                >
                  <v-icon small dark class="fadeSelect" @click="$refs.levelEdit.show()">
                    mdi-circle-edit-outline
                  </v-icon>
                </cc-tooltip>
              </div>
              <div class="heading h1 mt-n6 mb-n2" style="font-size: 80px">{{ pilot.Level }}</div>
              <v-btn
                v-if="!isLevelingUp && pilot.Level < 12"
                tile
                outlined
                small
                class="fadeSelect mt-n4"
                color="grey lighten-3"
                @click="$router.push({ name: 'level-up', params: { id: pilot.ID } })"
              >
                Level Up
                <v-icon right>
                  mdi-arrow-up-bold-hexagon-outline
                </v-icon>
              </v-btn>
            </v-col>
            <v-col v-show="$vuetify.breakpoint.lgAndUp" cols="auto">
              <div id="image-bg" />
              <v-hover>
                <template v-slot:default="{ hover }">
                  <div id="image" class="border">
                    {{pilot.Image}}
                    <v-img
                      v-if="pilot.Portrait"
                      :key="pilot.Image"
                      :src="pilot.Portrait"
                      aspect-ratio="1"
                      position="top center"
                    />
                    <v-fade-transition>
                      <v-overlay v-if="hover" absolute color="secondary">
                        <cc-btn color="secondary" @click="$refs.imageSelector.open()">
                          Set Pilot Portrait
                        </cc-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </div>
                </template>
              </v-hover>
            </v-col>
          </v-row>
          <v-row v-show="$vuetify.breakpoint.mdAndUp" dense>
            <v-col cols="auto" class="mr-5">
              <div class="overline mb-n2 subtle--text">name</div>
              <div class="stat-text white--text mt-n3">
                {{ pilot.Name }}
              </div>
            </v-col>
            <v-col v-if="pilot.Background" cols="auto" class="mr-5">
              <div class="overline mb-n2 subtle--text">background</div>
              <div class="stat-text white--text mt-n3">
                {{ pilot.Background }}
              </div>
            </v-col>
            <v-col v-if="pilot.PlayerName" cols="auto" class="mr-5">
              <div class="overline mb-n2 subtle--text">player</div>
              <div class="stat-text white--text mt-n3">
                {{ pilot.PlayerName }}
              </div>
            </v-col>
            <v-col cols="auto" class="mr-5">
              <div class="overline mb-n2 subtle--text">rm-4://(IDENT)</div>
              <div class="stat-text white--text mt-n3">
                <v-dialog max-width="1200px">
                  <template v-slot:activator="{ on }">
                    <v-icon dark class="fadeSelect" v-on="on">mdi-card-bulleted-outline</v-icon>
                  </template>
                  <v-sheet class="transparent">
                    <pilot-registration-card :pilot="pilot" pilot-ready />
                  </v-sheet>
                </v-dialog>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="$vuetify.breakpoint.mdAndUp && mech" id="stat-row" dense>
        <v-col cols="2" offset="1" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`Structure: ${mech.CurrentStructure}/${mech.MaxStructure}`"
          >
            <v-icon>cci-structure</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ mech.CurrentStructure }}</span>
          <span class="flavor-text subtle--text" style="font-size:14px">
            /{{ mech.MaxStructure }}
          </span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip simple inline delay :content="`HP: ${mech.CurrentHP}/${mech.MaxHP}`">
            <v-icon>mdi-heart-outline</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ mech.CurrentHP }}</span>
          <span class="flavor-text subtle--text" style="font-size:14px">/{{ mech.MaxHP }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`Reactor Stress: ${mech.CurrentStress}/${mech.MaxStress}`"
          >
            <v-icon>cci-reactor</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ mech.CurrentStress }}</span>
          <span class="flavor-text subtle--text" style="font-size:14px">/{{ mech.MaxStress }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`Heat: ${mech.CurrentHeat}/${mech.HeatCapacity}`"
          >
            <v-icon>mdi-fire</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ mech.CurrentHeat }}</span>
          <span class="flavor-text subtle--text" style="font-size:14px">
            /{{ mech.HeatCapacity }}
          </span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`Repair Capacity: ${mech.CurrentRepairs}/${mech.RepairCapacity}`"
          >
            <v-icon>cci-repair</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ mech.CurrentRepairs }}</span>
          <span class="flavor-text subtle--text" style="font-size:14px">
            /{{ mech.RepairCapacity }}
          </span>
        </v-col>
      </v-row>
      <v-row v-else-if="$vuetify.breakpoint.mdAndUp" id="stat-row" dense>
        <v-col cols="2" offset="1" class="unskew">
          <cc-tooltip simple inline delay :content="`HP: ${pilot.CurrentHP}/${pilot.MaxHP}`">
            <v-icon>mdi-heart-outline</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ pilot.CurrentHP }}</span>
          <span class="flavor-text subtle--text" style="font-size:14px">/{{ pilot.MaxHP }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip simple inline delay :content="`Armor: ${pilot.Armor}`">
            <v-icon>mdi-shield-outline</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ pilot.Armor }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip simple inline delay :content="`Electronic Defense: ${pilot.EDefense}`">
            <v-icon>cci-edef</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ pilot.EDefense }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip simple inline delay :content="`Evasion: ${pilot.Evasion}`">
            <v-icon>cci-evasion</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ pilot.Evasion }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip simple inline delay :content="`Speed: ${pilot.Speed}`">
            <v-icon>$vuetify.icons.move</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ pilot.Speed }}</span>
        </v-col>
      </v-row>
    </div>
    <cc-image-selector-web ref="imageSelector" :item="pilot" type="pilot" />
    <level-edit-dialog ref="levelEdit" :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import PilotRegistrationCard from './PilotRegistrationCard.vue'
import LevelEditDialog from './LevelEditDialog.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'

import vueMixins from '@/util/vueMixins'
import { Mech } from '@/class'

export default vueMixins(activePilot).extend({
  name: 'pilot-header',
  components: { LevelEditDialog, PilotRegistrationCard },

  computed: {
    isLevelingUp(): boolean {
      return this.$route.name === 'pilot-level-wizard'
    },
    mech(): Mech {
      if (this.$route.name === 'mech-sheet')
        return this.pilot.Mechs.find((m: Mech) => m.ID === this.$route.params.mechID)
      return null
    },
  },
})
</script>

<style scoped>
#header-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: var(--v-primary-base);
  color: white;
  z-index: 2;
}
#stat-row {
  transform: skew(0.65rad);
  background-color: var(--v-panel-base);
  color: var(--v-text-base);
  z-index: 10;
  width: 70vw;
  margin-left: -20px;
}
.unskew {
  transform: skew(-0.65rad);
}
#image {
  position: absolute;
  top: 60px;
  right: 20px;
  width: 200px;
  height: 200px;
  z-index: 3;
}
#image-bg {
  position: absolute;
  top: 60px;
  right: 0px;
  width: 235px;
  height: 215px;
  background-color: var(--v-primary-base);
  z-index: 0;
}
</style>
