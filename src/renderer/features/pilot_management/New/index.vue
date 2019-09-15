<template>
  <v-container fluid style="margin-top: 50px">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step editable step="1">
          <span>Identification</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step editable step="2">
          <span>Skills</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step editable step="3">
          <span>Talents</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step editable step="4">
          <span>Mech Skills</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step step="5">Confirm</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <identification-page :new-pilot="newPilot" @next="step++" />
        </v-stepper-content>
        <v-stepper-content step="2">
          <skills-page :new-pilot="newPilot" @next="step++" />
        </v-stepper-content>
        <v-stepper-content step="3">
          <talents-page :new-pilot="newPilot" @next="step++" />
        </v-stepper-content>
        <v-stepper-content step="4">
          <mech-skills-page :new-pilot="newPilot" @next="step++" />
        </v-stepper-content>
        <v-stepper-content step="5">
          <confirm-page :new-pilot="newPilot" @next="step++" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import IdentificationPage from './pages/IdentificationPage.vue'
import SkillsPage from './pages/SkillsPage.vue'
import TalentsPage from './pages/TalentsPage.vue'
import MechSkillsPage from './pages/MechSkillsPage.vue'
import ConfirmPage from './pages/ConfirmPage.vue'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'new-pilot-wizard',
  components: { IdentificationPage, SkillsPage, TalentsPage, MechSkillsPage, ConfirmPage },
  data: () => ({
    step: 0,
    newPilot: {},
  }),
  created() {
    this.newPilot = new Pilot()
  },
})
</script>