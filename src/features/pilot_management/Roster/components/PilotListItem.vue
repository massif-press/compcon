<template>
  <div style="position: relative">
    <v-row
      no-gutters
      class="lighten-select mb-4"
      @click="!missingContent ? toPilotSheet() : null"
      :style="missingContent ? 'cursor: not-allowed' : ''">
      <v-col cols="auto" style="height: 100%; border: rgb(var(--v-theme-primary)) 3px double">
        <v-card>
          <cc-avatar
            v-if="pilot.PortraitController.Avatar"
            :avatar="pilot.PortraitController.Avatar"
            :size="150" />
          <cc-img
            v-else-if="pilot.PortraitController.Portrait"
            :src="pilot.PortraitController.Portrait"
            aspect-ratio="1"
            position="top center"
            height="150px"
            width="150px" />
        </v-card>
      </v-col>
      <v-col style="position: relative">
        <div class="clipped-large-invert" :class="missingContent ? 'cToolbar-missing' : 'cToolbar'">
          <v-row no-gutters align="center" class="px-2">
            <v-menu location="left">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  start
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
              {{ pilot.Callsign }}
            </v-col>
            <v-col cols="auto" class="mr-4">
              <edit-menu density="compact" :pilot="pilot" />
            </v-col>
          </v-row>
        </div>

        <div class="px-3">
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
                  <b>H</b>
                  :{{ pilot.MechSkillsController.MechSkills.Hull }}
                  <b>A</b>
                  :{{ pilot.MechSkillsController.MechSkills.Agi }}
                  <b>S</b>
                  :{{ pilot.MechSkillsController.MechSkills.Sys }}
                  <b>E</b>
                  :{{ pilot.MechSkillsController.MechSkills.Eng }}
                  ]
                </span>
              </div>
              <v-divider class="my-1" />
              <cc-missing-content-list v-if="missingContent" :controller="pilot.BrewController" />
              <div v-else style="font-size: 14px">
                <div>
                  <v-icon icon="cc:skill" start class="mt-n1" />
                  <span v-for="(s, i) in pilot.SkillsController.Skills">
                    {{ s.Skill.Name }} {{ 'I'.repeat(s.Rank) }}
                    <cc-slashes
                      v-if="i < pilot.SkillsController.Skills.length - 1"
                      class="pr-3"
                      style="opacity: 0.4" />
                  </span>
                </div>

                <div>
                  <v-icon icon="cc:talent" start class="mt-n1" />
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
    missingContent() {
      return this.pilot.BrewController.IsUnableToLoad;
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
      console.log(this.pilot.SortIndex);
      PilotStore().ReorderPilot(this.pilot as Pilot, direction);
      console.log(this.pilot.SortIndex);
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
  min-height: 128px;
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
</style>
