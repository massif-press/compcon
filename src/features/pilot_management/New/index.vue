<template>
  <cc-confirm ref="confirm" />
  <cc-tabs ref="tabs"
    fixed>
    <template #tabs>
      <v-tab value="ident">
        <v-icon v-show="pilot.HasIdent"
          icon="mdi-check" />
        Identification
      </v-tab>
      <v-tab value="skills">
        <v-icon v-show="pilot.SkillsController.HasFullSkills"
          icon="mdi-check" />
        Skills
      </v-tab>
      <v-tab value="talents">
        <v-icon v-show="pilot.TalentsController.HasFullTalents"
          icon="mdi-check" />
        Talents
      </v-tab>
      <v-tab value="mechskills">
        <v-icon v-show="pilot.MechSkillsController.HasFullHASE"
          icon="mdi-check" />
        Mech Skills
      </v-tab>
      <v-slide-x-transition mode="out-in">
        <v-tab v-if="pilot.Level > 0"
          value="licenses">
          <v-icon v-show="pilot.LicenseController.HasLicenses"
            icon="mdi-check" />
          Licenses
        </v-tab>
      </v-slide-x-transition>
      <v-slide-x-transition mode="out-in">
        <v-tab v-if="pilot.Level > 2"
          value="corebonuses">
          <v-icon v-show="pilot.CoreBonusController.HasCBs"
            icon="mdi-check" />
          Core Bonuses
        </v-tab>
      </v-slide-x-transition>
      <v-tab value="confirm">Confirm</v-tab>
    </template>
    <v-container>
      <template #default>
        <v-window-item :key="0"
          value="ident">
          <identification-page :pilot="pilot"
            :group-i-d="groupID"
            @done="onDone()"
            @next="step = 'skills'"
            @templates="step = 'templates'"
            @set="pilot[$event.attr] = $event.val" />
        </v-window-item>
        <v-window-item :key="1"
          value="skills">
          <skills-page :pilot="pilot"
            @next="step = 'talents'"
            @back="step = 'ident'" />
        </v-window-item>
        <v-window-item :key="2"
          value="talents">
          <talents-page :pilot="pilot"
            @next="step = 'mechskills'"
            @back="step = 'skills'" />
        </v-window-item>
        <v-window-item :key="3"
          value="mechskills">
          <mech-skills-page :pilot="pilot"
            @next="step = pilot.Level > 0 ? 'licenses' : 'confirm'"
            @back="step = 'talents'" />
        </v-window-item>
        <v-window-item :key="4"
          value="licenses">
          <licenses-page :pilot="pilot"
            @next="step = pilot.Level > 2 ? 'corebonuses' : 'confirm'"
            @back="step = 'mechskills'" />
        </v-window-item>
        <v-window-item :key="5"
          value="corebonuses">
          <core-bonuses-page :pilot="pilot"
            @next="step = 'confirm'"
            @back="step = 'licenses'" />
        </v-window-item>
        <v-window-item :key="6"
          value="confirm">
          <confirm-page :pilot="pilot"
            :group-i-d="groupID"
            @back="pilot.Level < 2 ? 'corebonuses' : pilot.Level > 0 ? 'licenses' : 'mechskills'"
            @done="onDone()" />
        </v-window-item>
        <v-window-item :key="7"
          value="templates">
          <templates-page :pilot="pilot"
            @next="step = 'confirm'"
            @back="step = 'ident'" />
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
import LicensesPage from './pages/LicensesPage.vue';
import CoreBonusesPage from './pages/CoreBonusesPage.vue';
import ConfirmPage from './pages/ConfirmPage.vue';
import TemplatesPage from './pages/TemplatesPage.vue';
import { Pilot } from '@/classes/pilot/Pilot'
import CcConfirm from '@/ui/notification/CCConfirm.vue';
import logger from '@/user/logger';
import { PilotStore } from '../store';
import { RemoveItem } from '@/io/Storage';

export default {
  name: 'NewPilotWizard',
  components: {
    IdentificationPage,
    SkillsPage,
    TalentsPage,
    LicensesPage,
    CoreBonusesPage,
    MechSkillsPage,
    ConfirmPage,
    TemplatesPage,
    CcConfirm,
  },
  beforeRouteLeave(to, from, next) {
    if (this.done) {
      next();
    } else {
      (this.$refs as any).confirm
        .open(
          'EXIT REGISTRATION',
          'Are you sure you want to exit the Pilot Registration process? Your pilot will be discarded.'
        )
        .then((confirmed) => {
          if (confirmed) {
            // delete pilot if it has already been saved to local data
            RemoveItem('pilots', this.pilot.ID)
              .then(() => {
                logger.info(`Deleted pilot ${this.pilot.ID} from local data`, this);
              })
              .catch((error) => {
                logger.error(`Error deleting pilot ${this.pilot.ID} from local data: ${error}`, this, error);
              });
            next();
          } else {
            next(false);
          }
        })
        .catch((error) => {
          logger.error(`Error in confirm dialog: ${error}`, this, error);
          next(false);
        });
    }
  },
  props: {
    groupID: {
      type: String,
      required: false,
      default: 'no_group',
    },
  },
  data: () => ({
    step: 'ident',
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
};
</script>
