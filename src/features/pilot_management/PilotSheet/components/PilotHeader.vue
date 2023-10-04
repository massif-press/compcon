<template>
  <div id="header-container">
    <v-row class="pr-0 pl-2">
      <v-col>
        <v-row align="center">
          <v-col cols="auto">
            <v-row dense align="center">
              <v-col cols="auto">
                <div
                  :class="`heading h1`"
                  style="
                    letter-spacing: 10px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                >
                  {{ pilot.Callsign }}
                </div>
              </v-col>
              <v-col cols="auto" class="ml-3">
                <cc-tooltip
                  v-if="pilot.CloudController.IsRemoteResource"
                  inline
                  bottom
                  title="Remote Resource"
                  content="The instance of this item is linked to data in another user's account. Local changes will not persist, and when synced this item will be updated to the latest version of the data published to the author's cloud account."
                >
                  <v-icon dark class="mb-n2 ml-n5 fadeSelect">mdi-cloud-braces</v-icon>
                </cc-tooltip>
              </v-col>
            </v-row>
            <v-row class="mt-n9 pt-0">
              <v-col cols="auto">
                <div class="text-overline mb-n3 text-disabled">name</div>
                <div class="stat-text text-white mt-n2 mb-n1">
                  {{ pilot.Name }}
                </div>
              </v-col>
              <v-col v-if="pilot.Background" cols="auto">
                <div class="text-overline mb-n3 text-disabled">background</div>
                <div class="stat-text text-white mt-n2 mb-n1">
                  {{ pilot.Background }}
                </div>
              </v-col>
              <v-col v-if="pilot.PlayerName" cols="auto">
                <div class="text-overline mb-n3 text-disabled">player</div>
                <div class="stat-text text-white mt-n2 mb-n1">
                  {{ pilot.PlayerName }}
                </div>
              </v-col>
              <v-col cols="auto">
                <div class="text-overline mb-n3 text-disabled">rm-4://(IDENT)</div>
                <div class="stat-text text-white mt-n2 mb-n1">
                  <v-dialog max-width="1200px">
                    <template #activator="{ props }">
                      <v-icon dark variant="plain" v-bind="props">mdi-card-bulleted-outline</v-icon>
                    </template>
                    <v-sheet class="transparent">
                      <pilot-registration-card :pilot="pilot" pilot-ready />
                    </v-sheet>
                  </v-dialog>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="auto" class="ml-auto" style="margin-right: 225px">
            <v-row dense align="center" justify="end">
              <v-col cols="auto" class="heading h3"> license level </v-col>
              <v-col cols="auto" class="heading h2">
                {{ pilot.Level }}
              </v-col>
              <v-col cols="auto">
                <cc-tooltip
                  v-if="!isLevelingUp"
                  delayed
                  simple
                  inline
                  bottom
                  content="Edit License Level"
                >
                  <v-icon size="15" variant="plain" @click="($refs as any).levelEdit.show()">
                    mdi-circle-edit-outline
                  </v-icon>
                </cc-tooltip>
              </v-col>
            </v-row>

            <v-btn
              v-if="!isLevelingUp && pilot.Level < 12"
              block
              size="small"
              variant="plain"
              @click="$router.push({ name: 'level-up', params: { pilotID: pilot.ID } })"
            >
              Level Up
              <v-icon size="large" end>mdi-arrow-up-bold-hexagon-outline</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <div id="image-bg" />
            <div id="triangle" />
            <v-hover>
              <template #default="{ hover }">
                <div id="image" class="border">
                  <cc-avatar
                    v-if="pilot.PortraitController.Avatar"
                    :avatar="pilot.PortraitController.Avatar"
                  />
                  <v-img
                    v-else-if="pilot.PortraitController.Portrait"
                    :src="pilot.PortraitController.Portrait"
                    aspect-ratio="1"
                    position="top center"
                  />
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute color="secondary">
                      <cc-btn color="secondary" @click="($refs as any).imageSelector.open()">
                        Set Pilot Portrait
                      </cc-btn>
                    </v-overlay>
                  </v-fade-transition>
                </div>
              </template>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
  <cc-image-selector ref="imageSelector" :item="pilot" type="pilot" />
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
  color: white;
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
