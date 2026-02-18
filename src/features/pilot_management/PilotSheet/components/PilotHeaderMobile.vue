<template>
  <div :class="`header-container-${portrait ? 'sm' : 'md'}`"
    class="bg-primary">
    <v-row dense>
      <v-col style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
        <div class="heading h3 mt-n2">
          <v-tooltip v-if="pilot.IsRemote"
            :open-on-click="true"
            location="bottom"
            text="This pilot is a remote resource linked to another user's account. It is
                    read-only and will receive updates from the linked account.">
            <template #activator="{ props }">
              <v-icon size="small"
                class="text-disabled"
                start
                v-bind="props">mdi-broadcast</v-icon>
            </template>
          </v-tooltip>
          <span style="letter-spacing: 4px">
            {{ pilot.Callsign }}
          </span>
        </div>

        <div class="text-cc-overline"
          :class="!portrait && 'pl-2'">
          <span>
            {{ pilot.Name }}
          </span>
          <span v-if="pilot.Background && !portrait">
            <cc-slashes />
            {{ pilot.Background }}
          </span>
          <span v-if="pilot.PlayerName && !portrait">
            <cc-slashes />
            {{ pilot.PlayerName }}
          </span>
        </div>

        <div class="text-cc-overline"
          :class="!portrait && 'pl-2'">
          <v-icon size="10"
            class="mt-n1 mr-n1"
            icon="mdi-star-four-points-outline" />
          {{ pilot.Grit }}
          <v-icon size="10"
            class="mt-n1 mr-n1"
            icon="mdi-shield-outline" />
          {{ pilot.Armor }}
          <v-icon size="10"
            class="mt-n1 mr-n1"
            icon="mdi-heart" />
          {{ pilot.MaxHP }}
          <v-icon size="11"
            class="mt-n1 mr-n1"
            icon="cc:e_def" />
          {{ pilot.EDefense }}
          <v-icon size="13"
            class="mt-n1 mr-n1"
            icon="cc:evasion" />
          {{ pilot.Evasion }}
          <v-icon size="13"
            class="mt-n1 mr-n1"
            icon="mdi-arrow-right-bold-hexagon-outline" />
          {{ pilot.Speed }}
        </div>
      </v-col>

      <v-col cols="auto"
        class="px-3 text-center">
        <div class="d-block">
          <div class="heading h2 mb-1"
            style="line-height: 15px">
            <span class="heading h3 text-disabled">LL&nbsp;</span>
            <span>
              {{ pilot.Level }}
            </span>
            <v-icon v-if="!pilot.IsRemote"
              size="12"
              class="fade-select"
              end
              @click="levelEdit = true">
              mdi-circle-edit-outline
            </v-icon>
          </div>

          <cc-button v-if="!pilot.IsRemote && !isLevelingUp && pilot.Level < 12"
            size="x-small"
            color="accent"
            @click="
              $router.push({
                name: 'level-up',
                params: { pilotID: pilot.ID, callsign: pilot.Callsign },
              })
              ">
            Level Up
          </cc-button>
        </div>
      </v-col>

      <v-col cols="auto"
        style="width: 85px">
        <div id="image-bg" />
        <div id="triangle" />
        <div id="image"
          class="border">
          <cc-avatar v-if="pilot.PortraitController.Avatar"
            :avatar="pilot.PortraitController.Avatar"
            :size="75" />
          <cc-img v-else-if="pilot.PortraitController.Portrait"
            :src="pilot.PortraitController.Portrait"
            aspect-ratio="1"
            position="top center" />
        </div>
      </v-col>
    </v-row>
  </div>
  <cc-solo-modal v-model="levelEdit"
    title="edit license level"
    icon="cc:pilot"
    shrink
    width="600px">
    <level-edit-dialog :pilot="pilot"
      @close="levelEdit = false" />
  </cc-solo-modal>
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
  data: () => ({
    levelEdit: false,
  }),
  computed: {
    portrait() {
      return this.$vuetify.display.xs;
    },
    isLevelingUp(): boolean {
      return this.$route.name === 'pilot-level-wizard';
    },
  },
};
</script>

<style scoped>
.header-container-sm {
  position: absolute;
  top: 0;
  padding-top: 34px;
  padding-left: 8px;
  padding-bottom: 4px;
  left: 0;
  right: 0;
}

.header-container-md {
  position: absolute;
  top: 12px;
  padding-top: 34px;
  padding-left: 8px;
  padding-bottom: 4px;
  left: 0;
  right: 0;
}

#image {
  position: absolute;
  top: 30px;
  right: 5px;
  width: 75px;
  height: 75px;
  z-index: 3;
}

#image-bg {
  position: absolute;
  top: 30px;
  right: 5px;
  width: 75px;
  height: 75px;
  background-color: rgb(var(--v-theme-primary));
  z-index: 2;
}
</style>
