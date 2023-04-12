<template>
  <div :style="`height: ${$vuetify.display.mdAndUp ? '155px' : '45px'};`">
    <div id="header-container">
      <v-row density="compact" class="pt-9 ml-2" style="width: 97vw">
        <v-col>
          <v-row
            density="compact"
            :style="`height: ${$vuetify.display.mdAndUp ? '60px' : '45px'};`"
            align="end"
            align-md="start"
          >
            <v-col cols="auto">
              <div
                :class="`heading ${
                  $vuetify.display.lgAndUp
                    ? 'h1'
                    : $vuetify.display.mdAndUp
                    ? 'h1'
                    : 'h3'
                }`"
                style="
                  letter-spacing: 10px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                {{ pilot.Callsign }}
                <cc-tooltip
                  inline
                  v-if="pilot.CloudController.IsRemoteResource"
                  bottom
                  title="Remote Resource"
                  :content="`The instance of this item is linked to data in another user's account. Local changes will not persist, and when synced this item will be updated to the latest version of the data published to the author's cloud account.`"
                >
                  <v-icon dark class="mb-n2 ml-n5 fade-select"
                    >mdi-cloud-braces</v-icon
                  >
                </cc-tooltip>
              </div>
            </v-col>
            <v-col
              v-if="$vuetify.display.smAndDown"
              cols="auto"
              class="ml-auto"
            >
              <cc-tooltip
                v-if="!isLevelingUp"
                delayed
                simple
                inline
                bottom
                content="Edit License Level"
              >
                <v-icon
                  small
                  dark
                  class="fade-select"
                  @click="$refs.levelEdit.show()"
                >
                  mdi-circle-edit-outline
                </v-icon>
              </cc-tooltip>
              <span class="caption">LL</span>
              <span class="heading h3 px-2">{{ pilot.Level }}</span>
              <v-btn
                v-if="!isLevelingUp && pilot.Level < 12"
                tile
                variant="outlined"
                x-small
                right
                dark
                @click="
                  $router.push({ name: 'level-up', params: { id: pilot.ID } })
                "
              >
                Level Up
              </v-btn>
            </v-col>
            <v-col
              v-else
              cols="auto"
              class="ml-auto text-center mt-4"
              :style="$vuetify.display.lgAndUp ? `margin-right:200px` : ''"
            >
              <div class="text-overline mb-n9">
                license level
                <cc-tooltip
                  v-if="!isLevelingUp"
                  delayed
                  simple
                  inline
                  bottom
                  content="Edit License Level"
                >
                  <v-icon
                    small
                    dark
                    class="fade-select"
                    @click="$refs.levelEdit.show()"
                  >
                    mdi-circle-edit-outline
                  </v-icon>
                </cc-tooltip>
              </div>
              <div class="heading h1 mb-n4 py-1" style="font-size: 75px">
                {{ pilot.Level }}
              </div>
              <v-btn
                v-if="!isLevelingUp && pilot.Level < 12"
                tile
                variant="outlined"
                small
                class="fade-select mt-n4"
                color="grey lighten-3"
                @click="
                  $router.push({ name: 'level-up', params: { id: pilot.ID } })
                "
              >
                Level Up
                <v-icon end>mdi-arrow-up-bold-hexagon-outline</v-icon>
              </v-btn>
            </v-col>
            <v-col v-show="$vuetify.display.lgAndUp" cols="auto">
              <div id="image-bg" />
              <v-hover>
                <template v-slot:default="{ hover }">
                  <div id="image" class="border">
                    <v-img
                      v-if="pilot.Portrait"
                      :src="pilot.Portrait"
                      aspect-ratio="1"
                      position="top center"
                    />
                    <v-fade-transition>
                      <v-overlay v-if="hover" absolute color="secondary">
                        <cc-btn
                          color="secondary"
                          @click="$refs.imageSelector.open()"
                        >
                          Set Pilot Portrait
                        </cc-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </div>
                </template>
              </v-hover>
            </v-col>
          </v-row>
          <v-row v-show="$vuetify.display.mdAndUp" density="compact">
            <v-col cols="auto" class="mr-5">
              <div class="text-overline mb-n2 text-subtle">name</div>
              <div class="stat-text text-white mt-n2 mb-n1">
                {{ pilot.Name }}
              </div>
            </v-col>
            <v-col v-if="pilot.Background" cols="auto" class="mr-5">
              <div class="text-overline mb-n2 text-subtle">background</div>
              <div class="stat-text text-white mt-n2 mb-n1">
                {{ pilot.Background }}
              </div>
            </v-col>
            <v-col v-if="pilot.PlayerName" cols="auto" class="mr-5">
              <div class="text-overline mb-n2 text-subtle">player</div>
              <div class="stat-text text-white mt-n2 mb-n1">
                {{ pilot.PlayerName }}
              </div>
            </v-col>
            <v-col cols="auto" class="mr-5">
              <div class="text-overline mb-n2 text-subtle">rm-4://(IDENT)</div>
              <div class="stat-text text-white mt-n2 mb-n1">
                <v-dialog max-width="1200px">
                  <template v-slot:activator="{ props }">
                    <v-icon dark class="fade-select" v-bind="props"
                      >mdi-card-bulleted-outline</v-icon
                    >
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
      <v-row
        v-if="$vuetify.display.mdAndUp && mech"
        id="stat-row"
        density="compact"
      >
        <v-col cols="2" offset="1" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`Structure: ${mech.CurrentStructure}/${mech.MaxStructure}`"
          >
            <v-icon icon="cc:structure" />
          </cc-tooltip>
          <span class="stat-text">{{ mech.CurrentStructure }}</span>
          <span class="flavor-text text-subtle" style="font-size: 14px">
            /{{ mech.MaxStructure }}
          </span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`HP: ${mech.CurrentHP}/${mech.MaxHP}`"
          >
            <v-icon icon="mdi-heart-outline" />
          </cc-tooltip>
          <span class="stat-text">{{ mech.CurrentHP }}</span>
          <span class="flavor-text text-subtle" style="font-size: 14px"
            >/{{ mech.MaxHP }}</span
          >
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`Reactor Stress: ${mech.CurrentStress}/${mech.MaxStress}`"
          >
            <v-icon icon="cc:reactor" />
          </cc-tooltip>
          <span class="stat-text">{{ mech.CurrentStress }}</span>
          <span class="flavor-text text-subtle" style="font-size: 14px">
            /{{ mech.MaxStress }}
          </span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`Heat: ${mech.CurrentHeat}/${mech.HeatCapacity}`"
          >
            <v-icon icon="mdi-fire" />
          </cc-tooltip>
          <span class="stat-text">{{ mech.CurrentHeat }}</span>
          <span class="flavor-text text-subtle" style="font-size: 14px">
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
            <v-icon icon="cc:repair" />
          </cc-tooltip>
          <span class="stat-text">{{ mech.CurrentRepairs }}</span>
          <span class="flavor-text text-subtle" style="font-size: 14px">
            /{{ mech.RepairCapacity }}
          </span>
        </v-col>
      </v-row>
      <v-row
        v-else-if="$vuetify.display.mdAndUp"
        id="stat-row"
        density="compact"
      >
        <v-col cols="2" offset="1" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`HP: ${pilot.CurrentHP}/${pilot.MaxHP}`"
          >
            <v-icon icon="mdi-heart-outline" />
          </cc-tooltip>
          <span class="stat-text">{{ pilot.CurrentHP }}</span>
          <span class="flavor-text text-subtle" style="font-size: 14px"
            >/{{ pilot.MaxHP }}</span
          >
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip simple inline delay :content="`Armor: ${pilot.Armor}`">
            <v-icon icon="mdi-shield-outline" />
          </cc-tooltip>
          <span class="stat-text">{{ pilot.Armor }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`Electronic Defense: ${pilot.EDefense}`"
          >
            <v-icon icon="cc:edef" />
          </cc-tooltip>
          <span class="stat-text">{{ pilot.EDefense }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip
            simple
            inline
            delay
            :content="`Evasion: ${pilot.Evasion}`"
          >
            <v-icon icon="cc:evasion" />
          </cc-tooltip>
          <span class="stat-text">{{ pilot.Evasion }}</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <cc-tooltip simple inline delay :content="`Speed: ${pilot.Speed}`">
            <v-icon icon="mdi-arrow-right-bold-hexagon-outline" />
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
import PilotRegistrationCard from './PilotRegistrationCard.vue';
import LevelEditDialog from './LevelEditDialog.vue';

import { Mech } from '@/class';

export default {
  name: 'pilot-header',
  components: { LevelEditDialog, PilotRegistrationCard },

  computed: {
    isLevelingUp(): boolean {
      return this.$route.name === 'pilot-level-wizard';
    },
    mech(): Mech {
      if (this.$route.name === 'mech-sheet')
        return this.pilot.Mechs.find(
          (m: Mech) => m.ID === this.$route.params.mechID
        );
      return null;
    },
  },
};
</script>

<style scoped>
#header-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: rgb(var(--v-theme-primary));
  color: white;
  z-index: 2;
}
#stat-row {
  transform: skew(0.65rad);
  background-color: rgb(var(--v-theme-panel));
  color: rgb(var(--v-theme-text));
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
  background-color: rgb(var(--v-theme-primary));
  z-index: 0;
}
</style>
