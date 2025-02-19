<template>
  <div id="header-container">
    <v-row class="pr-0 pl-2">
      <v-col>
        <v-row align="center" dense class="ml-n3">
          <v-col cols="auto">
            <v-row dense align="center">
              <v-col v-if="pilot.IsRemote" cols="auto">
                <v-tooltip
                  text="This pilot is a remote resource linked to another user's account. It is
                    read-only and will receive updates from the linked account.">
                  <template #activator="{ props }">
                    <v-icon class="fade-select" size="40" icon="mdi-broadcast" v-bind="props" />
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="auto">
                <div
                  :class="`heading h1`"
                  style="
                    letter-spacing: 10px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  ">
                  {{ pilot.Callsign }}
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-n9 pt-0 pb-0">
              <v-col cols="auto" class="mr-4">
                <div class="text-overline mb-n3" style="opacity: 0.4">name</div>
                <div class="stat-text mt-n2 mb-n1">
                  {{ pilot.Name }}
                </div>
              </v-col>
              <v-col v-if="pilot.Background" cols="auto" class="mr-4 pb-0">
                <div class="text-overline mb-n3" style="opacity: 0.4">background</div>
                <div class="stat-text mt-n2 mb-n1">
                  {{ pilot.Background }}
                </div>
              </v-col>
              <v-col v-if="pilot.PlayerName" cols="auto" class="mr-4 pb-0">
                <div class="text-overline mb-n3" style="opacity: 0.4">player</div>
                <div class="stat-text mt-n2 mb-n1">
                  {{ pilot.PlayerName }}
                </div>
              </v-col>
              <v-col cols="auto" class="mr-4 pb-0">
                <div class="text-overline mb-n3" style="opacity: 0.4">rm-4://IDENT</div>
                <div class="stat-text mt-n2 mb-n1">
                  <v-dialog max-width="1200px">
                    <template #activator="{ props }">
                      <v-icon variant="plain" v-bind="props">mdi-card-bulleted-outline</v-icon>
                    </template>
                    <v-card tile>
                      <pilot-registration-card :pilot="pilot" pilot-ready />
                    </v-card>
                  </v-dialog>
                </div>
              </v-col>
              <v-col v-if="pilot.BrewController.Brews.length" cols="auto" class="pb-0">
                <div class="text-overline mb-n3" style="opacity: 0.4">RM-6://DATA</div>
                <cc-brew-info :controller="pilot.BrewController" />
              </v-col>
              <v-col class="pb-0">
                <div class="text-overline mb-n3" style="opacity: 0.4">
                  NDAP/SR-01://STATUS REPORT
                </div>
                <div class="heading" style="padding-top: 4px; font-size: 14px">
                  <v-icon size="18" class="ml-1 mt-n1" icon="mdi-star-four-points-outline" />
                  {{ pilot.Grit }}
                  <v-icon size="18" class="ml-1 mt-n1" icon="mdi-shield-outline" />
                  {{ pilot.Armor }}
                  <v-icon size="18" class="ml-1 mt-n1" icon="mdi-heart" />
                  {{ pilot.MaxHP }}
                  <v-icon size="18" class="ml-1 mt-n1" icon="cc:e_def" />
                  {{ pilot.EDefense }}
                  <v-icon size="18" class="ml-1 mt-n1" icon="cc:evasion" />
                  {{ pilot.Evasion }}
                  <v-icon
                    size="18"
                    class="ml-1 mt-n1"
                    icon="mdi-arrow-right-bold-hexagon-outline" />
                  {{ pilot.Speed }}
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="auto" class="ml-auto" style="margin-right: 225px">
            <v-row dense align="center" justify="end">
              <v-col cols="auto" class="heading h4 mt-1">license level</v-col>
              <v-col cols="auto" class="heading h2 text-highlight">
                {{ pilot.Level }}
              </v-col>
              <v-col cols="auto">
                <v-tooltip v-if="!pilot.IsRemote && !isLevelingUp" text="Edit License Level">
                  <template #activator="{ props }">
                    <v-icon
                      size="15"
                      class="fade-select"
                      @click="($refs as any).levelEdit.show()"
                      v-bind="props">
                      mdi-circle-edit-outline
                    </v-icon>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>

            <cc-button
              v-if="!pilot.IsRemote && !isLevelingUp && pilot.Level < 12"
              size="x-small"
              color="panel"
              block
              class="mt-n2"
              prepend-icon="mdi-arrow-up-bold"
              @click="$router.push({ name: 'level-up', params: { pilotID: pilot.ID } })">
              Level Up
            </cc-button>
          </v-col>

          <v-col cols="auto">
            <div id="image-bg" />
            <div id="triangle" />
            <div id="image" class="border">
              <cc-avatar
                v-if="pilot.PortraitController.Avatar"
                :avatar="pilot.PortraitController.Avatar" />
              <cc-img
                v-else-if="pilot.PortraitController.Portrait"
                :src="pilot.PortraitController.Portrait"
                aspect-ratio="1"
                position="top center" />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
  <level-edit-dialog ref="levelEdit" :pilot="pilot" />
</template>

<script lang="ts">
import PilotRegistrationCard from './PilotRegistrationCard.vue';
import LevelEditDialog from './LevelEditDialog.vue';

import { Pilot } from '@/class';

export default {
  name: 'pilot-header',
  components: { LevelEditDialog, PilotRegistrationCard },
  props: {
    pilot: { type: Pilot, required: true },
  },
  computed: {
    isLevelingUp(): boolean {
      return this.$route.name === 'pilot-level-wizard';
    },
  },
};
</script>

<style scoped>
#header-container {
  position: absolute;
  top: 00px;
  padding-top: 30px;
  padding-left: 8px;
  padding-bottom: 8px;
  left: 0;
  width: 100vw;
  background-color: rgb(var(--v-theme-primary));
}

#image {
  position: absolute;
  top: 55px;
  right: 10px;
  width: 200px;
  height: 200px;
  z-index: 3;
}

#image-bg {
  position: absolute;
  top: 50px;
  right: 0px;
  width: 220px;
  height: 215px;
  background-color: rgb(var(--v-theme-primary));
  z-index: 2;
}

#triangle {
  position: absolute;
  top: 130px;
  right: 220px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 30px 30px 0;
  border-color: transparent rgb(var(--v-theme-primary)) transparent transparent;
  z-index: 2;
}
</style>
