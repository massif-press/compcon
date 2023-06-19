<template>
  <v-tabs v-model="step" grow bg-color="primary">
    <v-tab>
      <v-icon
        v-show="pilot.HasIdent"
        :color="pilot.HasIdent ? 'success' : 'primary'"
        start
        icon="mdi-check"
      />

      Identification</v-tab
    >
    <v-tab>
      <v-icon
        v-show="pilot.SkillsController.HasFullSkills"
        :color="pilot.SkillsController.HasFullSkills ? 'success' : 'primary'"
        start
        icon="mdi-check"
      />

      Skills</v-tab
    >
    <v-tab>
      <v-icon
        v-show="pilot.TalentsController.HasFullTalents"
        :color="pilot.TalentsController.HasFullTalents ? 'success' : 'primary'"
        start
        icon="mdi-check"
      />

      Talents</v-tab
    >
    <v-tab>
      <v-icon
        v-show="pilot.MechSkillsController.HasFullHASE"
        :color="pilot.MechSkillsController.HasFullHASE ? 'success' : 'primary'"
        start
        icon="mdi-check"
      />

      Mech Skills</v-tab
    >
    <v-tab>Confirm</v-tab>
  </v-tabs>
  <v-container>
    <v-window v-model="step">
      <v-window-item :value="0">
        <identification-page
          :pilot="pilot"
          :quickstart="quickstart"
          @next="step++"
          @templates="step = 5"
          @set="pilot[$event.attr] = $event.val"
        />
      </v-window-item>
      <v-window-item :value="1">
        <skills-page :pilot="pilot" :quickstart="quickstart" @next="step++" @back="step--" />
      </v-window-item>
      <v-window-item :value="2">
        <talents-page :pilot="pilot" :quickstart="quickstart" @next="step++" @back="step--" />
      </v-window-item>
      <v-window-item :value="3">
        <mech-skills-page :pilot="pilot" :quickstart="quickstart" @next="step++" @back="step--" />
      </v-window-item>
      <v-window-item :value="4">
        <confirm-page
          :pilot="pilot"
          :quickstart="quickstart"
          @next="step++"
          @back="step--"
          @done="onDone"
        />
      </v-window-item>
      <v-window-item :value="5">
        <templates-page :pilot="pilot" @next="step = 5" @back="step = 1" />
      </v-window-item>
    </v-window>
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
    pilot: {} as Pilot,
    done: false,
  }),
  computed: {
    quickstart() {
      return false;
      // return !!UserStore().UserProfile.GetView('quickstart');
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
