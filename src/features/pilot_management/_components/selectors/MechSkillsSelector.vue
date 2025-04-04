<template>
  <v-card-text>
    <div class="mb-4">
      <cc-alert
        :color="pilot.MechSkillsController.IsMissingHASE ? 'warning' : 'success'"
        class="stat-text text-center">
        {{ pilot.MechSkillsController.CurrentHASEPoints }}/{{
          pilot.MechSkillsController.MaxHASEPoints
        }}
        Mech Skills selected
      </cc-alert>
      <div class="text-right">
        <v-btn
          size="x-small"
          color="accent"
          variant="text"
          @click="pilot.MechSkillsController.Reset()">
          Reset Mech Skills
        </v-btn>
      </div>
    </div>

    <v-row align="center">
      <v-col v-for="s in skills" cols="12" md="6" class="mb-6">
        <div class="heading h3 text-accent">
          {{ s.text }}
        </div>
        <p v-html="s.description" class="flavor-text px-2 mb-3" />
        <v-row no-gutters justify="center" align="start">
          <v-col cols="auto">
            <cc-tickbar
              :icon="!mobile && s.icon"
              :size="mobile ? 'small' : 'default'"
              color="accent"
              controls
              :stop-add="pilot.MechSkillsController.HasFullHASE"
              :max-selectable="
                pilot.MechSkillsController.MaxHASEPoints -
                pilot.MechSkillsController.CurrentHASEPoints
              "
              v-model="pilot.MechSkillsController.MechSkills[s.val]" />
          </v-col>
        </v-row>
        <div class="text-center py-2">
          <span v-for="(b, i) in s.bonuses" class="heading h3">
            {{ b.text }}
            <span class="text-accent">+{{ b.value }}</span>
            <cc-slashes v-if="s.bonuses.length > i + 1" class="mx-2" />
          </span>
        </div>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import { Pilot, HASE } from '@/class';

export default {
  name: 'mech-skills-selector',
  props: {
    pilot: { type: Pilot, required: true },
  },
  watch: {
    'pilot.MechSkillsController.IsMissingHASE': function (newVal) {
      if (newVal === false) window.scrollTo(0, document.body.scrollHeight);
    },
    'pilot.MechSkillsController.CurrentHASEPoints': function () {
      this.pilot.SaveController.save();
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    skills() {
      return [
        {
          val: 'Hull',
          icon: 'mdi-alpha-h-box-outline',
          text: 'Hull',
          description:
            'Your HULL skill describes your ability to build and pilot durable, heavy mechs that can take punches and keep going',
          bonuses: [
            { text: 'MECH HP', value: this.pilot.MechSkillsController.MechSkills.Hull * 2 },
            {
              text: 'REPAIR CAPACITY',
              value: Math.floor(this.pilot.MechSkillsController.MechSkills.Hull / 2),
            },
          ],
        },
        {
          val: 'Agi',
          icon: 'mdi-alpha-a-box-outline',
          text: 'Agility',
          description:
            'Your AGILITY skill describes your ability to build and pilot fast, evasive mechs',
          bonuses: [
            { text: 'EVASION', value: this.pilot.MechSkillsController.MechSkills.Agi },
            {
              text: 'SPEED',
              value: Math.floor(this.pilot.MechSkillsController.MechSkills.Agi / 2),
            },
          ],
        },
        {
          val: 'Sys',
          icon: 'mdi-alpha-s-box-outline',
          text: 'Systems',
          description:
            'Your SYSTEMS skill describes your ability to build and pilot technical mechs with powerful electronic warfare tools',
          bonuses: [
            { text: 'ELECTRONIC DEFENSE', value: this.pilot.MechSkillsController.MechSkills.Sys },
            {
              text: 'TECH ATTACK',
              value: this.pilot.MechSkillsController.MechSkills.Sys,
            },
            {
              text: 'SP',
              value: Math.floor(this.pilot.MechSkillsController.MechSkills.Sys / 2),
            },
          ],
        },
        {
          val: 'Eng',
          icon: 'mdi-alpha-e-box-outline',
          text: 'Engineering',
          description:
            'Your ENGINEERING skill describes your ability to build and pilot mechs with powerful reactors, supplies and support systems',
          bonuses: [
            { text: 'HEAT CAPACITY', value: this.pilot.MechSkillsController.MechSkills.Eng },
            {
              text: 'LIMITED SYSTEMS BONUS',
              value: Math.floor(this.pilot.MechSkillsController.MechSkills.Eng / 2),
            },
          ],
        },
      ];
    },
  },
};
</script>

<style scoped>
.bonus-text {
  position: relative;
  bottom: 20px;
}
</style>
