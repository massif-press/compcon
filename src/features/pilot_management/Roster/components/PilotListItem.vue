<template>
  <div style="position: relative" class="li-top-element">
    <div class="light" style="position: absolute; top: 0; left: -15px; bottom: 0; width: 10px" />
    <v-row
      no-gutters
      class="lighten-select"
      :class="mobile ? 'mb-2' : 'mb-4'"
      @click="toPilotSheet()">
      <v-col cols="auto" style="height: 100%; border: rgb(var(--v-theme-primary)) 3px double">
        <v-card>
          <cc-avatar
            v-if="pilot.PortraitController.Avatar"
            :avatar="pilot.PortraitController.Avatar"
            :size="mobile ? 75 : 150" />
          <cc-img
            v-else-if="pilot.PortraitController.Portrait"
            :src="pilot.PortraitController.Portrait"
            aspect-ratio="1"
            position="top center"
            :height="mobile ? '75px' : '150px'"
            :width="mobile ? '75px' : '150px'" />
        </v-card>
      </v-col>
      <v-col style="position: relative">
        <v-toolbar density="compact" class="cToolbar" :height="mobile ? '40' : '46'">
          <v-row no-gutters align="center" class="px-2">
            <v-menu location="left">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  start
                  color="white"
                  @click.stop
                  icon="mdi-queue-first-in-last-out"
                  size="small"
                  class="fade-select" />
              </template>
              <div
                class="bg-panel pa-1"
                style="
                  display: grid;
                  border: 1px solid rgb(var(--v-theme-primary));
                  border-radius: 4px;
                ">
                <v-btn icon size="x-small" color="primary" class="my-1" @click="move('top')">
                  <v-icon size="large" icon="mdi-arrow-collapse-up" />
                </v-btn>
                <v-btn icon size="x-small" color="primary" class="my-1" @click="move('up')">
                  <v-icon size="large" icon="mdi-arrow-up" />
                </v-btn>
                <v-btn icon size="x-small" color="primary" class="my-1" @click="move('down')">
                  <v-icon size="large" icon="mdi-arrow-down" />
                </v-btn>
                <v-btn icon size="x-small" color="primary" class="my-1" @click="move('bottom')">
                  <v-icon size="large" icon="mdi-arrow-collapse-down" />
                </v-btn>
              </div>
            </v-menu>
            <v-col class="heading text-white">
              <cc-remote-hover :item="pilot" />
              <!-- <cc-missing-content-hover :item="pilot" simple /> -->

              {{ pilot.Callsign }}
            </v-col>
            <v-col cols="auto" class="mr-n2">
              <edit-menu density="compact" :pilot="pilot" />
            </v-col>
          </v-row>
        </v-toolbar>

        <div v-if="mobile" class="detail-row-mobile pa-2">
          <b class="text-stark">{{ pilot.Name }}</b>
          <div class="text-cc-overline">
            <span class="text-disabled">License Level</span>
            {{ pilot.Level }}
          </div>
        </div>

        <div v-else class="px-3">
          <v-row class="detail-row">
            <v-col class="flavor-text">
              <div class="mt-1 ml-n2">
                <span class="text-disabled">>[</span>
                <b class="text-stark">{{ pilot.Name }}</b>
                <span class="text-disabled">]</span>
                <span class="text-disabled">&nbsp;STATUS [</span>
                <span :class="`text-${statusColor(pilot.Status)}`">{{ pilot.Status }}</span>
                <span class="text-disabled">] -&nbsp;</span>
                <b class="text-success">&nbsp;LL: {{ pilot.Level }}&nbsp;</b>
                <cc-slashes />
                <span class="text-text">
                  [
                  <b>
                    H:
                    <span class="text-weight-normal text-accent">
                      {{ pilot.MechSkillsController.MechSkills.Hull }}
                    </span>
                  </b>
                  <b>
                    A:
                    <span class="text-weight-normal text-accent">
                      {{ pilot.MechSkillsController.MechSkills.Agi }}
                    </span>
                  </b>
                  <b>
                    S:
                    <span class="text-weight-normal text-accent">
                      {{ pilot.MechSkillsController.MechSkills.Sys }}
                    </span>
                  </b>
                  <b>
                    E:
                    <span class="text-weight-normal text-accent">
                      {{ pilot.MechSkillsController.MechSkills.Eng }}
                    </span>
                  </b>
                  ]
                </span>
              </div>
              <v-divider class="my-1" />
              <div style="font-size: 14px">
                <div>
                  <v-icon icon="cc:skill" start />
                  <span
                    v-if="!pilot.SkillsController.Skills.length"
                    style="opacity: 0.6"
                    v-text="`[ NO DATA ]`" />
                  <span v-for="(s, i) in pilot.SkillsController.Skills">
                    {{ s.Skill.Name }} {{ 'I'.repeat(s.Rank) }}
                    <cc-slashes
                      v-if="i < pilot.SkillsController.Skills.length - 1"
                      class="pr-3"
                      style="opacity: 0.4" />
                  </span>
                </div>

                <div>
                  <v-icon icon="cc:talent" start />
                  <span
                    v-if="!pilot.TalentsController.Talents.length"
                    style="opacity: 0.6"
                    v-text="`[ NO DATA ]`" />
                  <span v-for="(s, i) in pilot.TalentsController.Talents">
                    {{ s.Talent.Name }} {{ 'I'.repeat(s.Rank) }}
                    <cc-slashes
                      v-if="i < pilot.TalentsController.Talents.length - 1"
                      class="pr-3"
                      style="opacity: 0.4" />
                  </span>
                </div>

                <div v-if="pilot.CoreBonusController.CoreBonuses.length" cols="auto">
                  <v-icon icon="cc:corebonus" start class="mt-n1" />
                  <span v-for="(b, i) in pilot.CoreBonusController.CoreBonuses">
                    {{ b.Name }}
                    <cc-slashes
                      v-if="i < pilot.CoreBonusController.CoreBonuses.length - 1"
                      class="pr-3"
                      style="opacity: 0.4" />
                  </span>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <div style="position: absolute; bottom: 2px; right: 2px">
          <cc-brew-info :controller="pilot.BrewController" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import EditMenu from '../../PilotSheet/components/PilotEditMenu.vue';
