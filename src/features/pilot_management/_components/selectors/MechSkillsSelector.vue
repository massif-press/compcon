<template>
  <div style="max-width: 1600px" class="mx-auto">
    <div class="text-center mb-4">
      <v-alert
        :value="true"
        :type="pilot.MechSkillsController.IsMissingHASE ? 'info' : 'success'"
        variant="outlined"
        class="stat-text">
        {{ pilot.MechSkillsController.CurrentHASEPoints }}/{{
          pilot.MechSkillsController.MaxHASEPoints
        }}
        Mech Skills selected
      </v-alert>
      <v-btn
        size="small"
        class="fade-select mt-2"
        color="info"
        variant="outlined"
        @click="pilot.MechSkillsController.Reset()">
        Reset Mech Skills
      </v-btn>
    </div>

    <v-row align="center">
      <v-col v-for="s in skills" xs="12" sm="12" md="6">
        <hase-skill-item
          :val="s.val"
          :text="s.text"
          :description="s.description"
          :bonuses="s.bonuses"
          :mech-skills="pilot.MechSkillsController.MechSkills"
          :isMissingHASE="isMissingHASE"
          @add="add(s.val)"
          @remove="remove(s.val)" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Pilot, HASE } from '@/class';
import HaseSkillItem from './components/_HaseSkillItem.vue';

export default {
  name: 'mech-skills-selector',
  components: { HaseSkillItem },
  props: {
    pilot: { type: Pilot, required: true },
  },
  watch: {
    'pilot.MechSkillsController.IsMissingHASE': function (newVal) {
      if (newVal === false) window.scrollTo(0, document.body.scrollHeight);
    },
  },
  computed: {
    isMissingHASE(): boolean {
      return this.pilot.MechSkillsController.IsMissingHASE;
    },
    skills() {
      return [
        {
          val: 'Hull',
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
  methods: {
    add(field: string) {
      this.pilot.MechSkillsController.MechSkills.Increment(field as HASE);
    },
    remove(field: string) {
      this.pilot.MechSkillsController.MechSkills.Decrement(field as HASE);
    },
    close() {
      this.$emit('close');
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
