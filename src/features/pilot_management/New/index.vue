<template>
  <v-container fluid style="margin-top: 50px">
    <v-stepper
      v-model="step"
      non-linear
      class="elevation-0"
      style="background-color: var(--v-background-base)"
    >
      <v-stepper-header class="elevation-0" style="height: 40px">
        <v-stepper-step
          editable
          :complete="pilot.HasIdent"
          :color="pilot.HasIdent ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="1"
        >
          <span>Identification</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.HasFullSkills"
          :color="pilot.HasFullSkills ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="2"
        >
          <span>Skills</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.HasFullTalents"
          :color="pilot.HasFullTalents ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="3"
        >
          <span>Talents</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.HasFullHASE"
          :color="pilot.HasFullHASE ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="4"
        >
          <span>Mech Skills</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step editable step="5">Confirm</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <identification-page
            :pilot="pilot"
            @next="step++"
            @templates="step = 6"
            @set="pilot[$event.attr] = $event.val"
          />
        </v-stepper-content>
        <v-stepper-content step="2">
          <skills-page :pilot="pilot" @next="step++" @back="step--" />
        </v-stepper-content>
        <v-stepper-content step="3">
          <talents-page :pilot="pilot" @next="step++" @back="step--" />
        </v-stepper-content>
        <v-stepper-content step="4">
          <mech-skills-page :pilot="pilot" @next="step++" @back="step--" />
        </v-stepper-content>
        <v-stepper-content step="5">
          <confirm-page :pilot="pilot" @next="step++" @back="step--" @done="onDone" />
        </v-stepper-content>
        <v-stepper-content step="6">
          <templates-page :pilot="pilot" @next="step = 5" @back="step = 1" />
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
import TemplatesPage from './pages/TemplatesPage.vue'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'pilot-wizard',
  components: {
    IdentificationPage,
    SkillsPage,
    TalentsPage,
    MechSkillsPage,
    ConfirmPage,
    TemplatesPage,
  },
  data: () => ({
    step: 1,
    pilot: {},
    done: false,
  }),
  watch: {
    step() {
      window.scrollTo(0, 0)
    },
  },
  created() {
    this.pilot = new Pilot()
  },
  methods: {
    onDone() {
      this.done = true
      this.$router.push('./pilot_management')
    },
  },
  async beforeRouteLeave(to, from, next) {
    if (this.done) {
      next()
    } else {
      const confirmLeave = await this.$confirm(
        'Exit wizard?',
        'Are you sure you want to exit the wizard? Your pilot will be discarded.'
      )

      if (confirmLeave) next()
      else next(false)
    }
  },
})
</script>