import { PilotStore } from '@/stores';

export default {
  name: 'pilot-list-item',
  components: {
    EditMenu,
  },
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
    selectable: {
      type: Boolean,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    missingContent() {
      return this.pilot.BrewController.IsUnableToLoad;
    },
    remoteResource() {
      return this.pilot.SaveController.IsRemote;
    },
  },
  methods: {
    toPilotSheet() {
      this.$emit('goTo', this.pilot.ID);
    },
    statusColor(status: string): string {
      switch (status.toLowerCase()) {
        case 'active':
          return 'success';
        case 'mia':
        case 'kia':
        case 'err':
          return 'error';
        default:
          return 'text';
      }
    },
    move(direction: 'top' | 'up' | 'down' | 'bottom') {
      PilotStore().ReorderPilot(this.pilot as Pilot, direction);
    },
  },
};
</script>

<style scoped>
.detail-row {
  background-color: rgb(var(--v-theme-light-panel));
  border-bottom: 1px rgb(var(--v-theme-primary)) solid;
  border-right: 1px rgb(var(--v-theme-primary)) solid;
  border-left: 1px rgb(var(--v-theme-primary)) solid;
  margin-left: -13px;
  min-height: 138px;
}

.detail-row-mobile {
  background-color: rgb(var(--v-theme-light-panel));
  border-bottom: 1px rgb(var(--v-theme-primary)) solid;
  border-right: 1px rgb(var(--v-theme-primary)) solid;
  border-left: 1px rgb(var(--v-theme-primary)) solid;
  margin-left: -1px;
  min-height: 57px;
}

.cToolbar {
  background-color: rgb(var(--v-theme-primary));
}

.cToolbar-missing {
  background: repeating-linear-gradient(
    45deg,
    rgb(var(--v-theme-error-darken-2)),
    rgb(var(--v-theme-error-darken-2)) 10px,
    rgb(var(--v-theme-error-darken-3)) 10px,
    rgb(var(--v-theme-error-darken-3)) 20px
  );
}

.light {
  transition: background-color 0.2s ease-in-out;
  background-color: rgb(var(--v-theme-primary));
}

.li-top-element:hover .light {
  background-color: rgb(var(--v-theme-success));
}
</style>
