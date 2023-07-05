<template>
  <cc-confirm ref="confirm" />
  <div
    style="
      background-color: rgb(var(--v-theme-primary));
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50px;
    "
  />
  <v-tabs v-model="step" grow stacked bg-color="primary">
    <v-tab>
      <span class="heading h3 pt-3">
        <v-icon v-show="pilot.HasIdent" icon="mdi-check-circle-outline" />
        Identification</span
      ></v-tab
    >
    <v-tab>
      <span class="heading h3 pt-3">
        <v-icon
          v-show="pilot.SkillsController.HasFullSkills"
          icon="mdi-check-circle-outline"
        />Skills</span
      ></v-tab
    >
    <v-tab>
      <span class="heading h3 pt-3">
        <v-icon
          v-show="pilot.TalentsController.HasFullTalents"
          icon="mdi-check-circle-outline"
        />Talents</span
      ></v-tab
    >
    <v-tab>
      <span class="heading h3 pt-3">
        <v-icon
          v-show="pilot.MechSkillsController.HasFullHASE"
          icon="mdi-check-circle-outline"
        />Mech Skills</span
      ></v-tab
    >
    <v-tab><span class="heading h3 pt-3">Confirm</span></v-tab>
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
import CcConfirm from '@/ui/notification/CCConfirm.vue';

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
    CcConfirm,
  },
  data: () => ({
    step: 0,
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
  beforeRouteLeave(to, from, next) {
    if (this.done) {
      next();
    } else {
      (this.$refs as any).confirm
        .open(
          'Exit Wizard',
          'Are you sure you want to exit the wizard? Your pilot will be discarded.'
        )
        .then((confirmed) => {
          if (confirmed) {
            next();
          } else {
            next(false);
          }
        })
        .catch((error) => {
          console.error(error);
          next(false);
        });
    }
  },
};
</script>
