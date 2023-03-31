<template>
  <v-container fluid style="margin-top: 50px">
    <v-stepper
      v-model="step"
      non-linear
      class="elevation-0"
      style="background-color: rgb(var(--v-theme-background))"
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
          :complete="pilot.SkillsController.HasFullSkills"
          :color="pilot.SkillsController.HasFullSkills ? 'success' : 'primary'"
          edit-icon="mdi-check"
          step="2"
        >
          <span>Skills</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.TalentsController.HasFullTalents"
          :color="
            pilot.TalentsController.HasFullTalents ? 'success' : 'primary'
          "
          edit-icon="mdi-check"
          step="3"
        >
          <span>Talents</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :complete="pilot.MechSkillsController.HasFullHASE"
          :color="
            pilot.MechSkillsController.HasFullHASE ? 'success' : 'primary'
          "
          edit-icon="mdi-check"
          step="4"
        >
          <span>Mech Skills</span>
        </v-stepper-step>
        <v-divider />
        <v-stepper-step editable step="5">Confirm</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content
          :class="$vuetify.display.smAndDown ? 'px-0' : ''"
          step="1"
        >
          <identification-page
            :pilot="pilot"
            :quickstart="quickstart"
            @next="step++"
            @templates="step = 6"
            @set="pilot[$event.attr] = $event.val"
          />
        </v-stepper-content>
        <v-stepper-content
          :class="$vuetify.display.smAndDown ? 'px-0' : ''"
          step="2"
        >
          <skills-page
            :pilot="pilot"
            :quickstart="quickstart"
            @next="step++"
            @back="step--"
          />
        </v-stepper-content>
        <v-stepper-content
          :class="$vuetify.display.smAndDown ? 'px-0' : ''"
          step="3"
        >
          <talents-page
            :pilot="pilot"
            :quickstart="quickstart"
            @next="step++"
            @back="step--"
          />
        </v-stepper-content>
        <v-stepper-content
          :class="$vuetify.display.smAndDown ? 'px-0' : ''"
          step="4"
        >
          <mech-skills-page
            :pilot="pilot"
            :quickstart="quickstart"
            @next="step++"
            @back="step--"
          />
        </v-stepper-content>
        <v-stepper-content
          :class="$vuetify.display.smAndDown ? 'px-0' : ''"
          step="5"
        >
          <confirm-page
            :pilot="pilot"
            :quickstart="quickstart"
            @next="step++"
            @back="step--"
            @done="onDone"
          />
        </v-stepper-content>
        <v-stepper-content
          :class="$vuetify.display.smAndDown ? 'px-0' : ''"
          step="6"
        >
          <templates-page :pilot="pilot" @next="step = 5" @back="step = 1" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import IdentificationPage from './pages/IdentificationPage.vue';
import SkillsPage from './pages/SkillsPage.vue';
import TalentsPage from './pages/TalentsPage.vue';
import MechSkillsPage from './pages/MechSkillsPage.vue';
import ConfirmPage from './pages/ConfirmPage.vue';
import TemplatesPage from './pages/TemplatesPage.vue';
import { Pilot } from '@/class';

import { UserStore } from '@/stores';

export default {
  name: 'new-pilot-wizard',
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
  computed: {
    quickstart() {
      return !!UserStore().UserProfile.GetView('quickstart');
    },
  },
  watch: {
    step() {
      window.scrollTo(0, 0);
    },
  },
  created() {
    this.pilot = new Pilot();
  },
  methods: {
    onDone() {
      this.done = true;
      this.$router.push('./pilot_management');
    },
  },
  async beforeRouteLeave(to, from, next) {
    if (this.done) {
      next();
    } else {
      const confirmLeave = await this.$confirm(
        'Exit wizard?',
        'Are you sure you want to exit the wizard? Your pilot will be discarded.'
      );

      if (confirmLeave) next();
      else next(false);
    }
  },
};
</script>
