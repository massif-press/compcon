<template>
  <cc-confirm ref="confirm" />
  <cc-tabs ref="tabs" fixed>
    <template #tabs>
      <v-tab>
        <v-icon v-show="pilot.HasIdent" icon="mdi-check" />
        Identification
      </v-tab>
      <v-tab>
        <v-icon v-show="pilot.SkillsController.HasFullSkills" icon="mdi-check" />
        Skills
      </v-tab>
      <v-tab>
        <v-icon v-show="pilot.TalentsController.HasFullTalents" icon="mdi-check" />
        Talents
      </v-tab>
      <v-tab>
        <v-icon v-show="pilot.MechSkillsController.HasFullHASE" icon="mdi-check" />
        Mech Skills
      </v-tab>
      <v-tab>Confirm</v-tab>
    </template>
    <v-container>
      <template #default>
        <v-window-item>
          <identification-page
            :pilot="pilot"
            :groupID="groupID"
            @done="onDone()"
            @next="step = 1"
            @templates="step = 5"
            @set="pilot[$event.attr] = $event.val" />
        </v-window-item>
        <v-window-item>
          <skills-page :pilot="pilot" @next="step = 2" @back="step = 0" />
        </v-window-item>
        <v-window-item>
          <talents-page :pilot="pilot" @next="step = 3" @back="step = 1" />
        </v-window-item>
        <v-window-item>
          <mech-skills-page :pilot="pilot" @next="step = 4" @back="step = 2" />
        </v-window-item>
        <v-window-item>
          <confirm-page :pilot="pilot" :groupID="groupID" @back="step = 3" @done="onDone()" />
        </v-window-item>
        <v-window-item>
          <templates-page :pilot="pilot" @next="step = 4" @back="step = 1" />
        </v-window-item>
      </template>
    </v-container>
  </cc-tabs>
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
  props: {
    groupID: {
      type: String,
      required: false,
      default: 'no_group',
    },
  },
  data: () => ({
    step: 0,
    pilot: {} as Pilot,
    done: false,
  }),
  watch: {
    step(newval) {
      (this.$refs as any).tabs.setTab(newval);
    },
  },
  created() {
    this.pilot = new Pilot();
  },
  methods: {
    onDone() {
      this.done = true;
      this.$router.push(`/pilot/${this.pilot.ID}`);
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
