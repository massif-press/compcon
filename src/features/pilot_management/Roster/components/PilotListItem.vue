<template>
  <v-row
    no-gutters
    class="lighten-select mb-4"
    @click="selectable ? $emit('select', pilot) : !dragging ? toPilotSheet() : null"
  >
    <v-col cols="auto" style="border: rgb(var(--v-theme-primary)) 3px double">
      <cc-avatar
        v-if="pilot.PortraitController.Avatar"
        :avatar="pilot.PortraitController.Avatar"
        :size="150"
      />
      <cc-img
        v-else-if="pilot.PortraitController.Portrait"
        :src="pilot.PortraitController.Portrait"
        aspect-ratio="1"
        position="top center"
        height="150px"
        width="150px"
      />
    </v-col>
    <v-col>
      <div class="clipped-large-invert" style="background-color: rgb(var(--v-theme-primary))">
        <v-row no-gutters align="center" class="px-2">
          <v-col class="heading text-white">
            {{ pilot.Callsign }}
            <cc-tooltip
              v-if="pilot.CloudController.IsRemoteResource"
              inline
              title="Remote Resource"
              :content="`The instance of this item is linked to data in another user's account. Local changes will not persist, and when synced this item will be updated to the latest version of the data published to the author's cloud account. Remote data cannot be saved to your own cloud account.`"
            >
              <v-icon dark right>mdi-cloud-braces</v-icon>
            </cc-tooltip>
          </v-col>
          <v-col cols="auto" class="mr-4">
            <edit-menu density="compact" :pilot="pilot" />
          </v-col>
        </v-row>
      </div>

      <div class="px-3">
        <v-row class="detail-row" align="center">
          <v-col class="flavor-text">
            <div>
              <span class="text-disabled">>[</span>
              <b class="text-stark">{{ pilot.Name }}</b>
              <span class="text-disabled">]</span>
              <span class="text-disabled">&nbsp;STATUS [</span>
              <span :class="`${statusColor(pilot.Status)}text-`">{{ pilot.Status }}</span>
              <span class="text-disabled">] -&nbsp;</span>
              <b class="text-success">&nbsp;LL: {{ pilot.Level }}&nbsp;</b>
              <cc-slashes />
              <span class="text-text">
                [ <b>H</b>:{{ pilot.MechSkillsController.MechSkills.Hull }} <b>A</b>:{{
                  pilot.MechSkillsController.MechSkills.Agi
                }}
                <b>S</b>:{{ pilot.MechSkillsController.MechSkills.Sys }} <b>E</b>:{{
                  pilot.MechSkillsController.MechSkills.Eng
                }}
                ]
              </span>
            </div>
            <v-divider class="my-1" />
            <v-row no-gutters align="center" justify="space-around">
              <v-col cols="auto">
                <v-icon icon="cc:skill" start class="mt-n1" />
                <span v-for="(s, i) in pilot.SkillsController.Skills">
                  {{ s.Skill.Name }} {{ 'I'.repeat(s.Rank) }}
                  <cc-slashes
                    v-if="i < pilot.SkillsController.Skills.length - 1"
                    class="pr-3"
                    style="opacity: 0.4"
                  />
                </span>
              </v-col>
              <v-col cols="auto">
                <v-icon icon="cc:talent" start class="mt-n1" />
                <span v-for="(s, i) in pilot.TalentsController.Talents">
                  {{ s.Talent.Name }} {{ 'I'.repeat(s.Rank) }}
                  <cc-slashes
                    v-if="i < pilot.TalentsController.Talents.length - 1"
                    class="pr-3"
                    style="opacity: 0.4"
                  />
                </span>
              </v-col>
              <v-col v-if="pilot.CoreBonusController.CoreBonuses.length" cols="auto">
                <v-icon icon="cc:corebonus" start class="mt-n1" />
                <span v-for="(b, i) in pilot.CoreBonusController.CoreBonuses">
                  {{ b.Name }}
                  <cc-slashes
                    v-if="i < pilot.CoreBonusController.CoreBonuses.length - 1"
                    class="pr-3"
                    style="opacity: 0.4"
                  />
                </span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import EditMenu from '../../PilotSheet/components/PilotEditMenu.vue';

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
    dragging: {
      type: Boolean,
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
          return 'error';
        default:
          return 'text';
      }
    },
  },
};
</script>

<style scoped>
.detail-row {
  background-color: rgb(var(--v-theme-light-panel));
  height: 128px;
  border-bottom: 1px rgb(var(--v-theme-primary)) solid;
  border-right: 1px rgb(var(--v-theme-primary)) solid;
}
</style>
