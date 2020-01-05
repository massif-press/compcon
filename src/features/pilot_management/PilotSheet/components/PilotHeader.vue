<template>
  <div style="height: 155px;">
    <div id="header-container">
      <v-row dense class="pt-9 ml-2" style="width: 97vw">
        <v-col cols="10">
          <v-row dense style="height: 60px;">
            <v-col cols="auto">
              <span class="overline lh">callsign</span>
              <br />
              <span class="heading h1" style="line-height: 18px; letter-spacing: 10px">
                {{ pilot.Callsign }}
              </span>
            </v-col>
            <v-col cols="auto" class="ml-auto text-center mt-2">
              <span class="overline">license level</span>
              <br />
              <span class="heading h1" style="line-height: 40px; font-size: 80px">
                {{ pilot.Level }}
              </span>
              <br />
              <cc-tooltip simple inline content="Level Up" class="ml-4">
                <v-icon large dark class="fadeSelect" @click="$router.push('../level')">
                  mdi-arrow-up-bold-hexagon-outline
                </v-icon>
              </cc-tooltip>
              <cc-tooltip delayed simple inline content="Edit License Level">
                <v-icon small dark class="fadeSelect mt-2" @click="$refs.levelEdit.show()">
                  mdi-circle-edit-outline
                </v-icon>
              </cc-tooltip>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="auto" class="mr-3">
              <span class="overline lh">name</span>
              <br />
              <span style="display: block" class="stat-text white--text mt-n2">
                {{ pilot.Name }}
              </span>
            </v-col>
            <v-col v-if="pilot.Background" cols="auto" class="mr-3">
              <span class="overline lh">background</span>
              <br />
              <span style="display: block" class="stat-text white--text mt-n2">
                {{ pilot.Background }}
              </span>
            </v-col>
            <v-col v-if="pilot.Background" cols="auto" class="mr-3">
              <span class="overline lh">rm-4://(IDENT)</span>
              <br />
              <span style="display: block" class="stat-text white--text mt-n2">{{ pilot.ID }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row id="stat-row" dense>
        <v-col cols="2" offset="1" class="unskew">
          <cc-tooltip simple inline delay :content="`HP: ${pilot.CurrentHP}/${pilot.MaxHP}`">
            <v-icon>mdi-heart-outline</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ pilot.CurrentHP }}</span>
          <span class="flavor-text grey--text" style="font-size:14px">/{{ pilot.MaxHP }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip simple inline delay :content="`Armor: ${pilot.Armor}`">
            <v-icon>mdi-shield-outline</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ pilot.Armor }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip simple inline delay :content="`Electronic Defense: ${pilot.EDefense}`">
            <v-icon>cci-marker</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ pilot.EDefense }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip simple inline delay :content="`Evasion: ${pilot.Evasion}`">
            <v-icon>mdi-arrow-decision</v-icon>
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
      <div id="image-bg" />
      <v-hover>
        <template v-slot:default="{ hover }">
          <div id="image" class="border">
            <!-- TODO: no data image -->
            <v-img
              v-if="pilot.Portrait"
              :key="pilot.Image"
              :src="pilot.Portrait"
              aspect-ratio="1"
              position="top center"
            />
            <v-img v-else src="https://via.placeholder.com/550" />
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
    </div>
    <cc-image-selector-web
      v-if="$platform === 'web'"
      ref="imageSelector"
      :item="pilot"
      type="pilot"
    />
    <cc-image-selector v-else ref="imageSelector" :item="pilot" type="pilot" />
    <level-edit-dialog ref="levelEdit" :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LevelEditDialog from './LevelEditDialog.vue'
import { Pilot } from '@/class'
import activePilot from '@/features/pilot_management/mixins/activePilot'

export default Vue.extend({
  name: 'pilot-header',
  components: { LevelEditDialog },
  mixins: [activePilot],
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
  width: 75vw;
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
.lh {
  line-height: 10px !important;
}
</style>
